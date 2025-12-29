package org.pupille.backend.mysql.survey.auswahloption;

import lombok.Data;

@Data
public class AuswahloptionNestedDTO {
    private Long onr;
    // NO unr field
    private String titel;
    private String details;
    private String link;
}
