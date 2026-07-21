package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.pupille.backend.utils.PupilleUtils.formatSemesterFromLocalDateTermin;

public record TerminDTOWithFilmDTOOverviewArchive(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String semester,
        String titel,
        List<FilmDTOOverviewArchive> mainfilms, // one usage in the screening service method getPastTermineWithFilms, ensures they are mainfilms
        Boolean finalVeroeffentlichen,
        Boolean isCanceled
) {
    private static final LocalDate CUTOFF_DATE = LocalDate.of(2026, 6, 30);

    // 1. Compact Canonical Constructor
    public TerminDTOWithFilmDTOOverviewArchive {
        // Enforce the business rule: if mainfilms is empty, override the status to false
        if ((mainfilms == null || mainfilms.isEmpty())
                && vorstellungsbeginn != null
                && vorstellungsbeginn.toLocalDate().isAfter(CUTOFF_DATE)) { // isAfter is strict comparison (no equity included)
            finalVeroeffentlichen = false;
        }
    }

    // 2. Secondary convenience constructor taking the Entity objects directly
    public TerminDTOWithFilmDTOOverviewArchive(Termin termin, List<Film> films) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                formatSemesterFromLocalDateTermin(termin.getVorstellungsbeginn().toLocalDate()),
                termin.getTitel(),
                films.stream()
                        .map(FilmDTOOverviewArchive::new)
                        .toList(),
                termin.getVeroeffentlichen() != null && termin.getVeroeffentlichen() != 0,
                termin.getIsCanceled()
        );
    }
}