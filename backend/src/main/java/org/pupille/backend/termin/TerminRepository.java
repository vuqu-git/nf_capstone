package org.pupille.backend.termin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TerminRepository extends JpaRepository<Termin, Integer> {
    // Custom query methods can be added here
    // Example: List<Termin> findByTitelContaining(String keyword);
}
