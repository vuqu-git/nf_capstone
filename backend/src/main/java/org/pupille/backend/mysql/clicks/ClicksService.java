package org.pupille.backend.mysql.clicks;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.utils.PupilleUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClicksService {

    private final ClicksRepo clicksRepo;

    public String trackClicks(ClicksDTOForTracking requestDTO) {
        Clicks c = clicksRepo.findById(requestDTO.getTnr())
                .orElseGet(() -> {
                    Clicks newC = new Clicks();
                    newC.setTnr(requestDTO.getTnr());
                    newC.setVorstellungsbeginn(requestDTO.getVorstellungsbeginn());
                    newC.setTitel(requestDTO.getTitel());
                    newC.setSessionTerminClicks(0L);
                    newC.setUserTerminClicks(0L);
                    newC.setSessionCalendarClicks(0L);
                    newC.setUserCalendarClicks(0L);
                    newC.setOnlineSince(LocalDate.now());
                    return newC;
                });

        if (Boolean.TRUE.equals(requestDTO.getWasSessionTerminClicked())) {
            c.setSessionTerminClicks(c.getSessionTerminClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasUserTerminClicked())) {
            c.setUserTerminClicks(c.getUserTerminClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasSessionCalendarClicked())) {
            c.setSessionCalendarClicks(c.getSessionCalendarClicks() + 1);
        }
        if (Boolean.TRUE.equals(requestDTO.getWasUserCalendarClicked())) {
            c.setUserCalendarClicks(c.getUserCalendarClicks() + 1);
        }

        clicksRepo.save(c);
        return "Counted.";
    }

    public List<ClicksResponseDTO> getAllClicksByCurrentSemesterSortedByVorstellungsbeginnAsc() {

        // Get Termine of current semester; call with distinct semester boundaries:
        PupilleUtils.SemesterDates semesterDates = PupilleUtils.calculateCurrentSemesterDates();

        List<Clicks> clicksOfSemester = clicksRepo.findClicksByCurrentSemester(
                semesterDates.now(),
                semesterDates.startDateSummer(),
                semesterDates.endDateSummer(),
                semesterDates.endDateWinter(),
                semesterDates.endDateWinter()
        );

        List<ClicksResponseDTO> clicksResponseDTOOfSemester = clicksOfSemester.stream()
                                        .map(ClicksResponseDTO::new)
                                        .collect(Collectors.toList());

        return  clicksResponseDTOOfSemester;
    }
}