package org.pupille.backend.mysql.clicks;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clicks")
@RequiredArgsConstructor
public class ClicksController {

    private final ClicksService clicksService;

    @PostMapping
    public ResponseEntity<String> trackClicks(@RequestBody ClicksDTOForTracking requestDTO) {
        String result = clicksService.trackClicks(requestDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<ClicksResponseDTO>> getAllClicksSortedByVorstellungsbeginnAsc() {
        List<ClicksResponseDTO> clicks = clicksService.getAllClicksByCurrentSemesterSortedByVorstellungsbeginnAsc();
        return ResponseEntity.ok(clicks);
    }
}
