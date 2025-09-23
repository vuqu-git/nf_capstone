package org.pupille.backend.mysql.clicks;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.pupille.backend.mysql.termin.Termin;

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

    @Column(name = "session_screening_clicks")
    private Long sessionScreeningClicks;

    @Column(name = "user_screening_clicks")
    private Long userScreeningClicks;

    @Column(name = "session_calendar_clicks")
    private Long sessionCalendarClicks;

    @Column(name = "user_calendar_clicks")
    private Long userCalendarClicks;

    @Column(name = "visitors")
    private Integer visitors;

    @Column(name = "inside_programmheft")
    private Boolean insideProgrammheft;

    @Column(name = "with_terminbesonderheit")
    private Boolean withTerminbesonderheit;

    @Column(name = "in_number_reihen")
    private Short inNumberReihen;

    @Column(name = "online_since")
    private LocalDate onlineSince;

    // ############################################
    // Mandatory relationship to Termin - shares the same primary key
    // mandatory means: 1 Clicks object must have 1 associated Termin object
    @MapsId
    @OneToOne(optional = false)
    @JoinColumn(name = "tnr")
    private Termin termin;
}
