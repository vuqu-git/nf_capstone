package org.pupille.backend.termin;

import org.pupille.backend.termin.Termin;
import org.pupille.backend.termin.TerminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/termine")
public class TerminController {

    private final TerminService terminService;

    @Autowired
    public TerminController(TerminService terminService) {
        this.terminService = terminService;
    }

    @GetMapping
    public ResponseEntity<List<Termin>> getAllTermine() {
        return new ResponseEntity<>(terminService.getAllTermine(), HttpStatus.OK);
    }

    @GetMapping("/{tnr}")
    public ResponseEntity<Termin> getTerminById(@PathVariable Integer tnr) {
        Optional<Termin> termin = terminService.getTerminById(tnr);
        return termin.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Termin> createTermin(@RequestBody Termin termin) {
        return new ResponseEntity<>(terminService.createTermin(termin), HttpStatus.CREATED);
    }

    @PutMapping("/{tnr}")
    public ResponseEntity<Termin> updateTermin(@PathVariable Integer tnr, @RequestBody Termin termin) {
        return new ResponseEntity<>(terminService.updateTermin(tnr, termin), HttpStatus.OK);
    }

    @DeleteMapping("/{tnr}")
    public ResponseEntity<Void> deleteTermin(@PathVariable Integer tnr) {
        terminService.deleteTermin(tnr);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleNotFoundException(RuntimeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}