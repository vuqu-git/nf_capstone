package org.pupille.backend.mysql.survey;

import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionDTO;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionNestedDTO;
import org.pupille.backend.mysql.survey.stimmabgabe.Stimmabgabe;
import org.pupille.backend.mysql.survey.stimmabgabe.StimmabgabeByUmfrageDTO;
import org.pupille.backend.mysql.survey.stimmabgabe.StimmabgabeDTO;
import org.pupille.backend.mysql.survey.umfrage.Umfrage;
import org.pupille.backend.mysql.survey.umfrage.UmfrageDTO;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Comparator;
import java.util.stream.Collectors;

@Component
public class SurveyMapper {

    // ========================================================================
    // UMFRAGE MAPPERS
    // ========================================================================
    public UmfrageDTO toUmfrageDto(Umfrage entity) {
        if (entity == null) return null;
        UmfrageDTO dto = new UmfrageDTO();
        dto.setUnr(entity.getUnr());
        dto.setAnlass(entity.getAnlass());
        dto.setEndDatum(entity.getEndDatum());
        dto.setBeschreibung(entity.getBeschreibung());

        if (entity.getAuswahloptionen() != null) {
            dto.setAuswahloptionendtos(entity.getAuswahloptionen().stream()
                    //.sorted(Comparator.comparing(Auswahloption::getTitel, String.CASE_INSENSITIVE_ORDER)) // not required anymore because of @OrderBy("titel ASC") in Umfrage entity class
                    .map(this::toAuswahloptionNestedDto) // Recursively map children, this is the toAuswahloptionNestedDto method below (applied on an Auswahloption object)
                    .collect(Collectors.toList()));
        } else {
            dto.setAuswahloptionendtos(Collections.emptyList());
        }
        return dto;
    }

    public Umfrage toUmfrageEntity(UmfrageDTO dto) {
        if (dto == null) return null;
        Umfrage entity = new Umfrage();
        entity.setUnr(dto.getUnr());
        entity.setAnlass(dto.getAnlass());
        entity.setEndDatum(dto.getEndDatum());
        entity.setBeschreibung(dto.getBeschreibung());
        // Note: Mapping list back to entity usually requires more logic
        // (handling orphans), so we often skip setting list here for creation.
        // → children handled in service if needed → see createUmfrage and updateUmfrage method in UmfrageService
        return entity;
    }

    // ========================================================================
    // AUSWAHLOPTION MAPPERS (Entity -> DTO)
    // ========================================================================

    /**
     * Standard DTO (with unr)
     * Used for standalone endpoints: /api/survey/auswahloptionen/{id}
     */
    public AuswahloptionDTO toAuswahloptionDto(Auswahloption entity) {
        if (entity == null) return null;
        AuswahloptionDTO dto = new AuswahloptionDTO();
        dto.setOnr(entity.getOnr());
        dto.setTitel(entity.getTitel());
        dto.setDetails(entity.getDetails());
        dto.setLink(entity.getLink());

        // Extract ID from parent if exists
        if (entity.getUmfrage() != null) {
            dto.setUnr(entity.getUmfrage().getUnr());
        }
        return dto;
    }

    /**
     * Nested DTO (NO unr)
     * Used inside UmfrageDTO response: /api/survey/umfragen/{id}
     */
    public AuswahloptionNestedDTO toAuswahloptionNestedDto(Auswahloption entity) {
        if (entity == null) return null;
        AuswahloptionNestedDTO dto = new AuswahloptionNestedDTO();
        dto.setOnr(entity.getOnr());
        // No 'unr' field here at all -> JSON output stays clean, cleaner nested view
        dto.setTitel(entity.getTitel());
        dto.setDetails(entity.getDetails());
        dto.setLink(entity.getLink());

        return dto;
    }

    // ========================================================================
    // AUSWAHLOPTION MAPPERS (DTO -> Entity)
    // ========================================================================
    /**
     * Overload #1: Input from Standard DTO (with unr); used in AuswahloptionService
     */
    public Auswahloption toAuswahloptionEntity(AuswahloptionDTO dto) {
        if (dto == null) return null;
        Auswahloption entity = new Auswahloption();
        entity.setOnr(dto.getOnr());
        entity.setTitel(dto.getTitel());
        entity.setDetails(dto.getDetails());
        entity.setLink(dto.getLink());
        // Parent 'Umfrage' must be set by the Service using the ID (dto.getUnr())
        // → see createAuswahloption method in AuswahloptionService
        return entity;
    }

    // Helper needed for createUmfrage loop if you use NestedDTO there?
    // Usually createUmfrage loop uses standard AuswahloptionDTO for input.
    // If your UmfrageDTO contains NestedDTOs, you need an entity mapper for that too:

    /**
     * Overload #2: Input from Nested DTO (NO unr); used in UmfrageService
     */
    public Auswahloption toAuswahloptionEntity(AuswahloptionNestedDTO dto) {
        if (dto == null) return null;
        Auswahloption entity = new Auswahloption();
        entity.setOnr(dto.getOnr());
        entity.setTitel(dto.getTitel());
        entity.setDetails(dto.getDetails());
        entity.setLink(dto.getLink());
        // Parent set in service logic (.setUmfrage(parent))
        return entity;
    }

    // ========================================================================
    // STIMMABGABE MAPPERS
    // ========================================================================
    public StimmabgabeDTO toStimmabgabeDto(Stimmabgabe entity) {
        if (entity == null) {
            return null;
        }

        StimmabgabeDTO.StimmabgabeDTOBuilder dto = StimmabgabeDTO.builder()
                .snr(entity.getSnr())
                .datum(entity.getDatum())
                .isSessionDuplicate(entity.getIsSessionDuplicate())
                .isUserDuplicate(entity.getIsUserDuplicate());

        // Flatten: Auswahloption
        if (entity.getAuswahloption() != null) {
            dto.onr(entity.getAuswahloption().getOnr());
            dto.auswahloptionTitel(entity.getAuswahloption().getTitel());
            dto.auswahloptionDetails(entity.getAuswahloption().getDetails());
        }

        // Flatten: Umfrage
        if (entity.getUmfrage() != null) {
            dto.unr(entity.getUmfrage().getUnr());
            dto.umfrageAnlass(entity.getUmfrage().getAnlass());
        }

        return dto.build();
    }

    public StimmabgabeByUmfrageDTO toStimmabgabeByUmfrageDto(Stimmabgabe entity) {
        if (entity == null) return null;

        StimmabgabeByUmfrageDTO.StimmabgabeByUmfrageDTOBuilder dto = StimmabgabeByUmfrageDTO.builder()
                .snr(entity.getSnr())
                .datum(entity.getDatum())
                .isSessionDuplicate(entity.getIsSessionDuplicate())
                .isUserDuplicate(entity.getIsUserDuplicate());

        // Flatten: Auswahloption
        if (entity.getAuswahloption() != null) {
            dto.onr(entity.getAuswahloption().getOnr());
            dto.auswahloptionTitel(entity.getAuswahloption().getTitel());
            dto.auswahloptionDetails(entity.getAuswahloption().getDetails());
            dto.auswahloptionLink(entity.getAuswahloption().getLink());
        }

        // Flatten: Umfrage (NO unr field)
        if (entity.getUmfrage() != null) {
            dto.umfrageAnlass(entity.getUmfrage().getAnlass());
        }

        return dto.build();
    }

    public Stimmabgabe toStimmabgabeEntity(StimmabgabeDTO dto) {
        if (dto == null) {
            return null;
        }

        Stimmabgabe entity = new Stimmabgabe();
        entity.setSnr(dto.getSnr());
        entity.setDatum(dto.getDatum());
        entity.setIsSessionDuplicate(dto.getIsSessionDuplicate());
        entity.setIsUserDuplicate(dto.getIsUserDuplicate());

        // Reconstruct Shell: Auswahloption
        if (dto.getOnr() != null) {
            Auswahloption option = new Auswahloption();
            option.setOnr(dto.getOnr());
            entity.setAuswahloption(option);
        }

        // Reconstruct Shell: Umfrage
        if (dto.getUnr() != null) {
            Umfrage umfrage = new Umfrage();
            umfrage.setUnr(dto.getUnr());
            entity.setUmfrage(umfrage);
        }

        return entity;
    }

}

// Where is the mapper applied?
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// You need to inject SurveyMapper into your Service classes (UmfrageService and AuswahloptionService).
// This allows your Services to handle the translation logic, keeping your Controllers clean and ensuring that your Transactions (JPA sessions) are still open when you convert Entities (preventing Lazy Loading errors).


// What is better? Using the wrapper in the service and controller?
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// It is better to use the DTOs directly in the Service layer (and inject the Mapper there), rather than doing the conversion in the Controller.
// Here is the breakdown of why this approach (the "Service Layer Pattern") is the industry standard for Spring Boot applications.

// The Recommended Architecture
// Controller (DTO) <=> Service (DTO => Entity => DTO) <=> Repository (Entity)

    //          1. Controller (DTO)
    //          Receives: HTTP requests with JSON data → deserializes to DTO objects
    //          Sends: DTO objects back → serializes to JSON responses
    //          Role: HTTP handling only. No business logic, no database access.
    //          The Controller is "dumb"—it just passes the request payload to the Service.
    //
    //          2. Service (DTO → Entity → DTO)
    //          Input: Receives DTO from Controller
    //          Converts: DTO → Entity (using mapper)
    //          Business Logic: Validation, relationships, transactions
    //
    //          Database: Calls Repository with Entity
    //          Converts back: Entity → DTO (using mapper)
    //          Output: Returns DTO to Controller
    //
    //          3. Repository (Entity)
    //          Only: Deals with JPA Entity objects
    //          Only: Database CRUD operations
    //          No: Business logic, no DTOs, no HTTP

// 1. It prevents LazyInitializationException
// This is the most critical technical reason.
//    The Problem: JPA Entities often have lazy-loaded fields (like your auswahloptionen list in Umfrage). These fields can only be accessed while the Database Transaction is open.
//    If you map in the Controller: The Transaction closes as soon as the Service returns the Entity. When the Controller tries to map Entity -> DTO, it touches the lazy list, finds no active session, and crashes the application.
//    If you map in the Service: The mapping happens inside the @Transactional method. All data is fetched safely before the connection closes, and the Controller receives a fully populated DTO.
// 2. It Decouples your API from your Database
//    The Problem: If you pass Entities into your Service, your Controller is tightly coupled to your Database schema.
//    The Benefit: By taking DTOs in the Service, your Service defines a "Business Contract." You can change your database tables entirely (renaming unr to id internally) without changing a single line of code in your Controller or breaking the frontend API.
//
// 3. It Centralizes Business Logic
//    Often, a DTO contains data that needs validation before it becomes an Entity.
//    Example: If a user sends a DTO with password and confirmPassword, the Service should validate they match before creating a User entity. If the Controller does the conversion, the Service loses context on the original request data.


// Why DTOs are superior here
// ~~~~~~~~~~~~~~~~~~~~~~~~~~
// Decoupling Database from API:
//  If you rename endDatum to closingDate in Java to match a new DB schema, your frontend breaks immediately if you use Entities. DTOs act as a contract buffer.

// Solving the "Input" Problem:
//  In the previous Controller code, creating an Auswahloption required passing ?unr=... as a URL parameter because the Entity expects a full Umfrage object, not an ID. With a DTO, your JSON payload can simply look like:
//  json
//  { "unr": 1, "titel": "Option A", "details": "..." }

// Preventing LazyInitializationException:
//  If you access a Lazy-loaded field (like a relationship) in the Controller/View layer (after the Transaction is closed), the app throws an exception. DTOs force you to map the data inside the Service (where the Transaction is open), guaranteeing safe data access.

// How about defining conversion constructors in the DTO class and using these methods in the service?
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// The Problem: The "Write" Direction (DTO -> Entity)
// The main issue arises when converting a AuswahloptionDTO back to an Auswahloption entity.
//    The DTO is "blind": The DTO only knows the ID (unr: 5). It does not have access to the UmfrageRepository.
//    Dependency Injection Impossible: You cannot inject a Repository into a DTO (because you create DTOs with new).
//    Service Logic Leak: To make this work, your DTO method would need to accept the Parent Entity as an argument.

// This forces your Service to do the heavy lifting anyway:
//    java
//    // Inside Service
//    Umfrage parent = repo.findById(dto.getUnr());
//    // You still have to pass 'parent' into the DTO method
//    Auswahloption entity = dto.toEntity(parent);

// If the Service is already doing the lookup, the DTO isn't really encapsulating the conversion logic fully.

// The Trade-off

//| Feature          | Separate Mapper (Recommended)                     | DTO Internal Methods                                   |
//| ---------------- | ------------------------------------------------- | ------------------------------------------------------ |
//| Code Cleanliness | Keeps DTOs as "dumb" data carriers (Pure POJOs).  | DTOs become cluttered with logic.                      |
//| Coupling         | Decoupled. DTO doesn't know about Entity.         | High Coupling. DTO imports Entity class.               |
//| Refactoring      | Safe. Changing Entity doesn't break DTO contract. | Risky. Changing Entity breaks DTO compilation.         |
//| Circular Deps    | Minimal.                                          | High. If you move DTOs to a shared library, it breaks. |

// Implementation (If you choose this route)
// If you prefer this for simplicity (less files), here is how to implement it correctly.
// AuswahloptionDTO (The Tricky Part)
// Here you must change the signature of toEntity to accept the parent, because the DTO can't find it itself.
    //@Data
    //@NoArgsConstructor
    //public class AuswahloptionDTO {
    //    private Long onr;
    //    private Long unr;
    //    private String titel;
    //    private String details;
    //
    //    // Constructor: Entity -> DTO
    //    public AuswahloptionDTO(Auswahloption entity) {
    //        this.onr = entity.getOnr();
    //        this.titel = entity.getTitel();
    //        this.details = entity.getDetails();
    //        if (entity.getUmfrage() != null) {
    //            this.unr = entity.getUmfrage().getUnr();
    //        }
    //    }
    //
    //    // Method: DTO -> Entity
    //    // YOU MUST PASS THE PARENT ENTITY HERE
    //    public Auswahloption toEntity(Umfrage parent) {
    //        Auswahloption entity = new Auswahloption();
    //        entity.setOnr(this.onr);
    //        entity.setTitel(this.titel);
    //        entity.setDetails(this.details);
    //        entity.setUmfrage(parent); // Set the relationship
    //        return entity;
    //    }
    //}

// Summary
// For Entity -> DTO (GET requests): Using a constructor inside the DTO is fine and very common.
// For DTO -> Entity (POST/PUT requests): It is awkward because of the Parent ID lookup. The Service has to fetch the parent anyway.
