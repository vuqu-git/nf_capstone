package org.pupille.backend.mysql.termin;

import org.pupille.backend.mysql.clicks.Clicks;
import org.pupille.backend.mysql.clicks.ClicksRepo;
import org.pupille.backend.mysql.reihe.Reihe;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class TerminService {

    private final TerminRepository terminRepository;
    private final ClicksRepo clicksRepo;

    //@Autowired
    public TerminService(TerminRepository terminRepository, ClicksRepo clicksRepo) {
        this.terminRepository = terminRepository;
        this.clicksRepo = clicksRepo;
    }

    public List<TerminProjectionSelection> getAllTermineByOrderByVorstellungsbeginnDesc() {
        // alternative but this one doesn't return TerminProjectionSelection for List : terminRepository.findAll(Sort.by(Sort.Direction.DSC, "vorstellungsbeginn")) // use JpaRepository's built-in sorting instead of defining a custom query in TerminRepository
        return terminRepository.findAllByOrderByVorstellungsbeginnDesc();
    }

    public List<TerminDTOWithMainfilms> getAllTermineWithMainfilmeByOrderByVorstellungsbeginnDesc() {
        return terminRepository.findWithMainfilmeAllByOrderByVorstellungsbeginnDesc()
                .stream()
                .map(TerminDTOWithMainfilms::new)
                .toList();
        // return terminRepository.findWithMainfilmeAllByOrderByVorstellungsbeginnDesc(); // this one is enough, when the repo method return type List<TerminDTOWithMainfilms>
    }

    public Optional<TerminDTOForm> getTerminById(Long tnr) {
        return terminRepository.findById(tnr)
                .map(TerminDTOForm::new)
                .map(Optional::of)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with id " + tnr));
    }

    // ***************
                    // helper function for service methods createTermin and updateTermin
                    private void createClicksForTermin(Termin termin) {
                        Clicks clicks = new Clicks();

                        // set the relationship - @MapsId will automatically set clicks.tnr = termin.tnr
                        clicks.setTermin(termin);

                        // all fields except titel and visitors are set during creation
                        clicks.setVorstellungsbeginn(termin.getVorstellungsbeginn());
                        clicks.setSessionScreeningClicks(0L);
                        clicks.setUserScreeningClicks(0L);
                        clicks.setSessionCalendarClicks(0L);
                        clicks.setUserCalendarClicks(0L);
                        clicks.setOnlineSince(LocalDate.now());
                        clicks.setInsideProgrammheft(true);
                        clicks.setWithTerminbesonderheit(termin.getBesonderheit() != null);
                        clicks.setInNumberReihen((short) termin.getReihen().size());

                        clicksRepo.save(clicks);
                    }

    public TerminDTOForm createTermin(Termin termin) {
        // Do NOT set termin.setTnr(someValue) because we use auto-increment in the db
        Termin savedTermin = terminRepository.save(termin);

        // -- relation to Clicks --
        // creation of corresponding Clicks record, when Termin is veroeffentlicht
        if (savedTermin.getVeroeffentlichen() != null && savedTermin.getVeroeffentlichen() > 0) {
            createClicksForTermin(savedTermin);
        }
        // ------------------------

        return new TerminDTOForm(savedTermin);
    }

    public TerminDTOForm updateTermin(Long tnr, Termin terminDetails) {
        return terminRepository.findById(tnr)
//        return terminRepository.findWithReihenByTnr(tnr) // when use this line, test methods in TerminServiceTest need to be changed accordingly
                .map(termin -> {
                    termin.setVorstellungsbeginn(terminDetails.getVorstellungsbeginn());
                    termin.setTitel(terminDetails.getTitel());
                    termin.setText(terminDetails.getText());
                    termin.setKurztext(terminDetails.getKurztext());
                    termin.setBesonderheit(terminDetails.getBesonderheit());
                    termin.setBild(terminDetails.getBild());
                    termin.setOffsetImageInGallery(terminDetails.getOffsetImageInGallery());
                    termin.setShowImageInDetails(terminDetails.getShowImageInDetails());
                    termin.setStartReservierung(terminDetails.getStartReservierung());
                    termin.setLinkReservierung(terminDetails.getLinkReservierung());
                    termin.setSonderfarbeTitel(terminDetails.getSonderfarbeTitel());
                    termin.setSonderfarbe(terminDetails.getSonderfarbe());
                    termin.setVeroeffentlichen(terminDetails.getVeroeffentlichen());
                    termin.setPatenschaft(terminDetails.getPatenschaft());
                    termin.setIsCanceled(terminDetails.getIsCanceled());

                    // Save the updated termin
                    Termin savedTermin = terminRepository.save(termin);

                    // -- relation to Clicks --
                    // possible creation of corresponding Clicks record, when Termin is veroeffentlicht
                    if (savedTermin.getVeroeffentlichen() != null && savedTermin.getVeroeffentlichen() > 0) {
                        // only create if it doesn't already exist
                        if (!clicksRepo.existsById(savedTermin.getTnr())) {
                            createClicksForTermin(savedTermin);
                        }

                        // update Clicks fields
                        Clicks clicks = clicksRepo.findById(savedTermin.getTnr())
                                .orElseThrow(() -> new NoSuchElementException("Clicks not found with id " + savedTermin.getTnr()));

                        clicks.setVorstellungsbeginn(savedTermin.getVorstellungsbeginn());
                        clicks.setWithTerminbesonderheit(savedTermin.getBesonderheit() != null && !savedTermin.getBesonderheit().isEmpty());
                        clicks.setInNumberReihen((short) savedTermin.getReihen().size());

                        // Save the updated Clicks
                        clicksRepo.save(clicks);

                        // !!! Attention: No update of Click field titel !!!
                        // => this is done in ClicksService method trackClicks, when titel (can be Termin titel or titel of mainfilms[0]) is within post request from frontend
                    }
                    // ------------------------

                    return new TerminDTOForm(savedTermin);
                })
                .orElseThrow(() -> new NoSuchElementException("Termin not found with id " + tnr));
    }

//    // this simple delete doesn't work because of the relationships (join table reihe_terminverknuepfung)!
//    public void deleteTermin(Long tnr) {
//        terminRepository.deleteById(tnr);
//    }

    // THIS is working delete to account for relationships with Reihe
    // approach here: clean up relationships before deletion
    public void deleteTermin(Long tnr) {
        Optional<Termin> terminOpt = terminRepository.findById(tnr);
        if (terminOpt.isPresent()) {
            Termin terminToDelete = terminOpt.get();

            // ********************************************************
            // In a bidirectional many-to-many relationship, you have collections on both sides that reference each other.
            // When you want to break these relationships, you need to clean up both sides to maintain consistency

            // Step 1: Remove this termin from all associated reihen
            for (Reihe r : terminToDelete.getReihen()) {    // like looping over all Reihe objects that are currently associated with terminToDelete
                                                            // i.e. Reihe object, where tnr of the connection (rnr, tnr) matches the deleted Termin's ID (ID of terminToDelete)
                r.getTermine().remove(terminToDelete);      // for each Reihe r, remove the Termin object terminToDelete from its termine collection
                                                            // Since Reihe is the owning side of the relationship (it has the @JoinTable), THIS is what actually triggers the deletion from the join table reihe_terminverknuepfung
            }

            // Step 2: Clear the reihen set on the termin side
            terminToDelete.getReihen().clear(); // empties the Set, clear() method removes all elements from the collection
                                                // This doesn't directly affect the database (since Termin is on the "mapped by" side)
                                                // But it ensures the in-memory object state is consistent


            // Why Both Steps Matter:
            //      Step 1 is essential - It's what actually removes the database relationships
            //      Step 2 is for consistency - It ensures the object in memory reflects the actual state
            // Without Step 1, the foreign key constraint error would occur. Without Step 2, you'd have inconsistent object state in memory (though it wouldn't cause database errors).
            // This is a common pattern in JPA bidirectional relationships: always update both sides when modifying relationships.


            // Visual Example
            // ~~~~~~~~~~~~~~
            // Let's say you have:
            // Termin with tnr = 1
            // Associated with Reihe objects with rnr = 10, 20, 30

            // Before cleanup:
            // Termin(1).reihen = [Reihe(10), Reihe(20), Reihe(30)]
            // Reihe(10).termine = [Termin(1), ...]
            // Reihe(20).termine = [Termin(1), ...]
            // Reihe(30).termine = [Termin(1), ...]
            //
            // Join table: (10,1), (20,1), (30,1)

            // After Step 1 (removing from owning side):
            // Termin(1).reihen = [Reihe(10), Reihe(20), Reihe(30)]  // Still there
            // Reihe(10).termine = [...]  // Termin(1) removed
            // Reihe(20).termine = [...]  // Termin(1) removed
            // Reihe(30).termine = [...]  // Termin(1) removed
            //
            // Join table: (empty for tnr=1)  // JPA removes these!

            // After Step 2 (clearing mapped side):
            // Termin(1).reihen = []  // Now cleared
            // Reihe(10).termine = [...]
            // Reihe(20).termine = [...]
            // Reihe(30).termine = [...]
            //
            // Join table: (empty for tnr=1)


            // Alternative
            // different approach: use a custom query to delete from join table first
                    // @Repository
                    // public interface TerminRepository extends JpaRepository<Termin, Long> {
                    //
                    //    @Modifying // for data-modifying operations, you MUST explicitly mark them with @Modifying
                    //    @Query(value = "DELETE FROM reihe_terminverknuepfung WHERE tnr = ?1", nativeQuery = true)
                    //    void deleteTerminFromJoinTable(Long tnr);
                    //}

                    // @Transactional
                    // public void deleteTermin(Long tnr) {
                    //    terminRepository.deleteTerminFromJoinTable(tnr);
                    //    terminRepository.deleteById(tnr);
                    //}

            // ********************************************************

            // Now delete the termin
            terminRepository.deleteById(tnr);
        }
    }

    // ########################################################################
////  both methods here are just only used for controller for testing purposes
//    public List<TerminDTOForm> getAllFutureTermine() {
//        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
//        LocalTime fixedTime = LocalTime.of(0, 1);
//        // Combine the current date and the fixed time
//        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);
//
//        List<Termin> futureTermine = terminRepository.findAllFutureTermine(now);
//        return futureTermine.stream()
//                .map(TerminDTOForm::new)
//                .collect(Collectors.toList());
//    }
//
//    // If you need the projected results:
//    public List<TerminProjectionSelection> getAllFutureTermineProjected() {
//        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
//        LocalTime fixedTime = LocalTime.of(0, 1);
//        // Combine the current date and the fixed time
//        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);
//        return terminRepository.findAllFutureTermineProjected(now);
//    }
    // ########################################################################

}