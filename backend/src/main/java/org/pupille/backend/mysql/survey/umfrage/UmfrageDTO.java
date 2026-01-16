package org.pupille.backend.mysql.survey.umfrage;

import lombok.Data;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionNestedDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class UmfrageDTO {
//    private Long unr;
    private UUID unr;
    private String anlass;
    private LocalDate endDatum;
    private String beschreibung;
    // We only nest the DTO (namely AuswahloptionDTO), not the Entity (namely Auswahloption)
    private List<AuswahloptionNestedDTO> auswahloptionendtos;
}
