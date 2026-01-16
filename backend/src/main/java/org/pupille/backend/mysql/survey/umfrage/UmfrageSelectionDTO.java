package org.pupille.backend.mysql.survey.umfrage;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class UmfrageSelectionDTO {
//    private Long unr;
    private UUID unr;
    private String anlass;
    private LocalDate endDatum;
}
