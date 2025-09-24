package org.pupille.backend.mysql.terminverknuepfung;

import java.time.LocalDateTime;

// used in TerminverknuepfungRepository: findAllWithFilmAndTerminOrderByTerminDesc
public interface TVWithFilmAndTerminProjection {
    Long getTnr();
    Long getFnr();
    Boolean getVorfilm();
    Short getRang();
    String getFilmTitel();
    Integer getFilmJahr();
    String getFilmRegie();
    String getFilmStab();
    LocalDateTime getTerminVorstellungsbeginn();
    String getTerminTitel();
}
