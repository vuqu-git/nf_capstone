package org.pupille.backend.mysql.survey.umfrage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UmfrageRepository extends JpaRepository<Umfrage, Long> {
}