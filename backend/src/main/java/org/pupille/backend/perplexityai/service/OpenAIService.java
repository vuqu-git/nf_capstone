package org.pupille.backend.perplexityai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.pupille.backend.perplexityai.model.FilmApiResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import org.pupille.backend.perplexityai.model.OpenAIRequest;
import org.pupille.backend.perplexityai.model.OpenAIResponse;

@Service
public class OpenAIService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAIService(@Value("${PERPLEXITY_API_KEY}") String key,
                         RestClient.Builder restClient,
                         ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("PERPLEXITY_API_KEY must be configured");
        }

        this.restClient = restClient
                .baseUrl("https://api.perplexity.ai/chat/completions")
                .defaultHeader("Authorization", "Bearer " + key)
                .build();
    }

    // ##################################
    // helper
    public String getContentFromOpenAIResponse(OpenAIResponse oaiResponse) {
        if (oaiResponse != null && oaiResponse.choices() != null && !oaiResponse.choices().isEmpty()) {
            return oaiResponse.choices().get(0).message().content();
        }
        return "";
    }
    // ##################################

    // this helper method is called for the endpoints /emojify and
    public String generateAIAnswerWhenPrompting(String modelName, double temp, String input) {
        OpenAIResponse response = restClient.post()
                .body(new OpenAIRequest(modelName, input, temp))
                .retrieve()
                .body(OpenAIResponse.class);
        return getContentFromOpenAIResponse(response);
    }

    // ----------------------------------------------------------------------
    public FilmApiResponseDTO generateFilmApiData(String title, String regie) {
        // Prompt creation
        String prompt = """
                       We are a German cinema. Provide data for the film "%s" directed by "%s".
                       
                       Return ONLY a valid JSON object. Do not include any markdown formatting, text, or explanations outside the JSON.
                       
                       Use exactly these keys and rules:
                       - "originaltitel": Original title from production country. E.g. For "Flow" it's "Straume", for "Hexenkessel" it's "Mean streets".
                       - "land": Country codes in ISO 3166-1 alpha-3. If multiple, separate with "/".
                       - "jahr": Year of production (Integer).
                       - "farbe": "Farbe" or "schwarz-weiß" or both or something else.
                       - "laufzeit": Length in minutes (Integer).
                       - "screenwriter": Name(s) of screenwriters.
                       - "editor": Name(s) of editors.
                       - "cinematographer": Name(s) of cinematographers.
                       - "composer": Name(s) of composers.
                       - "cast": 3-5 Main actors (comma separated string!).
                       - "distributor": Name of the distributor for the cinema release specifically in GERMANY.
                       
                       If a specific field is unknown, use null.
                       """.formatted(title, regie);

        // API call with low temp for factual JSON
        OpenAIResponse response = restClient.post()
                .body(new OpenAIRequest("sonar-pro", prompt, 0.0))
                .retrieve()
                .body(OpenAIResponse.class);

        String jsonContent = getContentFromOpenAIResponse(response);

               // parsing: bridges the gap between the AI's text output and Java code
        return parseJsonToDTO(jsonContent);
    }

            // parser
            private FilmApiResponseDTO parseJsonToDTO(String jsonContent) {
                try {
                                       // cleaner: cleanJsonString: defensive programming helper.
                                       // Even when asked for "ONLY JSON," LLMs often wrap their code in Markdown code blocks for display purposes → This method detects those Markdown "fences" (```json or ```) and strips them away.
                    String cleanJson = cleanJsonString(jsonContent);
                                     // parser: readValue inspects the JSON string and automatically fills the fields of FilmApiResponseDTO record
                    return objectMapper.readValue(cleanJson, FilmApiResponseDTO.class);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse AI response to FilmApiResponseDTO. Raw response: " + jsonContent, e);
                }
            }

            // helper method for parser
            private String cleanJsonString(String input) {
                if (input == null) return "{}";
                String cleaned = input.trim();
                // Handle markdown code blocks often returned by LLMs
                if (cleaned.startsWith("```json")) {
                    cleaned = cleaned.substring(7);
                } else if (cleaned.startsWith("```")) {
                    cleaned = cleaned.substring(3);
                }
                if (cleaned.endsWith("```")) {
                    cleaned = cleaned.substring(0, cleaned.length() - 3);
                }
                return cleaned.trim();
            }
    // ----------------------------------------------------------------------

}