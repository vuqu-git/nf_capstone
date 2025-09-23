package org.pupille.backend.mysql.clicks;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ClicksResponseDTO {
    private Long tnr;
    private LocalDateTime vorstellungsbeginn;
    private String titel;
    private Long sessionScreeningClicks;
    private Long userScreeningClicks;
    private Long sessionCalendarClicks;
    private Long userCalendarClicks;
    private Integer visitors;
    private Boolean insideProgrammheft;
    private Boolean withTerminbesonderheit;
    private Short inNumberReihen;
    private LocalDate onlineSince;

    public ClicksResponseDTO(Clicks c) {
        this.tnr = c.getTnr();
        this.vorstellungsbeginn = c.getVorstellungsbeginn();
        this.titel = c.getTitel();
        this.sessionScreeningClicks = c.getSessionScreeningClicks();
        this.userScreeningClicks = c.getUserScreeningClicks();
        this.sessionCalendarClicks = c.getSessionCalendarClicks();
        this.userCalendarClicks = c.getUserCalendarClicks();
        this.visitors = c.getVisitors();
        this.insideProgrammheft = c.getInsideProgrammheft();
        this.withTerminbesonderheit = c.getWithTerminbesonderheit();
        this.inNumberReihen = c.getInNumberReihen();
        this.onlineSince = c.getOnlineSince();
    }
}
