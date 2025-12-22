package org.pupille.backend.mysql.survey.stimmabgabe;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;
import org.pupille.backend.mysql.survey.umfrage.Umfrage;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stimmabgabe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long snr;

    private LocalDateTime datum;

    private Boolean isSessionDuplicate;
    private Boolean isUserDuplicate;

    // Many Votes -> One Option
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "onr", nullable = false)
    private Auswahloption auswahloption;

    // Many Votes -> One Survey
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unr", nullable = false)
    private Umfrage umfrage;
}
