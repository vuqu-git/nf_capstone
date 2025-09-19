package org.pupille.backend.mysql.clicks;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ClicksResponseDTO {
    private LocalDateTime vorstellungsbeginn;
    private String titel;
    private Long sessionTerminClicks;
    private Long userTerminClicks;
    private Long sessionCalendarClicks;
    private Long userCalendarClicks;
    private Integer visitors;
    private Boolean outsideProgrammheft;
    private LocalDate onlineSince;

    public ClicksResponseDTO(Clicks c) {
        this.vorstellungsbeginn = c.getVorstellungsbeginn();
        this.titel = c.getTitel();
        this.sessionTerminClicks = c.getSessionTerminClicks();
        this.userTerminClicks = c.getUserTerminClicks();
        this.sessionCalendarClicks = c.getSessionCalendarClicks();
        this.userCalendarClicks = c.getUserCalendarClicks();
        this.visitors = c.getVisitors();
        this.outsideProgrammheft = c.getOutsideProgrammheft();
        this.onlineSince = c.getOnlineSince();
    }
}
