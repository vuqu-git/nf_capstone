package org.pupille.backend.mysql.terminverknuepfung;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.film.FilmDTOSelection;
import org.pupille.backend.mysql.termin.TerminProjectionSelection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/terminverknuepfung")
@RequiredArgsConstructor
public class TerminverknuepfungController {

    private final TerminverknuepfungService terminverknuepfungService;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
    public ResponseEntity<TerminverknuepfungDTOSelection> getTVById(@PathVariable Long tnr, @PathVariable Long fnr) {
        Terminverknuepfung.TerminverknuepfungId compositeTvId = new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
        Optional<TerminverknuepfungDTOSelection> terminverknuepfungDTOSelection = terminverknuepfungService.getTVById(compositeTvId);
        return terminverknuepfungDTOSelection.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    // here are the get methods in real use

    // just for demonstration
    @GetMapping()
    public ResponseEntity<List<TVWithFilmAndTerminDTOSelection>> getTVWithFilmAndTermin() {
        List<TVWithFilmAndTerminDTOSelection> result = terminverknuepfungService.getAllTVWithFilmAndTermin();
        return ResponseEntity.ok(result);
    }

    // used in TerminverknuepfungForm.tsx
    @GetMapping("/terminsorted")
    public ResponseEntity<List<TVWithFilmAndTerminDTOSelection>> getAllTVSortedByTerminDesc() {
        return ResponseEntity.ok(
                terminverknuepfungService.getAllTVWithFilmAndTerminSortedByTerminDesc()
        );
    }

    // used in TerminverknuepfungForm.tsx
    @GetMapping("/{tnr}/{fnr}")
    public ResponseEntity<TVWithFilmAndTerminDTOSelection> getTVbyIds(
            @PathVariable Long tnr,
            @PathVariable Long fnr
    ) {
        return ResponseEntity.ok(terminverknuepfungService.getTVWithFilmAndTerminByTnrAndFnr(tnr, fnr));
    }

    // ---------------------------------------------------------------------------------------------
    // two methods for fetching list of filme (termine) when giving tnr (fnr)

    // used in TerminForm.tsx
    @GetMapping("film/fromtermin/{tnr}")
    public ResponseEntity<List<FilmDTOSelection>> getFilmeByTnr(@PathVariable Long tnr) {
        return ResponseEntity.ok(terminverknuepfungService.getFilmlistByTnr(tnr));
    }

    // used in FilmForm.tsx
    @GetMapping("termin/fromfilm/{fnr}")
    public ResponseEntity<List<TerminProjectionSelection>> getTermineByFnr(@PathVariable Long fnr) {
        return ResponseEntity.ok(terminverknuepfungService.getTerminlistByFnr(fnr));
    }
    //    #############################################################
    //    #############################################################

    @PutMapping("/{tnr}/{fnr}")
    public ResponseEntity<TerminverknuepfungDTOSelection> updateTerminverknuepfung(
            @PathVariable Long tnr,
            @PathVariable Long fnr,
            @RequestBody TerminverknuepfungDTOSelection updatingTVDTO) {

        TerminverknuepfungDTOSelection updated = terminverknuepfungService.updateTerminverknuepfung(tnr, fnr, updatingTVDTO);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{tnr}/{fnr}")
    public ResponseEntity<Void> deleteTerminverknuepfung(@PathVariable Long tnr, @PathVariable Long fnr) {
        Terminverknuepfung.TerminverknuepfungId id = new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
        terminverknuepfungService.deleteTerminverknuepfung(id);
        return ResponseEntity.noContent().build();
    }


//    // this simple adding/creating doesn't work because of the relationships of Terminverknuepfung entity!
//    @PostMapping
//    public ResponseEntity<Terminverknuepfung> createTerminverknuepfung(@RequestBody Terminverknuepfung terminverknuepfung) {
//        Terminverknuepfung createdTerminverknuepfung = terminverknuepfungService.saveTerminverknuepfung(terminverknuepfung);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdTerminverknuepfung);
//    }

    // THIS is the add function for new Terminverknuepfung, but because of the relationships of
    // Terminverknuepfung entity, there could be various versions of this add function, version here: link between existing Film and existing Termin (more logic required)
    @PostMapping("/link-film-termin")
    public ResponseEntity<Map<String, String>> linkExistingFilmToExistingTermin(@RequestBody TerminverknuepfungDTOSelection newTV) {
        //  instead of returning a string in form of ResponseEntity<String>, create a simple response object with Map
        try {
            terminverknuepfungService.linkExistingFilmToExistingTermin(newTV);
            Map<String, String> successResponse = Map.of("message", "Film with fnr " + newTV.fnr() + " linked to Termin with tnr " + newTV.tnr() + " successfully");
            return new ResponseEntity<>(successResponse, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = Map.of("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    //    #############################################################
    //    #############################################################

}