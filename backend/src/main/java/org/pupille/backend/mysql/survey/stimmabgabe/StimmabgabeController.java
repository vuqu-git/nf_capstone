package org.pupille.backend.mysql.survey.stimmabgabe;

import jakarta.servlet.http.HttpServletResponse;
import org.pupille.backend.mysql.survey.CsvExportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/survey/stimmabgaben")
@RequiredArgsConstructor
public class StimmabgabeController {

    private final StimmabgabeService stimmabgabeService;
    private final CsvExportService csvExportService;

    // Get all Stimmabgaben for a certain onr (Option)
    @GetMapping("/option/{onr}")
    public List<StimmabgabeDTO> getByOption(@PathVariable Long onr) {
        return stimmabgabeService.getByOption(onr);
    }

    // Get all Stimmabgaben for a certain unr (Survey)
    @GetMapping("/forumfrage/{unr}")
    public List<StimmabgabeByUmfrageDTO> getByUmfrage(@PathVariable Long unr) {
        return stimmabgabeService.getBySurvey(unr);
    }

    // Download csv file with the data analogous to the output getByUmfrage
    @GetMapping("/forumfrage/{unr}/export")
    public StreamingResponseBody getByUmfrageExport(
            @PathVariable Long unr,
            HttpServletResponse response) {

        List<StimmabgabeByUmfrageDTO> votes = stimmabgabeService.getBySurvey(unr);
        String umfrageAnlass = votes.isEmpty() ? "unknown" : votes.get(0).getUmfrageAnlass();

        // Fixed filename with umlauts
        String sanitizedAnlass = umfrageAnlass
                .replaceAll("[<>\"|?*]", "")
                .replaceAll("\\s+", "_")
                .trim();

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm"));
        String filename = String.format("survey_%s_fetched_%s.csv", sanitizedAnlass, timestamp);

        // Set headers
        response.setContentType("text/csv;charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        // Stream DIRECTLY to client - NO intermediate ByteArrayInputStream
        return outputStream -> csvExportService.exportVotes(votes, outputStream);
    }

    @GetMapping("/forumfrage/{unr}/exportgrouped")
    public StreamingResponseBody getByUmfrageExportGrouped(
            @PathVariable Long unr,
            HttpServletResponse response) {

        // Logic moved to service
        List<StimmabgabeByUmfrageDTO> groupedVotes = stimmabgabeService.getBySurveyGroupedAndSorted(unr);

        String umfrageAnlass = groupedVotes.isEmpty() ? "unknown" : groupedVotes.get(0).getUmfrageAnlass();

        // ... filename generation (UI/HTTP concern) ...
        String sanitizedAnlass = umfrageAnlass.replaceAll("[<>\"|?*]", "").replaceAll("\\s+", "_").trim();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm"));
        String filename = String.format("survey_%s_grouped_fetched_%s.csv", sanitizedAnlass, timestamp);

        response.setContentType("text/csv;charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        return outputStream -> csvExportService.exportVotes(groupedVotes, outputStream);
    }

    // Get all Stimmabgaben for a certain unr, grouped by onr
    @GetMapping("/forumfrage/{unr}/grouped")
    public Map<Long, List<StimmabgabeDTO>> getByUmfrageGrouped(@PathVariable Long unr) {
        return stimmabgabeService.getBySurveyGroupedByOption(unr);
    }

    // Create Vote (expects valid unr and onr in body)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // Sets 201 Created automatically
    public StimmabgabeDTO create(@RequestBody StimmabgabeDTO dto) {
        return stimmabgabeService.createStimmabgabe(dto);
    }

    // Delete Vote by snr
    @DeleteMapping("/{snr}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Sets 204 No Content automatically
    public void delete(@PathVariable Long snr) {
        stimmabgabeService.deleteStimmabgabe(snr);
    }
}
