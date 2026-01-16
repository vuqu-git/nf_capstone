package org.pupille.backend.mysql.survey.umfrage;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/survey/umfragen")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class UmfrageController {

    private final UmfrageService umfrageService;

//    @GetMapping
//    public List<UmfrageDTO> getAllUmfragen() {
//        return umfrageService.getAllUmfragen();
//    }

    @GetMapping
    public List<UmfrageSelectionDTO> getAllUmfragenForSelection() {
        return umfrageService.getAllUmfragenForSelection();
    }

    @GetMapping("/{unr}")
    public UmfrageDTO getUmfrageById(@PathVariable UUID unr) {
        return umfrageService.getUmfrageById(unr);
    }

    @PostMapping
    public UmfrageDTO createUmfrage(@RequestBody UmfrageDTO dto) {
        return umfrageService.createUmfrage(dto);
    }

    @PutMapping("/{unr}")
    public UmfrageDTO updateUmfrage(@PathVariable UUID unr,
                                    @RequestBody UmfrageDTO dto) {
        return umfrageService.updateUmfrage(unr, dto);
    }

    @DeleteMapping("/{unr}")
    public void deleteUmfrage(@PathVariable UUID unr) {
        umfrageService.deleteUmfrage(unr);
        // Spring returns 200/204 with empty body by default
    }
}

