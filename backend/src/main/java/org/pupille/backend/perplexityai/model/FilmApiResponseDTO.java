package org.pupille.backend.perplexityai.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true) // tells the JSON deserializer to ignore any extra fields in the JSON response that aren't defined in this DTO
                                            // External APIs (especially LLMs) are unpredictable, so it's safer to be explicitly lenient on this specific class.
public record FilmApiResponseDTO(
        String originaltitel,
        String land,
        Integer jahr,
        String farbe,
        Integer laufzeit,
        String screenwriter,
        String editor,
        String cinematographer,
        String composer,
        String cast,
        String distributor
) {
}
