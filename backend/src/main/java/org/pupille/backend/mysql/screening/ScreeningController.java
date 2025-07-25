package org.pupille.backend.mysql.screening;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningService screeningService;

    // for Gallery react component
    @GetMapping()
    public List<TerminDTOWithFilmAndReiheDTOGallery> getAllFutureTermineWithFilms() {
        return screeningService.getAllFutureTermineWithFilms();
    }

//            @GetMapping("/new")
//            public ReihenAndFilmTermineForGallery getReihenAndTermineForGallery() {
//                return screeningService.getReihenAndTermineForGallery();
//            }

    // for ScreeningDetails react component
    @GetMapping("/{tnr}")
    public ResponseEntity<TerminDTOFormWithFilmsDTOFormPlus> getTerminWithFilmsPlusForTermin(@PathVariable Long tnr) {
        TerminDTOFormWithFilmsDTOFormPlus terminWithFilmsPlus = screeningService.getTerminWithFilmsPlusByTnr(tnr);
        return ResponseEntity.ok(terminWithFilmsPlus);
    }

    // for OverviewArchive react component
    @GetMapping("/archive")
    public List<TerminDTOWithFilmDTOOverviewArchive> getArchiveScreenings() {
        return screeningService.getPastTermineWithFilms();
    }

    // for SemesterArchive react component
    @GetMapping("/semester")
    public ReihenAndFilmTermineForOverviewSemester getReihenAndTermineForOverviewSemester() {
        return screeningService.getReihenAndTermineForOverviewSemester();
    }

//            @GetMapping("/semester/old")
//            public List<TerminDTOWithFilmDTOOverviewSemester> getCurrentSemesterScreenings() {
//                return screeningService.getTermineByCurrentSemester();
//            }

    // For Slideshow react component
//    @GetMapping("/screenings/slideshow")
//    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsForSlideshow() {
//        List<TerminDTOWithFilmDTOSlideshow> termineWithFilms = screeningService.getFutureTermineWithFilmsForSlideshow();
//        return termineWithFilms;
//    }

    @GetMapping("/slideshow")
    public List<TerminDTOWithFilmDTOSlideshow> getFutureTermineWithFilmsForSlideshow(
            @RequestParam(value = "next", required = false) Optional<Integer> next
    ) {
        return screeningService.getFutureTermineWithFilmsForSlideshow(next);
    }

//    +++++++++++++++++++++++++++++
//    mail reminder stuff
//    +++++++++++++++++++++++++++++

//    // For screenings exactly N days in the future
//    @GetMapping("/future/{days}")
//    public List<TerminDTOWithFilmDTOMailReminder> getScreeningsDaysInFuture(@PathVariable int days) {
//        return screeningService.getTermineDaysInFuture(days);
//    }
//
//    // For screenings exactly N days in the past
//    @GetMapping("/past/{days}")
//    public List<TerminDTOWithFilmDTOMailReminder> getScreeningsDaysInPast(@PathVariable int days) {
//        return screeningService.getTermineDaysInPast(days);
//    }

}
