package org.pupille.backend.mysql.survey.stimmabgabe;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StimmabgabeByUmfrageDTO {

    private Long snr;
    private LocalDateTime datum;

    // Status flags
    private Boolean isSessionDuplicate;
    private Boolean isUserDuplicate;

    // Foreign Key (ID reference) - KEEP onr
    private Long onr;

    // Convenience fields for the UI
    private String auswahloptionTitel;
    private String auswahloptionDetails;
    private String umfrageAnlass;

    // NO 'unr' field - context already known from /api/survey/stimmabgaben/survey/{unr} endpoint
}
