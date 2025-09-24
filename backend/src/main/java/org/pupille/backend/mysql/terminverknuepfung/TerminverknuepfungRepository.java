package org.pupille.backend.mysql.terminverknuepfung;

import org.pupille.backend.mysql.termin.TerminProjectionSelection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TerminverknuepfungRepository extends JpaRepository<Terminverknuepfung, Terminverknuepfung.TerminverknuepfungId> {

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // @Query("SELECT tv FROM Terminverknuepfung tv ORDER BY tv.tnr DESC") // query here not required instead use Spring Data JPA's method name conventions i.e. JPA will automatically generate the query based on the method name
    List<Terminverknuepfung> findAllByOrderByTnrDesc();
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        // ??????????????????????????????????????????????????
        // ?JOIN FETCH query and an @EntityGraph-based query?
        // ??????????????????????????????????????????????????
        // @EntityGraph approach is Generally Better!
        //  simple query with one or two associations, there is often no significant performance difference between a well-written JOIN FETCH query and an @EntityGraph-based query. Both are highly effective at solving the N+1 problem.
        //  However, @EntityGraph is generally preferred for its maintainability, readability, and flexibility in more complex scenarios, especially when dealing with multiple ToMany associations. It abstracts away some of the complexities of the underlying SQL and allows you to declare your fetching strategy separately from your query logic.

    @EntityGraph(attributePaths = {"film", "termin"})
    @Query("SELECT tv FROM Terminverknuepfung tv ORDER BY tv.tnr DESC")
    List<Terminverknuepfung> findAllWithFilmAndTermin();

        //    @Query("SELECT tv FROM Terminverknuepfung tv JOIN FETCH tv.film JOIN FETCH tv.termin ORDER BY tv.tnr DESC")
        //    List<Terminverknuepfung> findAllWithFilmAndTermin();

    //      '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    @Query("""
    SELECT
        tv.tnr as tnr,
        tv.fnr as fnr,
        tv.vorfilm as vorfilm,
        tv.rang as rang,
        tv.film.titel as filmTitel,
        tv.film.jahr as filmJahr,
        tv.film.regie as filmRegie,
        tv.film.stab as filmStab,
        tv.termin.vorstellungsbeginn as terminVorstellungsbeginn,
        tv.termin.titel as terminTitel
    FROM Terminverknuepfung tv
    ORDER BY tv.termin.vorstellungsbeginn DESC
""")
    List<TVWithFilmAndTerminProjection> findAllWithFilmAndTerminOrderByTerminDesc();

            // very slow approach here, possibly because of
            //  *N+1 Query Problem: Even with @EntityGraph, if your Film or Termin entities have other lazy-loaded associations (e.g., terminConnections, filmConnections, reihen, etc.), those may trigger additional queries when accessed.
            //  *Fetching Too Much Data: You are loading all Terminverknuepfung records with their associated Film and Termin entities, and then mapping them to DTOs. If the result set is large, this can be very slow and memory-intensive.
            //                          The Film and Termin entities have many fields, some of which are large (TEXT columns), and some have collections (terminConnections, filmConnections, reihen). Even if you don't use them, they may be loaded if not properly excluded.
            //  *Inefficient Query: The query performs a join to sort by termin.vorstellungsbeginn, but if the database is not optimized for this, it can be slow.

            //    @EntityGraph(attributePaths = {"film", "termin"})
            //    @Query("SELECT tv FROM Terminverknuepfung tv " +
            //            "ORDER BY tv.termin.vorstellungsbeginn DESC")
            //    List<Terminverknuepfung> findAllWithFilmAndTerminOrderByTerminDesc_SuperSlow();


            //    @Query("SELECT tv FROM Terminverknuepfung tv " +
            //            "JOIN FETCH tv.film " +
            //            "JOIN FETCH tv.termin " +
            //            "ORDER BY tv.termin.vorstellungsbeginn DESC")
            //    List<Terminverknuepfung> findAllWithFilmAndTerminOrderByTerminDesc_SuperSlow();
    //      '''''''''''''''''''' '''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    @Query("SELECT tv FROM Terminverknuepfung tv " +
            "JOIN FETCH tv.film " +
            "JOIN FETCH tv.termin " +
            "WHERE tv.tnr = :tnr AND tv.fnr = :fnr")
    Optional<Terminverknuepfung> findWithFilmAndTerminByTnrAndFnr(
            @Param("tnr") Long tnr,
            @Param("fnr") Long fnr
    );

    // ---------------------------------------------------------------------------------------------
    // two methods for fetching list of filme (termine) when giving tnr (fnr)

    @Query("SELECT tv FROM Terminverknuepfung tv JOIN FETCH tv.film WHERE tv.tnr = :tnr")
    List<Terminverknuepfung> findByTnrWithFilms(@Param("tnr") Long tnr);

    // this method (for fetching list of termine when giving fnr):
        // *this query must contain column names (or more accurately, the aliased names) like tnr or vorstellungsbeginn
        //  that matches the property names (derived from the getter method names) in the TerminProjectionSelection interface, otherwise the mapping won't work
        // *you can select more columns than the getters defined in your projection interface
        //  but: the extra selected columns are simply ignored in the returned projection instances.
        // *the query here differs from the one from findByTnrWithFilms, because here I use TerminProjectionSelection interface, which needs for construction a Termin object; while there's a different logic in getFilmlistByTnr to build the returned list
    @Query("""
                SELECT 
                    t.tnr AS tnr,
                    t.vorstellungsbeginn AS vorstellungsbeginn,
                    t.titel AS titel
                FROM Termin t
                JOIN t.filmConnections tv
                WHERE tv.film.fnr = :fnr
                ORDER BY t.vorstellungsbeginn DESC
            """)
    List<TerminProjectionSelection> findTermineByFilmFnr(@Param("fnr") Long fnr);

    // ****  ****   ****  ****   ****  ****   ****  ****

    // the following one is only used in ScreeningService: getAllFutureTermineWithFilms, getTerminWithFilmsPlusByTnr, getAllPastTermineWithFilms, getTermineByCurrentSemester, getFutureTermineWithFilmsForSlideshow, helper method buildTerminDTOWithFilmDTOMailReminderList
    //      usage JOIN FETCH tv.film means the Film reference on each Terminverknuepfung is eagerly loaded in this query — avoiding lazy loading and N+1 on the films
    //          i.e. the Film entities are eagerly fetched due to JOIN FETCH, while the Termin entities remain lazy (not joined or fetched)
    //      tv.termin is referenced in the WHERE clause (tv.termin.tnr IN :terminIds), so Hibernate/JPA fetch just the foreign key value (tnr)
    //          i.e. When you use tv.termin.tnr in your JPQL WHERE clause, Hibernate knows from your entity mapping that this refers to the tnr FK column in the terminverknuepfung table. The generated SQL filters directly on that column. No additional join or fetch of the full Termin entity is required—only the foreign key value is "fetched" (i.e., used) for filtering. Accessing the whole Termin object itself would still be lazy and require a separate SQL query if needed later.
//    @Query("SELECT tv FROM Terminverknuepfung tv JOIN FETCH tv.film WHERE tv.termin.tnr IN :terminIds")
    @Query("SELECT tv FROM Terminverknuepfung tv JOIN FETCH tv.film WHERE tv.tnr IN :terminIds")
        // The @Query with WHERE tv.termin.tnr IN :terminIds fetches all Terminverknuepfung entities whose associated Termin is in the list terminIds (i.e., all your future Termine's IDs), along with the associated Film, in one database query.
        // However, this query does not split or group those Terminverknuepfung results per Termin.
    List<Terminverknuepfung> findByTerminIdsWithFilms(@Param("terminIds") List<Long> terminIds);

}