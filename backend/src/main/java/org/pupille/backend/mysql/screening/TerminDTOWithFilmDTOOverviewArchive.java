package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;

import static org.pupille.backend.utils.PupilleUtils.formatSemesterFromLocalDateTermin;

public record TerminDTOWithFilmDTOOverviewArchive(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String semester,
        String titel,
        List<FilmDTOOverviewArchive> films, // one usage in the screening service method getPastTermineWithFilms, ensures they are mainfilms
        Boolean isCanceled
) {
    public TerminDTOWithFilmDTOOverviewArchive(Termin termin, List<Film> films) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                formatSemesterFromLocalDateTermin(termin.getVorstellungsbeginn().toLocalDate()),
                termin.getTitel(),
                films.stream()
                        .map(FilmDTOOverviewArchive::new)
                        .toList(),
                termin.getIsCanceled()
        );
    }
}