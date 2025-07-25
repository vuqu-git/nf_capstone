package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;

public record FilmDTOMailReminder(
        Long fnr,
        String titel
) {
    public FilmDTOMailReminder(Film film) {
        this(
                film != null ? film.getFnr() : null,
                film != null ? film.getTitel() : null
        );
    }
}
