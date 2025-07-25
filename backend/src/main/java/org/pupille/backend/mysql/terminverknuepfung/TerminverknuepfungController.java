package org.pupille.backend.mysql.terminverknuepfung;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.film.FilmDTOSelection;
import org.pupille.backend.mysql.termin.TerminProjectionSelection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/terminverknuepfung")
@RequiredArgsConstructor
public class TerminverknuepfungController {

    private final TerminverknuepfungService terminverknuepfungService;

    @GetMapping("/plain/all")
    public ResponseEntity<List<TerminverknuepfungDTOSelection>> getAllTerminverknuepfung() {
        List<TerminverknuepfungDTOSelection> terminverknuepfungDTOSelection = terminverknuepfungService.getAllTerminverknuepfung();
        return ResponseEntity.ok(terminverknuepfungDTOSelection);
    }

    @GetMapping("/plain")
    public ResponseEntity<List<TerminverknuepfungDTOSelection>> getAllTVByOrderByTnrDesc() {
        List<TerminverknuepfungDTOSelection> terminverknuepfungDTOSelection = terminverknuepfungService.getAllTVByOrderByTnrDesc();
        return ResponseEntity.ok(terminverknuepfungDTOSelection);
    }

    @GetMapping("/plain/{tnr}/{fnr}")
    public ResponseEntity<TerminverknuepfungDTOSelection> getTerminverknuepfungById(@PathVariable Long tnr, @PathVariable Long fnr) {
        Terminverknuepfung.TerminverknuepfungId id = new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
        Optional<TerminverknuepfungDTOSelection> terminverknuepfungDTOSelection = terminverknuepfungService.getTerminverknuepfungById(id);
        return terminverknuepfungDTOSelection.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

//    // this simple adding/creating doesn't work because of the relationships of Terminverknuepfung entity!
//    @PostMapping
//    public ResponseEntity<Terminverknuepfung> createTerminverknuepfung(@RequestBody Terminverknuepfung terminverknuepfung) {
//        Terminverknuepfung createdTerminverknuepfung = terminverknuepfungService.saveTerminverknuepfung(terminverknuepfung);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdTerminverknuepfung);
//    }


    @PutMapping("/{tnr}/{fnr}")
    public ResponseEntity<TerminverknuepfungDTOSelection> updateTerminverknuepfung(
            @PathVariable Long tnr,
            @PathVariable Long fnr,
            @RequestBody TerminverknuepfungDTOSelection updatingTV) {

        TerminverknuepfungDTOSelection updated = terminverknuepfungService.updateTerminverknuepfung(tnr, fnr, updatingTV);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{tnr}/{fnr}")
    public ResponseEntity<Void> deleteTerminverknuepfung(@PathVariable Long tnr, @PathVariable Long fnr) {
        Terminverknuepfung.TerminverknuepfungId id = new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
        terminverknuepfungService.deleteTerminverknuepfung(id);
        return ResponseEntity.noContent().build();
    }

    // ###############################################

    // this is the usual add function for new Terminverknuepfung, but because of the relationships of
    // Terminverknuepfung entity, there a various versions of this add function, version here: link between existing Film and existing Termin
    @PostMapping("/link-film-termin")
    public ResponseEntity<String> linkExistingFilmToExistingTermin(@RequestBody TerminverknuepfungDTOSelection newTV) {
        try {
            terminverknuepfungService.linkExistingFilmToExistingTermin(newTV);
            return new ResponseEntity<>("Film with fnr " + newTV.fnr() + " linked to Termin with tnr " + newTV.tnr() + " successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    @GetMapping()
    public ResponseEntity<List<TVWithFilmAndTerminDTOSelection>> getTVWithFilmAndTermin() {
        List<TVWithFilmAndTerminDTOSelection> result = terminverknuepfungService.getAllTVWithFilmAndTermin();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{tnr}/{fnr}") // used in TerminverknuepfungForm.tsx
    public ResponseEntity<TVWithFilmAndTerminDTOSelection> getTVbyIds(
            @PathVariable Long tnr,
            @PathVariable Long fnr
    ) {
        return ResponseEntity.ok(terminverknuepfungService.getTVWithFilmAndTerminByTnrAndFnr(tnr, fnr));
    }

    @GetMapping("/terminsorted") // used in TerminverknuepfungForm.tsx
    public ResponseEntity<List<TVWithFilmAndTerminDTOSelection>> getAllTVSortedByTermin() {
        return ResponseEntity.ok(
                terminverknuepfungService.getAllTVWithFilmAndTerminSortedByTermin()
        );
    }

    // two methods for fetching list of filme (termine) when giving tnr (fnr)
    @GetMapping("gettermine/{fnr}") // used in FilmForm.tsx
    public ResponseEntity<List<TerminProjectionSelection>> getTermineByFnr(@PathVariable Long fnr) {
        return ResponseEntity.ok(terminverknuepfungService.getTerminlistByFnr(fnr));
    }

    @GetMapping("getfilme/{tnr}") // used in TerminForm.tsx
    public ResponseEntity<List<FilmDTOSelection>> getFilmeByTnr(
            @PathVariable Long tnr
    ) {
        return ResponseEntity.ok(terminverknuepfungService.getFilmlistByTnr(tnr));
    }
}