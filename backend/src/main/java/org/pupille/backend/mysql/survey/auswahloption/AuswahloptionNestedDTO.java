package org.pupille.backend.mysql.survey.auswahloption;

import lombok.Data;

@Data
public class AuswahloptionNestedDTO {  // ← NEW CLASS
    private Long onr;
    private String titel;
    private String details;
    // NO unr field
}
