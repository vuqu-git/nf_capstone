package org.pupille.backend.mysql.survey.umfrage;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/survey/umfragen")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class UmfrageController {

    private final UmfrageService umfrageService;

    @GetMapping
    public List<UmfrageDTO> getAllUmfragen() {
        return umfrageService.getAllUmfragen();
    }

    @GetMapping("/{id}")
    public UmfrageDTO getUmfrageById(@PathVariable Long id) {
        return umfrageService.getUmfrageById(id);
    }

    @PostMapping
    public UmfrageDTO createUmfrage(@RequestBody UmfrageDTO dto) {
        return umfrageService.createUmfrage(dto);
    }

    @PutMapping("/{id}")
    public UmfrageDTO updateUmfrage(@PathVariable Long id,
                                    @RequestBody UmfrageDTO dto) {
        return umfrageService.updateUmfrage(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUmfrage(@PathVariable Long id) {
        umfrageService.deleteUmfrage(id);
        // Spring returns 200/204 with empty body by default
    }
}

