package org.pupille.backend.mysql.survey.auswahloption;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuswahloptionRepository extends JpaRepository<Auswahloption, Long> {
    // Helper to find options by parent ID without loading the parent entity fully
    // → used in AuswahloptionService method getByUmfrage
    List<Auswahloption> findByUmfrage_Unr(Long unr, Sort sort);
}