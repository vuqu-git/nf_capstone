package org.pupille.backend.mysql.survey.auswahloption;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.pupille.backend.mysql.survey.umfrage.Umfrage;

@Entity
@Table(name = "auswahloption")
@Data
@NoArgsConstructor
public class Auswahloption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long onr;

    // ############################################
    @ManyToOne(fetch = FetchType.LAZY)
    // FetchType.LAZY is used for the parent reference. This prevents loading the entire Umfrage object every time you load a single option, which improves performance.
    @JoinColumn(name = "unr", nullable = false) // Maps to the foreign key column 'unr'
    @JsonBackReference("Umfrage-Auwahloption-Ref") // Matches the name in Umfrage
    private Umfrage umfrage;
    // ############################################

    private String titel;

    @Column(columnDefinition = "TEXT")
    private String details;
}