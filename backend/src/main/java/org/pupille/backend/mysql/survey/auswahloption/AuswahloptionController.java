//package org.pupille.backend.mysql.survey.auswahloption;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("api/survey/auswahloptionen")
//@RequiredArgsConstructor
////@CrossOrigin(origins = "*")
//public class AuswahloptionController {
//
//    private final AuswahloptionService auswahloptionService;
//
//    @GetMapping
//    public List<AuswahloptionDTO> getAll() {
//        return auswahloptionService.getAllAuswahloptionen();
//    }
//
//    @GetMapping("/forumfrage/{unr}")
//    public List<AuswahloptionDTO> getByUmfrage(@PathVariable Long unr) {
//        return auswahloptionService.getByUmfrage(unr);
//    }
//
//    @GetMapping("/{id}")
//    public AuswahloptionDTO getById(@PathVariable Long id) {
//        return auswahloptionService.getAuswahloptionById(id);
//    }
//
//    @PostMapping
//    public AuswahloptionDTO create(@RequestBody AuswahloptionDTO dto) {
//        return auswahloptionService.createAuswahloption(dto);
//    }
//
//    @PutMapping("/{id}")
//    public AuswahloptionDTO update(@PathVariable Long id,
//                                   @RequestBody AuswahloptionDTO dto) {
//        return auswahloptionService.updateAuswahloption(id, dto);
//    }
//
//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable Long id) {
//        auswahloptionService.deleteAuswahloption(id);
//    }
//}
//
//
