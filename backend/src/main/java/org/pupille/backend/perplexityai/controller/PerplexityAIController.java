package org.pupille.backend.perplexityai.controller;

import lombok.RequiredArgsConstructor;
import org.pupille.backend.perplexityai.model.FilmApiResponseDTO;
import org.pupille.backend.perplexityai.service.OpenAIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perplexityai")
@RequiredArgsConstructor
public class PerplexityAIController {

    private final OpenAIService aiService;

    @PostMapping("/emojify")
    public String emojiText(
            // meaning of @RequestBody => JSON Body
            @RequestBody(required = true) String text) {

        String prompt = "We are a cinema and we want to spice up our social postings. " +
                        "Add suitable, creative emojis to the following text, don't change the text (though correcting spelling errors is allowed). " +
                        "Ignore existing HTML tags " +
                        "and add only emojis to the text nodes (no markdown formatting): ";

        return aiService.generateAIAnswerWhenPrompting("sonar", 1.0,prompt + text);
    }

    @PostMapping("/film-text")
    public String createFilmText(
                    @RequestParam("titel") String title,
                    @RequestParam("originalTitel") String originalTitle,
                    @RequestParam("jahr") String year) {

        String prompt = "We are a cinema and we want a description text for a film in German! " +
                "The text should consist of max 750 chars (with spaces), does not contain major spoilers, describe the plot (in medias res style). Write also 1 sentence why the film is worth watching. " +
                "Avoid simple sentences like 'The [title]...' or 'The film...' when praising the film. Do it eloquent. " +
                "Don't include markup formatting and don't insert citation numbers. " +
                "The film is: " + title;

        if (!originalTitle.isEmpty() && !year.isEmpty()) {
            prompt = prompt + " (" + originalTitle + ") from year " + year;
        } else if (!originalTitle.isEmpty()) {
            prompt = prompt + " (" + originalTitle + ")";
        }

        return aiService.generateAIAnswerWhenPrompting("sonar-pro", 0.5, prompt);
    }

    // ------------------------------
    public record FilmApiRequestDTO(String titel, String regie) {}

    @PostMapping("/film-data-fetch")
    public FilmApiResponseDTO getFilmApiData(@RequestBody FilmApiRequestDTO request) {
        return aiService.generateFilmApiData(
                request.titel(),
                request.regie()
        );
    }

}
