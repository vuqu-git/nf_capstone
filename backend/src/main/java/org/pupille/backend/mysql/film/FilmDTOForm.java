package org.pupille.backend.mysql.film;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// DTO for form fields

@Getter
@Setter
@AllArgsConstructor
public class FilmDTOForm {
    private Long fnr;
    private String titel;
    private String originaltitel;
    private Boolean originaltitelAnzeigen;

    private String text;
    private String kurztext;
    private String besonderheit;
    private String land;

    private Integer jahr;
    private String farbe;
    private Integer laufzeit;
    private String sprache;

    private String untertitel;
    private String format;

    @Convert(converter = FskConverter.class) // Explicitly specify the converter
    private Film.Fsk fsk; // Import and use the enum from the Film class
    private String stab;

    private String bild;
    private String offsetImageInGallery;
    private Integer sonderfarbeTitel;
    private String sonderfarbe;

    private String regie;
    private String contentNote;
    private String trailer;
    private String verleih;


    // Constructor to initialize FilmDTOForm from Film entity
    public FilmDTOForm(Film film) {
        this.fnr = film.getFnr();
        this.titel = film.getTitel();
        this.originaltitel = film.getOriginaltitel();
        this.originaltitelAnzeigen = film.getOriginaltitelAnzeigen();

        this.text = film.getText();
        this.kurztext = film.getKurztext();
        this.besonderheit = film.getBesonderheit();
        this.land = film.getLand();

        this.jahr = film.getJahr();
        this.farbe = film.getFarbe();
        this.laufzeit = film.getLaufzeit();
        this.sprache = film.getSprache();

        this.untertitel = film.getUntertitel();
        this.format = film.getFormat();
        this.fsk = film.getFsk();
        this.stab = film.getStab();

        this.bild = film.getBild();
        this.offsetImageInGallery = film.getOffsetImageInGallery();
        this.sonderfarbeTitel = film.getSonderfarbeTitel();
        this.sonderfarbe = film.getSonderfarbe();

        this.regie = film.getRegie();
        this.contentNote = film.getContentNote();
        this.trailer = film.getTrailer();
        this.verleih = film.getVerleih();
    }
}