package org.pupille.backend.mysql.survey.stimmabgabe;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StimmabgabeDTO {

    private Long snr;   // Stimme
    private Instant datum;

    // Status flags
    private Boolean isd;
    private Boolean iud;

    // Foreign Keys (ID references)
    private Long onr;   // Option
    private UUID unr;   // Umfrage

    // Convenience fields for the UI
    // (saves the frontend from looking up what "onr: 55" actually means)
    private String umfrageAnlass;
    private String auswahloptionTitel;
    private String auswahloptionDetails;
    private String auswahloptionLink;
}
