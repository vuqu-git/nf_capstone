//package org.pupille.backend.mysql.survey.auswahloption;
//
//import lombok.RequiredArgsConstructor;
//import org.pupille.backend.mysql.survey.SurveyMapper;
//import org.pupille.backend.mysql.survey.exception.AuswahloptionNotFoundException;
//import org.pupille.backend.mysql.survey.exception.UmfrageNotFoundException;
//import org.pupille.backend.mysql.survey.umfrage.Umfrage;
//import org.pupille.backend.mysql.survey.umfrage.UmfrageRepository;
//
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AuswahloptionService {
//
//    private final AuswahloptionRepository auswahloptionRepository;
//    private final UmfrageRepository umfrageRepository;
//    private final SurveyMapper surveyMapper;
//
//    public List<AuswahloptionDTO> getAllAuswahloptionen() {
//        return auswahloptionRepository
//                .findAll()
//                .stream()
//                .map(surveyMapper::toAuswahloptionDto)
//                .toList();
//    }
//
//    public List<AuswahloptionDTO> getByUmfrage(Long unr) {
//        if (!umfrageRepository.existsById(unr)) {
//            throw new UmfrageNotFoundException("Umfrage not found: " + unr);
//        }
//
//        return auswahloptionRepository
//                .findByUmfrage_Unr(unr, Sort.by(Sort.Direction.ASC, "titel"))
//                .stream()
//                .map(surveyMapper::toAuswahloptionDto)
//                .toList();
//    }
//
//    public AuswahloptionDTO getAuswahloptionById(Long id) {
//        Auswahloption entity = auswahloptionRepository.findById(id)
//                .orElseThrow(() -> new AuswahloptionNotFoundException("Auswahloption not found: " + id));
//        return surveyMapper.toAuswahloptionDto(entity);
//    }
//
//    @Transactional
//    public AuswahloptionDTO createAuswahloption(AuswahloptionDTO dto) {
//        Auswahloption entity = surveyMapper.toAuswahloptionEntity(dto);
//
//        Umfrage umfrage = umfrageRepository.findById(dto.getUnr())
//                .orElseThrow(() -> new UmfrageNotFoundException("Umfrage not found: " + dto.getUnr()));
//        entity.setUmfrage(umfrage);
//
//        Auswahloption saved = auswahloptionRepository.save(entity);
//        return surveyMapper.toAuswahloptionDto(saved);
//    }
//
//    @Transactional
//    public AuswahloptionDTO updateAuswahloption(Long id, AuswahloptionDTO dto) {
//        Auswahloption existing = auswahloptionRepository.findById(id)
//                .orElseThrow(() -> new AuswahloptionNotFoundException("Auswahloption not found: " + id));
//
//        existing.setTitel(dto.getTitel());
//        existing.setDetails(dto.getDetails());
//        existing.setLink(dto.getLink());
//
//        // This block handles moving an option from one survey to another (re-parenting). It checks if the "Parent ID" sent in the request (dto.getUnr()) is different from what is currently saved in the database.
//        // Explanation:
//        //      dto.getUnr() != null: First, we ensure the DTO actually contains a parent ID. If the client sends null (or omits the field), we assume they don't want to change the relationship, so we skip this block.
//        //      existing.getUmfrage() == null: A safety check. If the current option in the database somehow has no parent (orphaned), we should definitely assign the new one.
//        //      !dto.getUnr().equals(...): The CORE check! It compares the New ID (from DTO) with the Old ID (from Database).
//        //          Example: If the Option belongs to Survey #5, and the DTO says unr: 5, they are equal. The condition is false. We do nothing (efficiency).
//        //          Example: If the Option belongs to Survey #5, and the DTO says unr: 99, they are different. The condition is true. We enter the block.
//        if ( dto.getUnr() != null && (existing.getUmfrage() == null
//                || !dto.getUnr().equals(existing.getUmfrage().getUnr())) ) { // if statement asks "Does the user/client want to change the parent?"
//            Umfrage umfrage = umfrageRepository.findById(dto.getUnr())
//                    .orElseThrow(() -> new UmfrageNotFoundException("Umfrage not found: " + dto.getUnr()));
//            existing.setUmfrage(umfrage);
//        }
//
//        Auswahloption saved = auswahloptionRepository.save(existing);
//        return surveyMapper.toAuswahloptionDto(saved);
//    }
//
//    public void deleteAuswahloption(Long id) {
//        if (!auswahloptionRepository.existsById(id)) {
//            throw new AuswahloptionNotFoundException("Auswahloption not found: " + id);
//        }
//        auswahloptionRepository.deleteById(id);
//    }
//}
