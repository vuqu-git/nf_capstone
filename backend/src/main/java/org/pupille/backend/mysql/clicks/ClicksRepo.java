package org.pupille.backend.mysql.clicks;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ClicksRepo extends JpaRepository<Clicks, Long> {

    // called by getAllClicksByCurrentSemesterSortedByVorstellungsbeginnAsc in ClicksService
    @Query(
            "SELECT c FROM Clicks c " +
                    "WHERE " +
                    "   (:now BETWEEN :startDateSummer AND :endDateSummer AND c.vorstellungsbeginn >= :startDateSummer) " + // get also records of the follow-up semester
//                    "       (:now BETWEEN :startDateSummer AND :endDateSummer AND c.vorstellungsbeginn BETWEEN :startDateSummer AND :endDateSummer) " + // fetch only records of the current semester
                    "   OR " +
                    "   (:now BETWEEN :startDateWinter AND :endDateWinter AND c.vorstellungsbeginn >= :startDateWinter) " + // get also records of the follow-up semester
//                    "       (:now NOT BETWEEN :startDateSummer AND :endDateSummer AND c.vorstellungsbeginn BETWEEN :startDateWinter AND :endDateWinter) " + // fetch only records of the current semester
                    "ORDER BY c.vorstellungsbeginn ASC"
    )
    List<Clicks> findClicksByCurrentSemester(
            @Param("now") LocalDateTime now,
            @Param("startDateSummer") LocalDateTime startDateSummer,
            @Param("endDateSummer") LocalDateTime endDateSummer,
            @Param("startDateWinter") LocalDateTime startDateWinter,
            @Param("endDateWinter") LocalDateTime endDateWinter
    );

}
