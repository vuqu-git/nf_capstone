package org.pupille.backend.mysql.film;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
    private Film.Fsk fsk;
    private String stab;

    private String bild;
    private Integer sonderfarbeTitel;
    private Integer sonderfarbe;


    public enum Fsk {
        _0, _6, _12, _16, _18, UNGEPRUEFT
    }

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
        this.sonderfarbeTitel = film.getSonderfarbeTitel();
        this.sonderfarbe = film.getSonderfarbe();
    }
}