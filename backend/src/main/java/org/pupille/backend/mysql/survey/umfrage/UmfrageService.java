package org.pupille.backend.mysql.survey.umfrage;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.survey.SurveyMapper;
import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionNestedDTO;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UmfrageService {

    private final UmfrageRepository umfrageRepository;
    private final SurveyMapper surveyMapper;

    public List<UmfrageDTO> getAllUmfragen() {
        return umfrageRepository
                .findAll(Sort.by(Sort.Direction.DESC, "endDatum"))  // generates SQL with ORDER BY end_datum DESC directly in the database; Generated SQL (approximately): SELECT f.* FROM umfrage f ORDER BY f.end_datum DESC
                .stream()
                .map(surveyMapper::toUmfrageDto)
                .toList();
    }

    public UmfrageDTO getUmfrageById(Long id) {
        Umfrage entity = umfrageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umfrage not found: " + id));
        return surveyMapper.toUmfrageDto(entity);
    }

    @Transactional
    public UmfrageDTO createUmfrage(UmfrageDTO dto) {
        Umfrage umfrageEntity = surveyMapper.toUmfrageEntity(dto);

        // -----------------------------------------------------
        // optional: handle nested auswahloptionendtos on create
        if (dto.getAuswahloptionendtos() != null) {
            dto.getAuswahloptionendtos().forEach(optDto -> {
                Auswahloption opt = surveyMapper.toAuswahloptionEntity(optDto);
                opt.setUmfrage(umfrageEntity);                  // child -> parent

                umfrageEntity.getAuswahloptionen().add(opt);    // parent -> child
            });
        }
        // -----------------------------------------------------

        Umfrage saved = umfrageRepository.save(umfrageEntity);
        return surveyMapper.toUmfrageDto(saved);
    }

    @Transactional
    public UmfrageDTO updateUmfrage(Long id, UmfrageDTO dto) {
        Umfrage existingUmfrage = umfrageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umfrage not found: " + id));

//        Below is a pattern that:
//              Updates simple fields (anlass, endDatum).
//              Adds new options, updates existing ones, and removes deleted ones via orphanRemoval = true.
//
//        Assumptions:
//          Umfrage has:
//              java
//              @OneToMany(mappedBy = "umfrage", cascade = CascadeType.ALL, orphanRemoval = true)
//              private List<Auswahloption> auswahloptionen = new ArrayList<>();
//
//          DTO:
//              java
//              private List<AuswahloptionDTO> auswahloptionendtos;

        //this service method can (mix all three in one call also possible):
        //      Update some options (existing IDs kept).
        //      Add new options (without IDs).
        //      Delete others (leave them out of the list).


        // 1. Update simple fields
        existingUmfrage.setAnlass(dto.getAnlass());
        existingUmfrage.setEndDatum(dto.getEndDatum());
        existingUmfrage.setBeschreibung(dto.getBeschreibung());

        // -------------------------------------------
        // 2. Sync children (Auswahloptionen) from DTO
        Map<Long, Auswahloption> existingById = existingUmfrage.getAuswahloptionen().stream()
                .collect(Collectors.toMap(Auswahloption::getOnr, Function.identity()));

        List<Auswahloption> newChildren = new ArrayList<>();

        if (dto.getAuswahloptionendtos() != null) {
            for (AuswahloptionNestedDTO childDto : dto.getAuswahloptionendtos()) {
                Auswahloption child;

                if (childDto.getOnr() != null && existingById.containsKey(childDto.getOnr())) {
                    // 2a. UPDATE existing child
                    child = existingById.get(childDto.getOnr());
                    child.setTitel(childDto.getTitel());
                    child.setDetails(childDto.getDetails());

                    // parent already set
                } else {
                    // 2b. ADD new child
                    child = surveyMapper.toAuswahloptionEntity(childDto);
                    child.setUmfrage(existingUmfrage);        // child -> parent
                }

                newChildren.add(child);
            }
        }

        // 2c. REPLACE collection; orphanRemoval=true will delete removed ones
        existingUmfrage.getAuswahloptionen().clear();
        existingUmfrage.getAuswahloptionen().addAll(newChildren);
        // -------------------------------------------

        // 3. Save aggregate root
        Umfrage saved = umfrageRepository.save(existingUmfrage);
        return surveyMapper.toUmfrageDto(saved);

//        This implementation is what “handle children in the service” (c.f. toUmfrageEntity in SurveyMapper class) means:
//          It sets opt.setUmfrage(existingUmfrage) for all children that should belong to this Umfrage.
//          It rebuilds the parent auswahloptionen list so that removed DTOs become database orphans, which Hibernate deletes thanks to orphanRemoval = true.
    }

    public void deleteUmfrage(Long id) {
        umfrageRepository.deleteById(id);
        // the children (=corresponding Auswahloption objects) are deleted automatically:
        //        Hibernate first fetches the Umfrage entity.
        //        It sees CascadeType.ALL (which includes REMOVE) or CascadeType.REMOVE.
        //        It automatically deletes all corresponding Auswahloption rows from the database.
    }
}
