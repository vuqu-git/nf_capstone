package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.film.FilmDTOForm;
import org.pupille.backend.mysql.reihe.ReiheDTOGallery;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminDTOScreeningdetails;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.pupille.backend.mysql.terminverknuepfung.Terminverknuepfung;
import org.pupille.backend.mysql.terminverknuepfung.TerminverknuepfungRepository;
import org.pupille.backend.utils.PupilleUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ScreeningService {

    private final TerminRepository terminRepository;
    private final TerminverknuepfungRepository terminverknuepfungRepository;

    //@Autowired // Constructor injection (recommended)
    public ScreeningService(TerminRepository terminRepository,
                            TerminverknuepfungRepository terminverknuepfungRepository) {
        this.terminRepository = terminRepository;
        this.terminverknuepfungRepository = terminverknuepfungRepository;
    }

    // filter for veroeffentlichen > 0 happens in frontend react component Gallery2.tsx
    public List<TerminDTOWithFilmAndReiheDTOGallery> getAllFutureTermineWithFilms() {

        // -- 0. Set the "now" date as today but right after midnight (today's screening should still appear even though we're past their screening time)
        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
        LocalTime fixedTime = LocalTime.of(0, 1);
        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);

        // -- 1. Get future Termine
        List<Termin> futureTermine = terminRepository.findAllFutureTermineWithReihen(now);

        // -- 2. Get related films in batch
        //  !! no access films directly from the futureTermine: instead batch/bulk fetch them via findByTerminIdsWithFilms(terminIds)
        //  i.e fetch connections with films for the relevant Termine
        List<Long> futureTerminIds = futureTermine.stream()
                .map(Termin::getTnr)
                .toList();

        List<Terminverknuepfung> connectionsByTerminIds = terminverknuepfungRepository.findByTerminIdsWithFilms(futureTerminIds);

        //        What about connectionsByTerminIds? (Could be used in @EntityGraph(attributePaths = {"filmConnections"} for findAllFutureTermine with TerinRepositroy)
        //          I'm NOT accessing termin.getFilmConnections() in this code. I fetch all needed Terminverknuepfung rows in bulk via a repository using the batch of terminIds.

        //        Why is batch-fetching related films via findByTerminIdsWithFilms(terminIds) a good pattern?
                    //        This is a good pattern for several important reasons:
                    //        a. Avoids the N + 1 Select Problem
                    //              If you loop over future Termine and do something like termin.getFilmConnections() (assuming it's a lazy relationship), Hibernate would issue one query for the list of (future) Termin, then potentially one query per Termin for its film connections, and further queries for each film. For lots of Termine, this leads to tons of separate SQL statements ("N+1 problem").
                    //              By collecting all the IDs and fetching the related entities in a single custom query, you remove these extra per-entity SQL queries.
                    //              Limit this data strictly to those connected with the relevant list of Termine you care about (future Termine in your case), rather than fetching all records or loading lazy collections on each Termin individually.
                    //        b. Better Control and Readability
                    //              You explicitly define when and how you want to load the related entities, making the code easier to understand and maintain. You know exactly when the related data is loaded.
                    //        c. Flexible Filtering/Joining
                    //              You can fine-tune your JOIN conditions and fetched attributes. For instance, you can filter rows, join additional data, or fetch only the desired subset (e.g., excluding vorfilms, if you want).
                    //        d. Performance
                    //              Fetching everything in one or two SQL queries is orders of magnitude more efficient than issuing one-per-parent-entity, especially as your dataset grows.
                    //        e. Decoupling
                    //              It allows the Termin entity and its relationships to remain LAZY in JPA, which is often the optimal default, and leaves loading decisions to your service layer.

        // -- 3. Map to DTO, filtering out films where vorfilm is true
        return futureTermine.stream()
                .map(fTermin -> {
                    // Check if titel of Termin object exists (not null/empty)
                    if (fTermin.getTitel() != null && !fTermin.getTitel().isBlank()) {
                        return new TerminDTOWithFilmAndReiheDTOGallery(
                                fTermin,
                                List.of(), // !!! Empty films list when titel is present !!!
                                fTermin.getReihen()
                        );
                    } else {
                        // Include main films only when titel is absent
                        List<Film> films = connectionsByTerminIds.stream() // connectionsByTerminIds contain Terminverknuepfung entities (plural!) where the tnrs belongs to future Termine (see the query in findByTerminIdsWithFilms)
                                .filter(tv -> tv.getTnr().equals(fTermin.getTnr()))   // It filters the list of all fetched Terminverknuepfungs down to only those linked to the current Termin (fTermin)
                                                                                                        // assemble the appropriate subset of films (fnrs) for each Termin in your list of future Termine
                                                                                                        // i.e. for each specific Termin (fTermin) in the futureTermine list, I filter those connections to just those that match this fTermin by its ID tnr
                                                                                                        // because Terminverknuepfung explicitly contains the tnr FK column as a regular field, you can simply use tv.getTnr() — that is the FK value without fetching Termin i.e. filter/match by tv.tnr instead of tv.termin.tnr
                                .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())
                                .map(Terminverknuepfung::getFilm)
                                .toList();
                        return new TerminDTOWithFilmAndReiheDTOGallery(
                                fTermin,
                                films,
                                fTermin.getReihen()
                        );
                    }
                })
                .toList();
    }

    public ReihenAndFilmTermineForGallery getReihenAndTermineForGallery() {
        // Get all rest termine with films + remaining reihen of the semester; rest i.e. future from now date
        List<TerminDTOWithFilmAndReiheDTOGallery> termineSemester = getAllFutureTermineWithFilms();

        // Collect all unique reihen.titel values, ignoring null/empty
        List<String> reihenSemester = termineSemester.stream()
                .flatMap(termin -> termin.reihen().stream()) // stream of all reihen in all termine
                .map(ReiheDTOGallery::getTitel)
                .filter(Objects::nonNull)
                .distinct()                                // unique
                .sorted()                                  // A–Z, case-sensitive
                .toList();

        return new ReihenAndFilmTermineForGallery(reihenSemester, termineSemester);
    }


//    ########################################################

    public TerminDTOWithFilmsDTOFormPlus getTerminWithFilmsPlusByTnr(Long tnr) {
        // Fetch Termin
        Termin termin = terminRepository.findById(tnr)
                .orElseThrow(() -> new NoSuchElementException("Termin not found with ID " + tnr));

        // Get from Termin with tnr all connections with films
        List<Terminverknuepfung> connectionsByTerminIds = terminverknuepfungRepository.findByTnrWithFilms(tnr);

        // Split and sort
        Map<Boolean, List<Terminverknuepfung>> groupedConnectionsMap = connectionsByTerminIds.stream()
                .collect(Collectors.partitioningBy(
                        tv -> Boolean.TRUE.equals(tv.getVorfilm())
                ));

        Comparator<Terminverknuepfung> rangComparator = Comparator.comparing(
                Terminverknuepfung::getRang,
                Comparator.nullsFirst(Short::compare)
        );

        List<FilmDTOFormPlus> mainFilms = groupedConnectionsMap.get(false).stream()
                .sorted(rangComparator)
                .map(this::convertToFilmDTO)
                .toList();

        List<FilmDTOFormPlus> vorfilms = groupedConnectionsMap.get(true).stream()
                .sorted(rangComparator)
                .map(this::convertToFilmDTO)
                .toList();

        int terminGesamtlaufzeit = Stream.concat(mainFilms.stream(), vorfilms.stream())
                .map(f -> f.getFilm().getLaufzeit())  // Extract laufzeit (could be null)
                .filter(Objects::nonNull)             // Ignore null values
                .mapToInt(Integer::intValue)          // Convert to primitive int
                .sum();                               // Sum remaining values

        return new TerminDTOWithFilmsDTOFormPlus(
                new TerminDTOScreeningdetails(termin),
                mainFilms,
                vorfilms,
                terminGesamtlaufzeit
        );
    }

            // ***** utils method *****
            private FilmDTOFormPlus convertToFilmDTO(Terminverknuepfung tv) {
                return new FilmDTOFormPlus(
                        new FilmDTOForm(tv.getFilm()),
                        tv.getVorfilm(),
                        tv.getRang()
                );
            }

//    ########################################################
    // similar to getAllFutureTermineWithFilms above
    public List<TerminDTOWithFilmDTOOverviewArchive> getAllPastTermineWithFilms() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Europe/Berlin"));

        // -- 1. Get past Termine
        List<Termin> pastTermine = terminRepository.findAllPastTermine(now);

        // -- 2. Get related films in batch
        //  !! no access films directly from the futureTermine: instead batch/bulk fetch them via findByTerminIdsWithFilms(terminIds)
        //  i.e fetch connections with films for the relevant Termine
        List<Long> terminIds = pastTermine.stream()
                .map(Termin::getTnr)
                .collect(Collectors.toList()); // Explicit collection

        List<Terminverknuepfung> connectionsByTerminIds = terminverknuepfungRepository.findByTerminIdsWithFilms(terminIds);

        return pastTermine.stream()
                .map(pTermin -> {
                    List<Film> films = connectionsByTerminIds.stream()
                            .filter(tv -> tv.getTnr().equals(pTermin.getTnr()))
                            .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())
                            .map(Terminverknuepfung::getFilm)
                            .collect(Collectors.toList()); // Explicit collection
                    return new TerminDTOWithFilmDTOOverviewArchive(pTermin, films);
                })
                .collect(Collectors.toList()); // Convert stream to List
    }

    public List<TerminDTOWithFilmDTOOverviewSemester> getTermineByCurrentSemester() {

        // -- 1. Get Termine of current semester; call with distinct semester boundaries:
        PupilleUtils.SemesterDates semesterDates = PupilleUtils.calculateCurrentSemesterDates();

        List<Termin> termineInSemester = terminRepository.findTermineByCurrentSemester(
                semesterDates.now(),
                semesterDates.startDateSummer(),
                semesterDates.endDateSummer(),
                semesterDates.endDateWinter(),
                semesterDates.endDateWinter()
        );

        // -- 2. Get related films in batch
        //  !! no access films directly from the termineInSemester: instead batch/bulk fetch them via findByTerminIdsWithFilms(terminIds)
        //  i.e fetch connections with films for the relevant Termine
        List<Long> terminIds = termineInSemester.stream()
                .map(Termin::getTnr)
                .collect(Collectors.toList());

        Map<Long, List<Terminverknuepfung>> connectionsByTerminIdsMap = terminverknuepfungRepository
                .findByTerminIdsWithFilms(terminIds)
                .stream()
                .collect(Collectors.groupingBy(tv -> tv.getTnr()));   // .collect(Collectors.groupingBy(tv -> tv.getTnr())) collects the stream elements into a Map.
                                                                                        // The key of the map is the tnr value of each Terminverknuepfung (i.e., the ID of the corresponding Termin).
                                                                                        // The value is a list(!) of all Terminverknuepfung objects that share the same tnr
                                                                                        // i.e. I get a Map<Long, List<Terminverknuepfung>>
                                                                                        //    Why is this useful?
                                                                                        //       It enables efficient lookup of all film connections belonging to a specific Termin by its ID.
                                                                                        //       Avoids repeatedly filtering the entire list when you need to access the connections related to a single Termin.
                                                                                        //       Simplifies your code when building DTOs — you can quickly get all film connections for each Termin without overhead.


        return termineInSemester.stream()
                .map(sTermin -> {
                    List<Terminverknuepfung> connections = connectionsByTerminIdsMap.getOrDefault(sTermin.getTnr(), List.of()); // if map does NOT contain that key, it returns the default value — here, List.of(), which is an immutable empty list

                    List<Film> mainfilms = new ArrayList<>();
                    List<Film> vorfilms = new ArrayList<>();

                    for (Terminverknuepfung tv : connections) {
                        if (Boolean.TRUE.equals(tv.getVorfilm())) {
                            vorfilms.add(tv.getFilm());
                        } else {
                            mainfilms.add(tv.getFilm());
                        }
                    }

                    int terminGesamtlaufzeit = Stream.concat(mainfilms.stream(), vorfilms.stream())
                            .map(Film::getLaufzeit)
                            .filter(Objects::nonNull)
                            .mapToInt(Integer::intValue)
                            .sum();

                    return new TerminDTOWithFilmDTOOverviewSemester(sTermin, mainfilms, sTermin.getReihen(), terminGesamtlaufzeit);
                })
                .toList();
    }

    public ReihenAndFilmTermineForOverviewSemester getReihenAndTermineForOverviewSemester() {
        // Get all termine with films + reihen of the whole semester
        List<TerminDTOWithFilmDTOOverviewSemester> termineSemester = getTermineByCurrentSemester();

        // Collect all unique reihen.titel values, ignoring null/empty
        List<String> reihenSemester = termineSemester.stream()
                .flatMap(termin -> termin.reihen().stream()) // stream of all reihen in all termine
                                                                                            // reihen collections are already loaded in memory, and no additional lazy-loading queries will be triggered
                                                                                            // because it's eager fetched within getTermineByCurrentSemester and terminRepository.findTermineByCurrentSemester
                .map(ReiheDTOGallery::getTitel)
                .filter(Objects::nonNull)
                .distinct()                                // unique
                .sorted()                                  // A–Z, case-sensitive
                .toList();

        return new ReihenAndFilmTermineForOverviewSemester(reihenSemester, termineSemester);
    }

                //    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsSlideshow() {
                //        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
                //        LocalTime fixedTime = LocalTime.of(0, 1);
                //        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);
                //
                //        List<Termin> futureTermine = terminRepository.findFutureTermine(now);
                //        if (futureTermine.isEmpty() || futureTermine.size() == 1) {
                //            return List.of(); // Either no future Termine or only one (which we must exclude)
                //        }
                //
                //        // Sort by vorstellungsbeginn ascending
                //        futureTermine.sort(Comparator.comparing(Termin::getVorstellungsbeginn));
                //
                //        // Exclude the first upcoming screening
                //        List<Termin> relevantTermine = futureTermine.subList(1, futureTermine.size());
                //
                //        List<Long> terminIds = relevantTermine.stream()
                //                .map(Termin::getTnr)
                //                .toList();
                //
                //        List<Terminverknuepfung> connections = terminverknuepfungRepository.findWithFilmsByTerminIds(terminIds);
                //
                //        Map<Long, List<Terminverknuepfung>> groupedConnections = connections.stream()
                //                .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm()) // exclude Vorfilme
                //                .collect(Collectors.groupingBy(tv -> tv.getTermin().getTnr()));
                //
                //        return relevantTermine.stream()
                //                .map(termin -> {
                //                    List<FilmDTOForm> mainfilms = groupedConnections.getOrDefault(termin.getTnr(), List.of()).stream()
                //                            .sorted(Comparator.comparing(Terminverknuepfung::getRang, Comparator.nullsLast(Short::compareTo)))
                //                            .map(tv -> new FilmDTOForm(tv.getFilm()))
                //                            .toList();
                //
                //                    return new TerminDTOWithFilmDTOSlideshow(termin, mainfilms);
                //                })
                //                .toList();
                //    }


//    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsForSlideshow() {
//        // Get the current time (with fixed time for consistency)
//        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
//        LocalTime fixedTime = LocalTime.of(0, 1);
//        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);
//
//        // 1. Get future Termine
//        List<Termin> futureTermine = terminRepository.findFutureTermine(now);
//
//        // 2. Get related films in batch (using the termin IDs)
//        List<Long> terminIds = futureTermine.stream()
//                .map(Termin::getTnr)
//                .collect(Collectors.toList());
//
//        List<Terminverknuepfung> connections = terminverknuepfungRepository
//                .findWithFilmsByTerminIds(terminIds);
//
//        // 3. Exclude the first next Termin
//        if (!futureTermine.isEmpty()) {
//            futureTermine.remove(0); // Remove the first Termin (this is the one happening next)
//        }
//
//        // 4. Prepare the list of TerminDTOWithFilmDTOSlideshow objects
//        return futureTermine.stream()
//                .map(termin -> {
//                    // Filter and sort films that are NOT vorfilms
//                    List<Film> mainfilms = connections.stream()
//                            .filter(tv -> tv.getTermin().getTnr().equals(termin.getTnr()))
//                            .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())  // Exclude vorfilms
//                            .sorted(Comparator.comparing(Terminverknuepfung::getRang, Comparator.nullsFirst(Short::compare))) // Sort by rang ascending
//                            .map(Terminverknuepfung::getFilm)
//                            .collect(Collectors.toList());
//
//                    // Return the TerminDTOWithFilmDTOSlideshow object
//                    return new TerminDTOWithFilmDTOSlideshow(termin, mainfilms);
//                })
//                .collect(Collectors.toList());
//    }

//    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsForSlideshow() {
//        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
//        LocalTime fixedTime = LocalTime.of(0, 1);
//        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);
//
//        // 1. Get all future Termine
//        List<Termin> futureTermine = terminRepository.findFutureTermine(now);
//
//        // 2. Filter only those with veroeffentlichen != null and > 0
//        List<Termin> publishableTermine = futureTermine.stream()
//                .filter(t -> t.getVeroeffentlichen() != null && t.getVeroeffentlichen() > 0)
//                .sorted(Comparator.comparing(Termin::getVorstellungsbeginn))
//                .collect(Collectors.toList());
//
//        // 3. Exclude the first next publishable Termin
//        if (!publishableTermine.isEmpty()) {
//            publishableTermine.remove(0);
//        }
//
//        // 4. Collect their IDs
//        List<Long> terminIds = publishableTermine.stream()
//                .map(Termin::getTnr)
//                .collect(Collectors.toList());
//
//        // 5. Load all Terminverknuepfung with film relations
//        List<Terminverknuepfung> connections = terminverknuepfungRepository.findWithFilmsByTerminIds(terminIds);
//
//        // 6. Map to DTOs
//        return publishableTermine.stream()
//                .map(termin -> {
//                    List<Film> mainfilms = connections.stream()
//                            .filter(tv -> tv.getTermin().getTnr().equals(termin.getTnr()))
//                            .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())
//                            .sorted(Comparator.comparing(Terminverknuepfung::getRang, Comparator.nullsFirst(Short::compare)))
//                            .map(Terminverknuepfung::getFilm)
//                            .collect(Collectors.toList());
//
//                    return new TerminDTOWithFilmDTOSlideshow(termin, mainfilms);
//                })
//                .collect(Collectors.toList());
//    }

    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsForSlideshow(Optional<Integer> next) {
        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
        LocalTime fixedTime = LocalTime.of(0, 1);
        LocalDateTime now = LocalDateTime.of(currentDate, fixedTime);

        // 1. Get all future Termine
        List<Termin> futureTermine = terminRepository.findAllFutureTermineWithReihen(now); // to do: reihen is eager fetched here, so adjusting TerminDTOWithFilmDTOSlideshow and it's constructor could include reihen

        // 2. Filter veroeffentlichen > 0
        List<Termin> publishableTermine = futureTermine.stream()
                .filter(t -> t.getVeroeffentlichen() != null && t.getVeroeffentlichen() > 0)
                .sorted(Comparator.comparing(Termin::getVorstellungsbeginn))
                .toList();

        // 3. Exclude the first next Termin
        if (!publishableTermine.isEmpty()) {
            publishableTermine.removeFirst();
        }

        // 4. Apply 'next' limit if present
        if (next.isPresent() && next.get() > 0 && publishableTermine.size() > next.get()) {
            publishableTermine = publishableTermine.subList(0, next.get());
        }

        // 5. Get termin IDs and batch fetching (bulk fetching) related film ids in tv
        List<Long> terminIds = publishableTermine.stream()
                .map(Termin::getTnr)
                .toList();

        List<Terminverknuepfung> connectionsByTerminIds = terminverknuepfungRepository.findByTerminIdsWithFilms(terminIds);

        // 6. Build DTOs
        return publishableTermine.stream()
                .map(pTermin -> {
                    List<Film> mainfilms = connectionsByTerminIds.stream()
                            .filter(tv -> tv.getTnr().equals(pTermin.getTnr()))
                            .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())
                            .sorted(Comparator.comparing(Terminverknuepfung::getRang, Comparator.nullsFirst(Short::compare)))
                            .map(Terminverknuepfung::getFilm)
                            .toList();

                    return new TerminDTOWithFilmDTOSlideshow(pTermin, mainfilms);
                })
                .toList();
    }

//    +++++++++++++++++++++++++++++
//    mail reminder stuff
//    +++++++++++++++++++++++++++++

    public List<TerminDTOWithFilmDTOMailReminder> getTermineDaysInFuture(int days) {
        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
        LocalDate targetDate = currentDate.plusDays(days);

        // Start and end of the target day
        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(23, 59, 59);

        List<Termin> termineOnTargetDate = terminRepository.findTermineByDateRange(startOfDay, endOfDay);

        return buildTerminDTOWithFilmDTOMailReminderList(termineOnTargetDate)
                .stream()
                .filter(terminDTO -> terminDTO.veroeffentlichen() != null && terminDTO.veroeffentlichen() > 0)
                .collect(Collectors.toList());
    }

    public List<TerminDTOWithFilmDTOMailReminder> getTermineDaysInPast(int days) {
        LocalDate currentDate = LocalDate.now(ZoneId.of("Europe/Berlin"));
        LocalDate targetDate = currentDate.minusDays(days);

        // Start and end of the target day
        LocalDateTime startOfDay = targetDate.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(23, 59, 59);

        List<Termin> termineOnTargetDate = terminRepository.findTermineByDateRange(startOfDay, endOfDay);

        return buildTerminDTOWithFilmDTOMailReminderList(termineOnTargetDate)
                .stream()
                .filter(terminDTO -> terminDTO.veroeffentlichen() != null && terminDTO.veroeffentlichen() > 0) // only keep termine, which are veröffentlicht
                .collect(Collectors.toList());
    }

            // Helper method to avoid code duplication for the both methods above
            private List<TerminDTOWithFilmDTOMailReminder> buildTerminDTOWithFilmDTOMailReminderList(List<Termin> termine) {

                // Get termin IDs and batch fetching (bulk fetching) related film ids in tv
                List<Long> terminIds = termine.stream()
                        .map(Termin::getTnr)
                        .toList();

                List<Terminverknuepfung> connectionsByTerminIds = terminverknuepfungRepository
                        .findByTerminIdsWithFilms(terminIds);

                return termine.stream()
                        .map(termin -> {
                            // Check if titel exists (not null/empty)
                            if (termin.getTitel() != null && !termin.getTitel().isBlank()) {
                                return new TerminDTOWithFilmDTOMailReminder(
                                        termin,
                                        List.of() // Empty films list (mainfilms) when titel is present
                                );
                            } else {
                                // Include films only when titel is absent
                                List<Film> films = connectionsByTerminIds.stream()
                                        .filter(tv -> tv.getTnr().equals(termin.getTnr()))
                                        .filter(tv -> tv.getVorfilm() == null || !tv.getVorfilm())
                                        .map(Terminverknuepfung::getFilm)
                                        .toList();
                                return new TerminDTOWithFilmDTOMailReminder(
                                        termin,
                                        films
                                );
                            }
                        })
                        .toList();
            }

}