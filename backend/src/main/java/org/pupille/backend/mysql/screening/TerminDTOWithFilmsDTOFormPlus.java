package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.termin.TerminDTOScreeningdetails;

import java.time.LocalDate;
import java.util.List;

public record TerminDTOWithFilmsDTOFormPlus(
        TerminDTOScreeningdetails termin,
        List<FilmDTOFormPlus> mainfilms, // vorfilm=false/null
        List<FilmDTOFormPlus> vorfilms,   // vorfilm=true
        Integer terminGesamtlaufzeit,
        Boolean finalVeroeffentlichen
) {
    private static final LocalDate CUTOFF_DATE = LocalDate.of(2026, 6, 30);

    // 1. Compact Canonical Constructor
    public TerminDTOWithFilmsDTOFormPlus {
        boolean hasNoMainfilms = (mainfilms == null || mainfilms.isEmpty());
        boolean isAfterCutoff = (termin != null && termin.getVorstellungsbeginn() != null
                && termin.getVorstellungsbeginn().toLocalDate().isAfter(CUTOFF_DATE));

        if (hasNoMainfilms && isAfterCutoff) {
            finalVeroeffentlichen = false;
        }
    }

    // 2. Convenience Constructor
    public TerminDTOWithFilmsDTOFormPlus(
            TerminDTOScreeningdetails termin,
            List<FilmDTOFormPlus> mainfilms,
            List<FilmDTOFormPlus> vorfilms,
            Integer terminGesamtlaufzeit
    ) {
        this(
                termin,
                mainfilms,
                vorfilms,
                terminGesamtlaufzeit,
                // Clean & readable boolean conversion:
                termin != null && termin.getVeroeffentlichen() != null && termin.getVeroeffentlichen() != 0
        );
    }
}
