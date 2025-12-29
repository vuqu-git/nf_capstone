package org.pupille.backend.mysql.clicks;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.GeneralResponse;
import org.pupille.backend.utils.PupilleUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClicksService {

    private final ClicksRepo clicksRepo;

    // for post end point "/api/clicks"
    public GeneralResponse trackClicks(ClicksDTOForTracking requestDTO) {
        Clicks c = clicksRepo.findById(requestDTO.getTnr())
                .orElseGet(() -> {
                    Clicks newC = new Clicks();
                    newC.setTnr(requestDTO.getTnr());
                    newC.setVorstellungsbeginn(requestDTO.getVorstellungsbeginn());
                    newC.setTitel(requestDTO.getTitel());
                    newC.setSessionScreeningClicks(0L);
                    newC.setUserScreeningClicks(0L);
                    newC.setSessionCalendarClicks(0L);
                    newC.setUserCalendarClicks(0L);
                    newC.setOnlineSince(LocalDate.now());
                    return newC;
                });

        // initial assignment & check for deviations
        // remember: In TerminService, when creating a Clicks object (trigger event is set veroeffentlichen > 0) all fields except titel and visitors are set
        if (c.getTitel() == null || !Objects.equals(requestDTO.getTitel(), c.getTitel())) {
            c.setTitel(requestDTO.getTitel());
        }

        // --------------------
        // check for deviations:
        if (requestDTO.getVorstellungsbeginn() != c.getVorstellungsbeginn()) {
            c.setVorstellungsbeginn(requestDTO.getVorstellungsbeginn());
        }

        if (requestDTO.getWithTerminbesonderheit() != null && !Objects.equals(requestDTO.getWithTerminbesonderheit(), c.getWithTerminbesonderheit()))  {
            c.setWithTerminbesonderheit(requestDTO.getWithTerminbesonderheit());
        }

        if (requestDTO.getInNumberReihen() != null && !Objects.equals(requestDTO.getInNumberReihen(), c.getInNumberReihen())) {
            c.setInNumberReihen(requestDTO.getInNumberReihen());
        }

        if (requestDTO.getIsCanceled() != null && !Objects.equals(requestDTO.getIsCanceled(), c.getIsCanceled())) {
            c.setIsCanceled(requestDTO.getIsCanceled());
        }
        // --------------------
        // increment respective counters
        if (Boolean.TRUE.equals(requestDTO.getWasSessionScreeningClicked())) {
            c.setSessionScreeningClicks(c.getSessionScreeningClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasUserScreeningClicked())) {
            c.setUserScreeningClicks(c.getUserScreeningClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasSessionCalendarClicked())) {
            c.setSessionCalendarClicks(c.getSessionCalendarClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasUserCalendarClicked())) {
            c.setUserCalendarClicks(c.getUserCalendarClicks() + 1);
        }

        clicksRepo.save(c);
        return new GeneralResponse("Counted.");
    }

    public List<ClicksResponseDTO> getAllClicksByCurrentSemesterSortedByVorstellungsbeginnAsc() {

        // determine current semester boundaries:
        PupilleUtils.SemesterDates semesterDates = PupilleUtils.calculateCurrentSemesterDates();

        // Get Termine from current semester on
        List<Clicks> clicksOfSemester = clicksRepo.findClicksByCurrentSemester(
                semesterDates.now(),
                semesterDates.startDateSummer(),
                semesterDates.endDateSummer(),
                semesterDates.startDateWinter(),
                semesterDates.endDateWinter()
        );

        return clicksOfSemester.stream()
                    .map(ClicksResponseDTO::new)
                    .collect(Collectors.toList());
    }
}