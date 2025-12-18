package org.pupille.backend.mysql.termin;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TerminRepository extends JpaRepository<Termin, Long> {

//        Explanation of @EntityGraph:
//        for Associations: The purpose of @EntityGraph is to control how associated entities (relationships like @OneToMany, @ManyToOne, etc.) are fetched. It's used to eager-load relationships that would otherwise be lazily loaded, preventing N+1 problems.
//        attributePaths = {"filmConnections", "filmConnections.film"} tells JPA to fetch:
//              1) The filmConnections collection (which contains Terminverknuepfung objects) eagerly.
//              2) And then, for each Terminverknuepfung, eagerly fetch its associated film object.
//        => @EntityGraph tells JPA how to traverse the graph starting from Termin (Termin -> Terminverknuepfung -> Film).



        // @EntityGraph(attributePaths = {"filmConnections", "filmConnections.film"})   // Fetch all Termine with their associated TVen and Films
                                                                                        // But @EntityGraph would only become relevant if your TerminProjectionSelection (or another projection) included fields from Terminverknuepfung or Film and you wanted to ensure those associated entities were fetched in a single query (e.g., using JOIN FETCH or by defining the @EntityGraph).
                                                                                        // THIS is NOT the case here! Comment it out or better delete @EntityGraph because of misleading Information: Future developers (or even yourself later) might look at that @EntityGraph and assume that filmConnections and film data are being fetched and available in the TerminProjectionSelection, leading to incorrect assumptions or debugging efforts.
//        @EntityGraph(attributePaths = {"clicks"})       // without this we have a classic N+1 query performance problem caused by the new @OneToOne relationship with Clicks:
//                                                        // The issue is that Hibernate is executing additional queries to fetch the Clicks entity for each Termin record
//        @Query("SELECT t FROM Termin t ORDER BY t.vorstellungsbeginn DESC")
//        List<TerminProjectionSelection> findAllByOrderByVorstellungsbeginnDesc();

        // much faster! => select only the fields which are needed (for TerminProjectionSelection) and left clicks out
        @Query("SELECT t.tnr as tnr, t.vorstellungsbeginn as vorstellungsbeginn, t.titel as titel " +
                "FROM Termin t ORDER BY t.vorstellungsbeginn DESC")
        List<TerminProjectionSelection> findAllByOrderByVorstellungsbeginnDesc();

//        // If you need the projection for future termine as well:
//        @Query("SELECT t FROM Termin t WHERE t.vorstellungsbeginn >= :now ORDER BY t.vorstellungsbeginn ASC")
//        List<TerminProjectionSelection> findAllFutureTermineProjected(LocalDateTime now);

        @EntityGraph(attributePaths = {"filmConnections", "filmConnections.film", "clicks"}) // Fetch all Termine with their associated TVen and Films and clicks
        @Query("SELECT t FROM Termin t ORDER BY t.vorstellungsbeginn DESC")
        List<Termin> findWithMainfilmeAllByOrderByVorstellungsbeginnDesc();
        //List<TerminDTOWithMainfilms> findWithMainfilmeAllByOrderByVorstellungsbeginnDesc();
                // Return type is List<TerminDTOWithMainfilms> but the query selects entities (Termin t), but somehow the conversion works here though the chatbots say that the conversion to TerminDTOWithMainfilms is not actually happening automatically: There's a mismatch in your current setup


        // different findById methods
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~

        // called by getTerminById in TerminService, called by getTerminWithFilmsPlusByTnr in ScreeningService, called by getAllReihenByTerminId in ReiheService
        // Optional<Termin> findById(Long tnr); // no need to manually declare (JpaRepository already provides a generic findById) => Only if you want to add special behavior, custom JPQL, or annotations (like @EntityGraph), then you can redeclare (override) it with your custom logic or annotations

        // called by getAllReihenWithTermineAndFilmsByTerminId in ReiheService
        // !!! TAKE NOTE: identifiers reihen, termine, filmConnections and film in the attributePaths are the field names in the respective entities !!!
        @EntityGraph(attributePaths = {
                "reihen",
                "reihen.termine",
                "reihen.termine.filmConnections",
                "reihen.termine.filmConnections.film"
        })
        Optional<Termin> findWithReihenAndTermineAndFilmsByTnr(Long tnr);
                        // With your typical data:
                        //1 Termin → at most 2 Reihen
                        //Each Reihe → at most 4 Termine
                        //Each Termin → 1 FilmConnection
                        //Cartesian product size: 1 × 2 × 4 × 1 = 8 rows
                        //This is actually quite manageable! The entity graph isn't terrible here.

        // called by addTerminToReihe in ReiheService
        // !!! TAKE NOTE: identifier reihen in the attributePaths are the field names in the respective entities !!!
        @EntityGraph(attributePaths = {
                "reihen"
        })
        Optional<Termin> findWithReihenByTnr(Long tnr);

        // called in getAllFutureTermineWithFilms within ScreeningService
        @EntityGraph(attributePaths = "reihen")
        @Query("SELECT t FROM Termin t WHERE t.vorstellungsbeginn >= :now ORDER BY t.vorstellungsbeginn ASC")
        List<Termin> findAllFutureTermineWithReihen(@Param("now") LocalDateTime now);

        // called by getAllPastTermineWithFilms in ScreeningService
        @Query("SELECT t FROM Termin t WHERE t.vorstellungsbeginn < :now AND t.veroeffentlichen > 0 ORDER BY t.vorstellungsbeginn DESC")
        List<Termin> findAllPastTermine(@Param("now") LocalDateTime now);

        @Query(value = """
    SELECT 
        t.tnr,                              -- row[0] in ScreeningService method getAllPastTermineWithFilmsNative
        t.termin as vorstellungsbeginn,     -- row[1]
        t.titel,                            -- row[2]
        t.is_canceled,                      -- row[3]
        GROUP_CONCAT(f.fnr) as film_ids,    -- row[4]
        GROUP_CONCAT(CASE 
            WHEN f.originaltitel_anzeigen = 1 AND f.originaltitel IS NOT NULL 
            THEN f.originaltitel 
            ELSE f.titel 
        END SEPARATOR '||') as film_titles  -- row[5]
    FROM termin t
    JOIN terminverknuepfung tv ON t.tnr = tv.tnr
    JOIN film f ON tv.fnr = f.fnr
    WHERE t.termin < :now
    AND t.veroeffentlichen > 0
    AND (tv.vorfilm IS NULL OR tv.vorfilm = 0)
    GROUP BY t.tnr, t.termin, t.titel, t.is_canceled
    ORDER BY t.termin DESC
    """, nativeQuery = true)
        List<Object[]> findPastTermineWithFilmsNative(@Param("now") LocalDateTime now);


        // called by getTermineByCurrentSemester in ScreeningService
        @EntityGraph(attributePaths = {"reihen"})
        @Query(
                "SELECT t FROM Termin t " +
                        "WHERE " +
                        "   (" + // Start of the semester logic group
                        "       (:now BETWEEN :startDateSummer AND :endDateSummer AND t.vorstellungsbeginn >= :startDateSummer) " + // get also records of the follow-up semester
//                        "       (:now BETWEEN :startDateSummer AND :endDateSummer AND t.vorstellungsbeginn BETWEEN :startDateSummer AND :endDateSummer) " + // fetch only records of the current semester
                        "       OR " +
                        "       (:now NOT BETWEEN :startDateSummer AND :endDateSummer AND t.vorstellungsbeginn >= :startDateWinter) " + // get also records of the follow-up semester
//                        "       (:now NOT BETWEEN :startDateSummer AND :endDateSummer AND t.vorstellungsbeginn BETWEEN :startDateWinter AND :endDateWinter) " + // fetch only records of the current semester
                        "   ) " + // End of the semester logic group
                        "   AND (t.veroeffentlichen > 0) " +
                        "ORDER BY t.vorstellungsbeginn ASC"
        )
        List<Termin> findTermineByCurrentSemester(
                @Param("now") LocalDateTime now,
                @Param("startDateSummer") LocalDateTime startDateSummer,
                @Param("endDateSummer") LocalDateTime endDateSummer,
                @Param("startDateWinter") LocalDateTime startDateWinter,
                @Param("endDateWinter") LocalDateTime endDateWinter
        );

        //    +++++++++++++++++++++++++++++
        //       for mail reminder stuff
        //    +++++++++++++++++++++++++++++
        @Query("SELECT t FROM Termin t WHERE t.vorstellungsbeginn BETWEEN :startDateTime AND :endDateTime ORDER BY t.vorstellungsbeginn ASC")
        List<Termin> findTermineByDateRange(
                @Param("startDateTime") LocalDateTime startDateTime,
                @Param("endDateTime") LocalDateTime endDateTime
        );
}
