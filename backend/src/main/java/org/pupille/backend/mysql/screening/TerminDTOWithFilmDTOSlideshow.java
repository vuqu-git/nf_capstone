package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.film.FilmDTOForm;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;

public record TerminDTOWithFilmDTOSlideshow(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String kurztext,
        String besonderheit,
        String bild,
        String sonderfarbe,
        Short veroeffentlichen,
        List<FilmDTOForm> mainfilms,
        Boolean isCanceled
) {
    public TerminDTOWithFilmDTOSlideshow(Termin termin, List<Film> films) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getKurztext(),
                termin.getBesonderheit(),
                termin.getBild(),
                termin.getSonderfarbe(),
                termin.getVeroeffentlichen(),
                films.stream()
                        .map(FilmDTOForm::new)
                        .toList(),
                termin.getIsCanceled()
        );
    }
}