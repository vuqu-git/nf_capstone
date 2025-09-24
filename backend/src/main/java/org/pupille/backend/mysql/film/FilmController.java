package org.pupille.backend.mysql.film;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filme")
@RequiredArgsConstructor
public class FilmController {

    private final FilmService filmService;

//    @GetMapping("all")
//    public List<FilmDTOForm> getAllFilms() {
//        return filmService.getAllFilms();
//    }

    // this one is sorted in repo method
    @GetMapping()
    public ResponseEntity<List<FilmDTOSelection>> getAllFilmsRepoSortedByTitleAsc() {
        List<FilmDTOSelection> films = filmService.getAllFilmsRepoSortedByTitleAscFast();
        return ResponseEntity.ok(films);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FilmDTOForm> getFilmById(@PathVariable Long id) {
        return filmService.getFilmById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FilmDTOForm createFilm(@RequestBody Film film) {
        return filmService.saveFilm(film);
    }

    // this put has no corresponding update method in service, all done is here using the save service method
    @PutMapping("/{id}")
    public ResponseEntity<FilmDTOForm> updateFilm(@PathVariable Long id, @RequestBody Film updatedFilm) {
        return filmService.getFilmById(id)
                .map(existingFilm -> {
                    updatedFilm.setFnr(existingFilm.getFnr());
                    return ResponseEntity.ok(filmService.saveFilm(updatedFilm));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFilm(@PathVariable Long id) {
        if (filmService.getFilmById(id).isPresent()) {
            filmService.deleteFilm(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
