package org.pupille.backend.mysql.termin;

import jakarta.persistence.*;
//import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "termin") // Explicitly map to the database table "film"
@Data // Lombok annotation to generate getters, setters, equals, hashCode, and toString
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
public class Termin {

    @Id
//    @Column(name = "tnr", nullable = false) // Map to "tnr" column in the database
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use auto-increment
//    GenerationType.IDENTITY tells JPA to rely on the database's identity column (auto-increment) to generate primary key values.
//    This is specific to databases like MySQL that support auto-increment.
    private Integer tnr; // Primary key

//    @NotNull
    private LocalDateTime termin; // datetime

//    @NotBlank // Ensure non-null and non-empty
    private String titel;

    private String text;

    private String kurztext;

    private String besonderheit;

    @Column(name = "start_reservierung")
    private LocalDate startReservierung; // date

    private String linkReservierung;

    @Column(name = "sonderfarbe_titel")
    private Integer sonderfarbeTitel;

    private Integer sonderfarbe;

    private Short veroeffentlichen;
}
