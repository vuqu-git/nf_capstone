package org.pupille.backend.mysql.termin;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TerminDTOScreeningdetails {

    private Long tnr;
    private LocalDateTime vorstellungsbeginn;
    private String titel;
    private String text;
    private String besonderheit;
    private String bild;
    private Boolean showImageInDetails;
    private LocalDate startReservierung;
    private String linkReservierung;
    private Integer sonderfarbeTitel;
    private String sonderfarbe;
    private Short veroeffentlichen;
    // Note: filmConnections are intentionally excluded, also reihen

    public TerminDTOScreeningdetails(Termin termin) {
        this.tnr = termin.getTnr();
        this.vorstellungsbeginn = termin.getVorstellungsbeginn();
        this.titel = termin.getTitel();
        this.text = termin.getText();
        this.besonderheit = termin.getBesonderheit();
        this.bild = termin.getBild();
        this.showImageInDetails = termin.getShowImageInDetails();
        this.startReservierung = termin.getStartReservierung();
        this.linkReservierung = termin.getLinkReservierung();
        this.sonderfarbeTitel = termin.getSonderfarbeTitel();
        this.sonderfarbe = termin.getSonderfarbe();
        this.veroeffentlichen = termin.getVeroeffentlichen();
        // Note: filmConnections are intentionally excluded
    }
}