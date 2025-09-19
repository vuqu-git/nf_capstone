package org.pupille.backend.mysql.reihe;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reihe")
@RequiredArgsConstructor
public class ReiheController {

    private final ReiheService reiheService;

    @GetMapping()
    public ResponseEntity<List<ReiheDTOSelection>> getAllReihen() {
        return ResponseEntity.ok(reiheService.getAllReihen());
    }

    @GetMapping("/{rnr}")
    public ResponseEntity<ReiheDTOFormWithTermineAndFilme> getReiheDTOFormByIdWithTermineAndFilms(@PathVariable Long rnr) {
        return ResponseEntity.ok(reiheService.getReiheDTOFormByIdWithTermineAndFilms(rnr));
    }

    @PostMapping
    public ResponseEntity<Reihe> createReihe(@RequestBody Reihe reihe) {
        return ResponseEntity.ok(reiheService.createReihe(reihe));
    }

    @PutMapping("/{rnr}")
    public ResponseEntity<Reihe> updateReihe(@PathVariable Long rnr, @RequestBody Reihe reihe) {
        return ResponseEntity.ok(reiheService.updateReihe(rnr, reihe));
    }

    @DeleteMapping("/{rnr}")
    public ResponseEntity<Void> deleteReihe(@PathVariable Long rnr) {
        reiheService.deleteReihe(rnr);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------------------------------------
    // a method for fetching list of reihen when giving tnr (fnr)
    // used in TerminForm.tsx
    @GetMapping("/getreihen-fromtermin/{tnr}")
    public ResponseEntity<List<ReiheDTOSelection>> getAllReihenByTerminId(@PathVariable Long tnr) {
        return ResponseEntity.ok(reiheService.getAllReihenByTerminId(tnr));
    }

    // #####################################################################
    // --- Get a list of Reihen (with all its Termine & Films belonging to one Reihe) for a given Tnr ---
    // --- What for? → data fetched in ScreeningDetails.tsx and displayed in TerminFilmDetailsCard.tsx
    @GetMapping("/getreihen-withallitstermineandfilms-fromtermin/{tnr}")
    public ResponseEntity<List<ReiheDTOFormWithTermineAndFilme>> getAllReihenByTerminIdWithAllItsTermineAndFilms(@PathVariable Long tnr) {
        return ResponseEntity.ok(reiheService.getAllReihenByTerminIdWithAllItsTermineAndFilms(tnr));
    }

    // #####################################################################
    // --- Add Termin to Reihe ---
    @PostMapping("/{rnr}/termin/{tnr}")
    public ResponseEntity<Reihe> addTerminToReihe(
            @PathVariable Long rnr,
            @PathVariable Long tnr) {
        Reihe updated = reiheService.addTerminToReihe(rnr, tnr);
        return ResponseEntity.ok(updated);
    }

    // --- Delete Termin from Reihe ---
    @DeleteMapping("/{rnr}/termin/{tnr}")
    public ResponseEntity<Void> removeTerminFromReihe(
            @PathVariable Long rnr,
            @PathVariable Long tnr) {
        try {
            reiheService.removeTerminFromReihe(rnr, tnr);
            return ResponseEntity.noContent().build(); // 204 No Content for successful deletion
        } catch (NoSuchElementException e) {
            // This catches "Reihe not found", "Termin not found", or "Connection not found"
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}
