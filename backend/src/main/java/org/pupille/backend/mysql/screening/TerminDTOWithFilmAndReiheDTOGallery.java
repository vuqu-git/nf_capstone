package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.reihe.Reihe;
import org.pupille.backend.mysql.reihe.ReiheDTOGallery;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record TerminDTOWithFilmAndReiheDTOGallery(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String kurztext,
        String besonderheit,
        String bild,
        String offsetImageInGallery,
        String sonderfarbe,
        Short veroeffentlichen,
        List<FilmDTOGallery> mainfilms,
        Set<ReiheDTOGallery> reihen
) {
    public TerminDTOWithFilmAndReiheDTOGallery(Termin termin, List<Film> mainfilms, Set<Reihe> reihen) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getKurztext(),
                termin.getBesonderheit(),
                termin.getBild(),
                termin.getOffsetImageInGallery(),
                termin.getSonderfarbe(),
                termin.getVeroeffentlichen(),
                mainfilms.stream()
                        .map(FilmDTOGallery::new)
                        .toList(),
                reihen.stream()
                        .map(ReiheDTOGallery::new)
                        .collect(Collectors.toSet())
        );
    }
}