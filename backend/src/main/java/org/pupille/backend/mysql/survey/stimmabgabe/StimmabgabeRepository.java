package org.pupille.backend.mysql.survey.stimmabgabe;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StimmabgabeRepository extends JpaRepository<Stimmabgabe, Long> {

    // Find all votes for a specific Option
    List<Stimmabgabe> findByAuswahloption_Onr(Long onr);

    // Find all votes for a specific Survey
    List<Stimmabgabe> findByUmfrage_Unr(UUID unr);

    // Find all votes for a specific Survey + sorted by Datum asc
    List<Stimmabgabe> findByUmfrage_UnrOrderByDatumAsc(UUID unr);
}
