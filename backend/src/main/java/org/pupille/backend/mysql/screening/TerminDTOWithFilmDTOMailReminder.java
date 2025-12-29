package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;

public record TerminDTOWithFilmDTOMailReminder(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String patenschaft,
        Short veroeffentlichen,
        List<FilmDTOMailReminder> mainfilms,
        Boolean isCanceled
) {
    public TerminDTOWithFilmDTOMailReminder(Termin termin, List<Film> mainfilms) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getPatenschaft(),
                termin.getVeroeffentlichen(),
                mainfilms.stream()
                        .map(FilmDTOMailReminder::new)
                        .toList(),
                termin.getIsCanceled()
        );
    }
}
