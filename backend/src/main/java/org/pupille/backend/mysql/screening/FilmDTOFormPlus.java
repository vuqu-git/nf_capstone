package org.pupille.backend.mysql.screening;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.pupille.backend.mysql.film.FilmDTOForm;

@Getter
@Setter
@AllArgsConstructor
public class FilmDTOFormPlus {
    private FilmDTOForm film;
    private Boolean vorfilm; // can be null
    private Short rang; // can be null
}