package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.reihe.Reihe;
import org.pupille.backend.mysql.reihe.ReiheDTOGallery;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record TerminDTOWithFilmDTOOverviewSemester(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String terminBesonderheit,
        List<FilmDTOOverviewSemester> mainfilms,
        Set<ReiheDTOGallery> reihen,
        Integer terminGesamtlaufzeit,
        Boolean isCanceled
) {
    public TerminDTOWithFilmDTOOverviewSemester(Termin termin, List<Film> films, Set<Reihe> reihen, Integer terminGesamtlaufzeit) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getBesonderheit(),

                films.stream()
                        .map(FilmDTOOverviewSemester::new)
                        .toList(),

                reihen.stream()
                        .map(ReiheDTOGallery::new)
                        .collect(Collectors.toSet()),

                terminGesamtlaufzeit,
                termin.getIsCanceled()
        );
    }
}
