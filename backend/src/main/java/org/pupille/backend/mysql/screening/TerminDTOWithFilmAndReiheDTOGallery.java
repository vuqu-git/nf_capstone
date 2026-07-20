package org.pupille.backend.mysql.screening;

import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.reihe.Reihe;
import org.pupille.backend.mysql.reihe.ReiheDTOGallery;
import org.pupille.backend.mysql.termin.Termin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record TerminDTOWithFilmAndReiheDTOGallery(
        Long tnr,
        LocalDateTime vorstellungsbeginn,
        String titel,
        String kurztext,
        String besonderheit,
        String bild,
        String offsetImageInGallery,
        String sonderfarbe,
        Boolean finalVeroeffentlichen,
        Boolean isCanceled,
        List<FilmDTOGallery> mainfilms,
        Set<ReiheDTOGallery> reihen
) {
    // 1. Compact Canonical Constructor
    public TerminDTOWithFilmAndReiheDTOGallery {
        // Enforce the business rule: if mainfilms is empty, override the status to 0
        if (mainfilms == null || mainfilms.isEmpty()) {
            finalVeroeffentlichen = false;
        }
    }

    // 2. Secondary convenience constructor taking the Entity objects directly
    public TerminDTOWithFilmAndReiheDTOGallery(Termin termin, List<Film> mainfilms, Set<Reihe> reihen) {
        this(
                termin.getTnr(),
                termin.getVorstellungsbeginn(),
                termin.getTitel(),
                termin.getKurztext(),
                termin.getBesonderheit(),
                termin.getBild(),
                termin.getOffsetImageInGallery(),
                termin.getSonderfarbe(),
                termin.getVeroeffentlichen() != null && termin.getVeroeffentlichen() != 0,
                termin.getIsCanceled(),
                mainfilms.stream().map(FilmDTOGallery::new).toList(),
                reihen.stream().map(ReiheDTOGallery::new).collect(Collectors.toSet())
        );
    }
}

// What happens when
//  new TerminDTOWithFilmAndReiheDTOGallery(
//        fTermin,
//        mainfilms,
//        fTermin.getReihen()
//  );
// is called in the ScreeningService's method getAllFutureTermineWithFilms???

//When you execute that line of code, it triggers a seamless, two-step chain reaction.
//Because Java Records are designed to be strictly immutable, the data has to be completely prepped and validated before the object is finalized.
//Here is exactly how the data flows from your service layer into the final, locked Record.

// -- 1. The Secondary Convenience Constructor is Called
//Java looks at the three arguments you passed (Termin, List<Film>, Set<Reihe>) and routes the call to your secondary constructor.
//This constructor acts as an unpacker. It does not assign any fields directly. Instead, it:
//Extracts the raw primitives (like termin.getVeroeffentlichen()).
//Converts the nested lists into their DTO equivalents (FilmDTOGallery, ReiheDTOGallery) using Streams.
//Takes all 12 of these newly prepped pieces of data and passes them to the master constructor using this(...).

// -- 2. The Data Hits the Canonical Constructor
//Every record has a "canonical" constructor—the master constructor that accepts exactly the parameters defined in the record's header. The this(...) call from step 1 routes all 12 arguments here.
//However, because you wrote a Compact Constructor, Java does not immediately assign these arguments to the object's fields.

// -- 3. The Compact Constructor Intercepts
//Before the object is actually built, Java pauses and runs the code block you defined in the compact constructor:
//public TerminDTOWithFilmAndReiheDTOGallery {
//    if (mainfilms == null || mainfilms.isEmpty()) {
//        finalVeroeffentlichen = (short) 0;
//    }
//}

//Think of this block as an interception point. The variables you are interacting with here (mainfilms, finalVeroeffentlichen) are not the final object fields yet—they are just the parameters handed over from the secondary constructor.
//If the mainfilms list is empty, the compact constructor overwrites the finalVeroeffentlichen parameter (which currently holds the raw database value) and changes it to 0.

// -- 4. Java Finalizes the Object (The Hidden Step)
//Once the compact constructor block finishes executing, Java's compiler takes over and automatically executes the standard boilerplate assignments behind the scenes. It is as if Java implicitly writes this for you:
//this.tnr = tnr;
//this.vorstellungsbeginn = vorstellungsbeginn;
// ...
//this.finalVeroeffentlichen = finalVeroeffentlichen; // Assigns the 0 if the interception triggered!
//this.mainfilms = mainfilms;
// ...

//At this exact moment, the object is instantiated, all fields are locked down permanently (making the Record immutable), and the fully sanitized DTO is returned back to the service stream.

// -- 5. Conclusion o summary
//The code inside a Compact Constructor is guaranteed to run every single time an instance of that record is created.

//There is zero way to instantiate a Java Record without passing through its Canonical (Compact) Constructor.

//Why Java Guarantees This
//Java enforces strict language rules for Records to ensure immutability and data safety:
//Every secondary constructor MUST call this(...): In a Java Record, any custom or secondary constructor you write is forced by the compiler to delegate to the canonical constructor as its very first action.
//The Compact Constructor IS the Canonical Constructor: The compact constructor is simply a shorthand syntax for defining the canonical constructor.

//Because of this strict delegation rule, all creation paths lead to the compact constructor.