package org.pupille.backend.mysql.survey.umfrage;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UmfrageSelectionDTO {
    private Long unr;
    private String anlass;
    private LocalDate endDatum;
}
