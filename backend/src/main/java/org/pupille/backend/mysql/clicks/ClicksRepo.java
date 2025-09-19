package org.pupille.backend.mysql.clicks;

import org.springframework.data.jpa.repository.EntityGraph;
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
                    "   (" + // Start of the semester logic group
                    "       (:now BETWEEN :startDateSummer AND :endDateSummer AND c.vorstellungsbeginn BETWEEN :startDateSummer AND :endDateSummer) " +
                    "       OR " +
                    "       (:now NOT BETWEEN :startDateSummer AND :endDateSummer AND c.vorstellungsbeginn BETWEEN :startDateWinter AND :endDateWinter) " +
                    "   ) " + // End of the semester logic group
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
