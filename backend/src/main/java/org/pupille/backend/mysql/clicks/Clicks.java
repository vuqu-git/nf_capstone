package org.pupille.backend.mysql.clicks;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clicks")
@Data
@NoArgsConstructor
public class Clicks {

    @Id
    @Column(name = "tnr")
    private Long tnr;

    @Column(name = "vorstellungsbeginn")
    private LocalDateTime vorstellungsbeginn;

    @Column(name = "titel")
    private String titel;

    @Column(name = "session_termin_clicks")
    private Long sessionTerminClicks;

    @Column(name = "user_termin_clicks")
    private Long userTerminClicks;

    @Column(name = "session_calendar_clicks")
    private Long sessionCalendarClicks;

    @Column(name = "user_calendar_clicks")
    private Long userCalendarClicks;

    @Column(name = "visitors")
    private Integer visitors;

    @Column(name = "outside_programmheft")
    private Boolean outsideProgrammheft;

    @Column(name = "online_since")
    private LocalDate onlineSince;
}
