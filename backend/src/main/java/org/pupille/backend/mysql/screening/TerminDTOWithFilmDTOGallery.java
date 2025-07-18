package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;

public record TerminDTOWithFilmDTOGallery(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String kurztext,
        String besonderheit,
        String bild,
        String sonderfarbe,
        Short veroeffentlichen,
        List<FilmDTOGallery> mainfilms
) {
    public TerminDTOWithFilmDTOGallery(Termin termin, List<Film> mainfilms) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getKurztext(),
                termin.getBesonderheit(),
                termin.getBild(),
                termin.getSonderfarbe(),
                termin.getVeroeffentlichen(),
                mainfilms.stream()
                        .map(FilmDTOGallery::new)
                        .toList()
        );
    }
}