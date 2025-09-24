package org.pupille.backend.mysql.film;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.pupille.backend.utils.PupilleUtils;

// DTO for selection field

@Getter
@Setter
@AllArgsConstructor
public class FilmDTOSelection {
    private Long fnr;
    private String titel;
    private Integer jahr;
    private String regie;

    // constructor used in slow FilmService method getAllFilmsRepoSortedByTitleAsc
    public FilmDTOSelection(Film film) {
        this.fnr = film.getFnr();
        this.titel = film.getTitel();
        this.jahr = film.getJahr();

        // if regie is not set in the DB, regie is extracted from column/field stab via helper function extractDirectors
        // original stab value will not be used in the creation of a FilmDTOSelection instance
        if (film.getRegie() == null || film.getRegie().isEmpty()) {
            this.regie = PupilleUtils.extractDirectors(film.getStab());
        } else {
            this.regie = film.getRegie();
        }
    }

    // constructor used in FilmRepository method findAllFilmsSortedByTitleAsc_Fast
    public FilmDTOSelection(Long fnr, String titel, Integer jahr, String regie, String stab) {
        this.fnr = fnr;
        this.titel = titel;
        this.jahr = jahr;
        // Logic for regie
        if (regie == null || regie.isEmpty()) {
            this.regie = PupilleUtils.extractDirectors(stab);
        } else {
            this.regie = regie;
        }
    }

}