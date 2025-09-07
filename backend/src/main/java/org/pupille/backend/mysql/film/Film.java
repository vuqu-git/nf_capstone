package org.pupille.backend.mysql.film;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.Data;
import org.pupille.backend.mysql.terminverknuepfung.Terminverknuepfung;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "film")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fnr;

    private String titel;
    private String originaltitel;
    private Boolean originaltitelAnzeigen; // Maps to `originaltitel_anzeigen`

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(columnDefinition = "TEXT")
    private String kurztext;

    @Column(columnDefinition = "TEXT")
    private String besonderheit;

    private String land;
    private Integer jahr; // Maps to `jahr`

    private String farbe;
    private Integer laufzeit; // Maps to `laufzeit`

    private String sprache;
    private String untertitel;
    private String format;

    // @Convert annotation + FskConverter works only for database persistence, not for JSON serialization.
    //            This is a JPA/Hibernate feature — it controls how Java values are converted to/from database values, not JSON.
    //            So in your case:
    //            You have an enum Film.Fsk, like _0, _6, UNGEPRUEFT, etc.
    //            In the database, you don’t want to store _0 as a string — you want "0", "6", "ungeprüft", etc.
    //                    That’s why you created FskConverter, which tells JPA:
    //            When saving: Fsk._0 ➝ "0"
    //            When loading: "0" ➝ Fsk._0
    @Convert(converter = FskConverter.class)
    private Fsk fsk;

    @Column(columnDefinition = "TEXT")
    private String stab;

    private String bild;

    private String offsetImageInGallery;

    private Integer sonderfarbeTitel; // Maps to `sonderfarbe_titel`

    private String sonderfarbe;

    public enum Fsk {
        _0("0"),
        _6("6"),
        _12("12"),
        _16("16"),
        _18("18"),
        UNGEPRUEFT("ungeprüft");

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // this tells Jackson to serialize the enum using the return value of getValue(), not the enum name (_0, _6, etc).
        private final String databaseValue;

        Fsk(String databaseValue) {
            this.databaseValue = databaseValue;
        }

        @JsonValue
        public String getDatabaseValue() {
            return databaseValue;
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }

    private String regie;

    @Column(columnDefinition = "TEXT")
    private String contentNote;

    @Column(columnDefinition = "TEXT")
    private String trailer;

    private String verleih;

    // ############################################
    // relationship (extension of the entity model)
    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL)
    @JsonManagedReference("TV-Film-Ref")
    private List<Terminverknuepfung> terminConnections = new ArrayList<>();
    // ############################################
}

