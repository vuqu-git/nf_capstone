package org.pupille.backend.mysql.survey.umfrage;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "umfrage")
@Data
@NoArgsConstructor
public class Umfrage {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long unr;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // For Hibernate 6+
    private UUID unr;

    private String anlass;

    @Column(name = "end_datum")
    private LocalDate endDatum;

    @Column(columnDefinition = "TEXT")
    private String beschreibung;

    // ############################################
    // mappedBy refers to the field "umfrage" in the Auswahloption class
    @OneToMany(mappedBy = "umfrage", cascade = CascadeType.ALL, orphanRemoval = true)
                                                                // orphanRemoval = true: This ensures that if you remove an Auswahloption from the optionen list and save the Umfrage, the option is deleted from the database (cleanup).
    @OrderBy("titel ASC")   // tells Hibernate to always append ORDER BY titel ASC when fetching the auswahloptionen list
                            // Now, when calling getAllUmfragen() (or any method that loads Umfrage), the auswahloptionen list inside each Umfrage object will be pre-sorted by titel ascending directly from the database query
    @JsonManagedReference("Umfrage-Auswahloption-Ref")
    private List<Auswahloption> auswahloptionen = new ArrayList<>();
    // ############################################
}
