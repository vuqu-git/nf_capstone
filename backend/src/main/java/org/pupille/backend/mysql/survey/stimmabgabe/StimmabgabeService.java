package org.pupille.backend.mysql.survey.stimmabgabe;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.survey.SurveyMapper;
import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionRepository;
import org.pupille.backend.mysql.survey.umfrage.Umfrage;
import org.pupille.backend.mysql.survey.umfrage.UmfrageRepository;
import org.pupille.backend.mysql.survey.exception.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StimmabgabeService {

    private final StimmabgabeRepository stimmabgabeRepository;
    private final UmfrageRepository umfrageRepository;
    private final AuswahloptionRepository auswahloptionRepository;
    private final SurveyMapper stimmabgabeMapper;

    /**
     * Get all votes for a specific Option
     */
    public List<StimmabgabeDTO> getByOption(Long onr) {
        return stimmabgabeRepository.findByAuswahloption_Onr(onr)
                .stream()
                .map(stimmabgabeMapper::toStimmabgabeDto)
                .toList();
    }

    /**
     * Get all votes for a specific Survey
     */
    public List<StimmabgabeByUmfrageDTO> getByUmfrage(Long unr) {
        return stimmabgabeRepository.findByUmfrage_UnrOrderByDatumAsc(unr)
                .stream()
                .map(stimmabgabeMapper::toStimmabgabeByUmfrageDto)
                .toList();
    }

    /**
     * Get all votes for a specific Survey, grouped by Option ID (onr)
     * Returns a Map where Key = Option ID, Value = List of Votes
     */
    public Map<Long, List<StimmabgabeDTO>> getByUmfrageGroupedByOption(Long unr) {
        return stimmabgabeRepository.findByUmfrage_Unr(unr)
                .stream()
                .map(stimmabgabeMapper::toStimmabgabeDto)
                .collect(Collectors.groupingBy(StimmabgabeDTO::getOnr));
    }

    /**
     * Fetches votes for a survey, grouped by Option (onr) and sorted by date ascending.
     * Returns a flattened list suitable for CSV export.
     */
    public List<StimmabgabeByUmfrageDTO> getByUmfrageGroupedAndSorted(Long unr) {
        return stimmabgabeRepository.findByUmfrage_Unr(unr)
                .stream()
                .map(stimmabgabeMapper::toStimmabgabeByUmfrageDto)
                // Logic: Group by Option, then Sort by Date
                .sorted(Comparator.comparing(StimmabgabeByUmfrageDTO::getOnr)
                        .thenComparing(StimmabgabeByUmfrageDTO::getDatum))
                .collect(Collectors.toList());
    }

    /**
     * Create a new Vote with Consistency Check
     */
    // contains the critical validation logic - the Consistency Check:
    // Since you now have two Foreign Keys, you run the risk of inconsistency (e.g., A vote points to Survey A, but the Option belongs to Survey B).
    // You must enforce consistency in your Service Layer before saving
    @Transactional
    public StimmabgabeDTO createStimmabgabe(StimmabgabeDTO dto) {
        // Capture time once at the start of transaction
        final Instant now = Instant.now();

        Long unr = dto.getUnr();
        Long onr = dto.getOnr();

        // 1. Fetch Entities to validate existence
        Umfrage umfrage = umfrageRepository.findById(unr)
                .orElseThrow(() -> new UmfrageNotFoundException("Umfrage not found: " + unr));

        Auswahloption option = auswahloptionRepository.findById(onr)
                .orElseThrow(() -> new AuswahloptionNotFoundException("Auswahloption not found: " + onr));

        // 2. CRITICAL CONSISTENCY CHECK
        // Ensure the selected Option actually belongs to the selected Survey
        if (!option.getUmfrage().getUnr().equals(unr)) {
            throw new StimmabgabeUnrOnrDataInconsistencyException(
                    String.format("Data Inconsistency: Option %d belongs to Survey %d, not Survey %d",
                            onr, option.getUmfrage().getUnr(), unr)
            );
        }

        // 3. Expiration Check
        // Logic: Take the LocalDate -> Go to end of that day (Frankfurt) -> Compare with NOW (UTC)
        if (umfrage.getEndDatum() != null) {
            Instant closingTime = umfrage.getEndDatum()
                    .atTime(LocalTime.MAX)        // 23:59:59.999...
                    .atZone(ZoneId.of("Europe/Berlin")) // interpret as German time, hard coded!
                    .toInstant();                 // convert to absolute UTC
            // Compare with "NOW" (UTC)
            if (now.isAfter(closingTime)) {
                throw new UmfrageExpiredException("Umfrage ist bereits beendet.");
            }
        }

        // 4. Create and Populate Entity
        Stimmabgabe entity = new Stimmabgabe();
        entity.setUmfrage(umfrage);
        entity.setAuswahloption(option);

        // Set timestamp (default to now if null)
        entity.setDatum(dto.getDatum() != null ? dto.getDatum() : now);

        // Set duplicate flags (default to false if null)
        entity.setIsSessionDuplicate(Boolean.TRUE.equals(dto.getIsSessionDuplicate()));
        entity.setIsUserDuplicate(Boolean.TRUE.equals(dto.getIsUserDuplicate()));

        // 5. Save and return DTO
        Stimmabgabe saved = stimmabgabeRepository.save(entity);
        return stimmabgabeMapper.toStimmabgabeDto(saved);
    }
//    public GeneralResponse createStimmabgabe(StimmabgabeDTO dto) {
//        Long unr = dto.getUnr();
//        Long onr = dto.getOnr();
//
//        // 1. Fetch Entities to validate existence
//        Umfrage umfrage = umfrageRepository.findById(unr)
//                .orElseThrow(() -> new RuntimeException("Umfrage not found: " + unr));
//
//        Auswahloption option = auswahloptionRepository.findById(onr)
//                .orElseThrow(() -> new RuntimeException("Auswahloption not found: " + onr));
//
//        // 2. CRITICAL CONSISTENCY CHECK
//        // Ensure the selected Option actually belongs to the selected Survey
//        if (!option.getUmfrage().getUnr().equals(unr)) {
//            throw new IllegalArgumentException(
//                    String.format("Data Inconsistency: Option %d belongs to Survey %d, not Survey %d",
//                            onr, option.getUmfrage().getUnr(), unr)
//            );
//        }
//        // 3. Expiration Check
//        // Logic: Take the LocalDate -> Go to end of that day (Frankfurt) -> Compare with NOW (UTC)
//            if (umfrage.getEndDatum() != null) {
//            Instant closingTime = umfrage.getEndDatum()
//                    .atTime(LocalTime.MAX)        // 23:59:59.999...
//                    .atZone(ZoneId.of("Europe/Berlin")) // interpret as German time, hard coded!
//                    .toInstant();                 // convert to absolute UTC
//            // Compare with "NOW" (UTC)
//            if (Instant.now().isAfter(closingTime)) {
//                throw new IllegalStateException("Umfrage ist bereits beendet.");
//            }
//        }
//
//        // 4. Create and Populate Entity
//        Stimmabgabe entity = new Stimmabgabe();
//        entity.setUmfrage(umfrage);
//        entity.setAuswahloption(option);
//
//        // Set timestamp (default to now if null)
//        entity.setDatum(dto.getDatum() != null ? dto.getDatum() : LocalDateTime.now());
//
//        // Set duplicate flags (default to false if null)
//        entity.setIsSessionDuplicate(Boolean.TRUE.equals(dto.getIsSessionDuplicate()));
//        entity.setIsUserDuplicate(Boolean.TRUE.equals(dto.getIsUserDuplicate()));
//
//        // 5. Save and return GeneralResponse
//        stimmabgabeRepository.save(entity);
//        return new GeneralResponse("Voted");
//    }

    /**
     * Delete a vote
     */
    public void deleteStimmabgabe(Long snr) {
        if (!stimmabgabeRepository.existsById(snr)) {
            throw new StimmabgabeNotFoundException("Stimmabgabe not found: " + snr);
        }
        stimmabgabeRepository.deleteById(snr);
    }
}
