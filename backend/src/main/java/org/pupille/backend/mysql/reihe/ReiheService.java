package org.pupille.backend.mysql.reihe;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReiheService {

    private final ReiheRepository reiheRepository;
    private final TerminRepository terminRepository;

//    When would @Transactional matter for delete?
//          You have more than one modifying repository call in the same method, and want them to succeed/fail together (example: delete A, then delete B, but if B fails, rollback A as well).
//          !!! Also when there is only 1 modifying repository call @Transactional can be required !!!
//          => see updateTerminverknuepfung in TerminverknuepfungService: Even without the save call heere @Transctional ensures the deletion is reverted when a RuntimeException occurs during step 2
//          Your method does other related flushes/modifications that must be atomic.
//          You have special transactional requirements (propagation, isolation, etc.)


    @Transactional(readOnly = true)     // Good practice for read-only operations
                                        // Optimizes for reads: Tells the transaction manager and the underlying database that no data will be modified.
                                        // This can allow for database optimizations (e.g., fewer locks, skipping dirty checks in Hibernate), and sometimes uses a different transaction isolation mode internally.
    public List<ReiheDTOSelection> getAllReihen() {
        return reiheRepository.findAll(Sort.by(Sort.Direction.ASC, "titel")) // use JpaRepository's built-in sorting instead of defining a custom query in ReiheRepository => The sorting is done in the database, not in your service method.
                .stream()
                .map(ReiheDTOSelection::new)
                .collect(Collectors.toList());
    }

    // --- Read one and convert to DTO ---
    @Transactional(readOnly = true) // Good practice for read-only operations
    public ReiheDTOFormWithTermineAndFilme getReiheDTOFormByIdWithTermineAndFilms(Long id) {
        Reihe reihe = reiheRepository.findWithTermineAndFilmsByRnr(id) // this uses @EntityGraph
                .orElseThrow(() -> new RuntimeException("Reihe not found with ID " + id));
        // DTO conversion happens here, within the open transaction, but the data was already fetched in one go by the repository
        return new ReiheDTOFormWithTermineAndFilme(reihe);
    }

    // updateReihe and deleteReihe service methods use this method, which returns a Reihe object
    public Reihe getReiheById(Long id) {
        return reiheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reihe not found with ID " + id));
    }

    // addTerminToReihe service method use this method
    public Reihe getReiheByIdWithTermine(Long id) {
        return reiheRepository.findWithTermineByRnr(id) // this uses @EntityGraph
                .orElseThrow(() -> new RuntimeException("Reihe not found with ID " + id));
    }

    public Reihe createReihe(Reihe reihe) {
        return reiheRepository.save(reihe);
    }

    // @Transactional // redundant because method only performs one modifying operation as the very last operation
    public Reihe updateReihe(Long id, Reihe updatedReihe) {
        Reihe existing = getReiheById(id);
        existing.setTitel(updatedReihe.getTitel());
        existing.setText(updatedReihe.getText());
        existing.setSonderfarbe(updatedReihe.getSonderfarbe());
        return reiheRepository.save(existing);
    }

    public void deleteReihe(Long id) {
        Reihe reihe = getReiheById(id);
        reiheRepository.delete(reihe);
    }

    // ---------------------------------------------------------------------------------------------
    // --- Get a list of Reihen for a given Tnr ---
    public List<ReiheDTOSelection> getAllReihenByTerminId(Long tnr) {
        Termin termin = terminRepository.findById(tnr)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with ID " + tnr));

        Set<Reihe> reihen = termin.getReihen(); // many-to-many relationship
        return reihen.stream()
                .map(ReiheDTOSelection::new)
                .toList();
    }

    // #####################################################################
    // --- Get a list of Reihen with all its Termine & Films belonging to one Reihe for a given Tnr ---
    @Transactional(readOnly = true)
    public List<ReiheDTOFormWithTermineAndFilme> getAllReihenByTerminIdWithAllItsTermineAndFilms(Long tnr) {
        Termin termin = terminRepository.findWithReihenAndTermineAndFilmsByTnr(tnr)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with ID " + tnr));

        Set<Reihe> reihen = termin.getReihen(); // many-to-many relationship

        return reihen.stream()
                .map(ReiheDTOFormWithTermineAndFilme::new) // the constructors (also nested) contain the main logic
                .toList();
    }

    // #####################################################################
    // --- Add Termin to Reihe ---
    @Transactional // This method definitely needs @Transactional as it modifies state
    public Reihe addTerminToReihe(Long reiheId, Long terminId) {
        Reihe reihe = getReiheByIdWithTermine(reiheId); // Fetching 'reihe' here (with ReiheService method getReiheById above) will include its 'termine' due to @EntityGraph

        Termin termin = terminRepository.findWithReihenByTnr(terminId) // Fetch Termin (eagerly with reihen due to @EntityGraph)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with id: " + terminId));

        reihe.getTermine().add(termin);
        // Updating Both Sides for bidirectional consistency
        // it's a must do, unless using Cascade Operations CascadeType in the relating entity classes
        termin.getReihen().add(reihe);

        // Saving the owning side (Reihe) typically cascades the changes to the join table.
        // It's good practice to save both sides if the relationship is bidirectional and you're modifying both collections within the same transaction.
        terminRepository.save(termin);
        // Save the owning side (reihe)
        return reiheRepository.save(reihe);
    }

    // --- Remove Termin from Reihe ---
    @Transactional
    public void removeTerminFromReihe(Long reiheId, Long terminId) {
        Reihe reihe = getReiheByIdWithTermine(reiheId); // Fetching 'reihe' here (with ReiheService method getReiheById above) will include its 'termine' due to @EntityGraph

        Termin termin = terminRepository.findWithReihenByTnr(terminId) // Fetch Termin (eagerly with reihen due to @EntityGraph)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with id: " + terminId));

        // Attempt to remove the termin from the reihe's set, i.e. reihe object has field termine, which is a set of Termin objects; removal of termin from this set
        // In-Memory Change: You are modifying the termine Set within the reihe object in your application's memory
        // Because you fetched reihe using reiheRepository.findById(reiheId) within a @Transactional method, the reihe object is now a "managed entity" within the JPA Persistence Context (also Hibernate Session). This means Hibernate is actively tracking any changes made to this reihe object and its managed collections.
        boolean removedFromReihe = reihe.getTermine().remove(termin); // => "This reihe no longer has this termin associated with it."

        // Attempt to remove the reihe from the termin's set (for bidirectional consistency)
        boolean removedFromTermin = termin.getReihen().remove(reihe);

        if (!removedFromReihe && !removedFromTermin) {
            // This means the connection didn't exist in either collection
            throw new NoSuchElementException("Connection between Reihe " + reiheId + " and Termin " + terminId + " not found.");
        }

        // Save the owning side (Reihe) to persist the change to the join table.
        //      Triggering the Delete: By calling reiheRepository.save(reihe) (or if the transaction simply commits and Hibernate performs its dirty checking), Hibernate detects that the termine collection of the managed reihe entity has changed. Because Reihe is the owning side, Hibernate translates this in-memory collection modification into a DELETE SQL statement for the corresponding row in the reihe_terminverknuepfung join table.
        //      What is saved/synchronized: You're not saving the Reihe entity's attributes (like titel, text, farbe) themselves in this specific operation (unless you changed them). What's being synchronized is the state of its termine collection, which dictates the entries in the join table.
        //      => reiheRepository.save(reihe) is the one that directly causes the row to be deleted from the reihe_terminverknuepfung join table because Reihe is the owning side. It's synchronizing the state of the termine collection.
        reiheRepository.save(reihe);

        // Saving Termin is also good practice for consistency of its collection.
        //      Non-Owning Side and Bidirectional Consistency: The Termin entity is the non-owning side (@ManyToMany(mappedBy = "termine")). Changes to the non-owning side's collection (termin.getReihen().remove(reihe)) do not directly trigger SQL updates to the join table. The join table is managed solely by the owning side.
        //      Consistency within the Persistence Context: When you add/remove elements from both sides of a bidirectional relationship, it's crucial to update both entity objects in memory. If you only updated reihe and then, later in the same transaction, tried to access termin.getReihen(), it might still contain the reihe because its in-memory state hasn't been explicitly synchronized.
        //      => terminRepository.save(termin) is for maintaining the correct in-memory state of the termin object within the current transaction/persistence context, particularly for its reihen collection, even though it doesn't directly trigger the join table modification. It's about ensuring bidirectional consistency in your application's state.
        terminRepository.save(termin);
    }
}