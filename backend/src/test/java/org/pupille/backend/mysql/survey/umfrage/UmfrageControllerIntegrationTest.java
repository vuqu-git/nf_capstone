package org.pupille.backend.mysql.survey.umfrage;

import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionNestedDTO;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // Loads settings from application-test.properties
class UmfrageControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UmfrageRepository umfrageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Clean database before each test to ensure isolation
        umfrageRepository.deleteAll();
    }

    @Nested
    @DisplayName("1. Public Endpoints")
    class PublicEndpoints {

        @Test
        @DisplayName("GET /api/survey/umfragen/{id} - Should return details without auth")
        void shouldGetUmfrageByIdPublic() throws Exception {
            // Arrange
            Umfrage entity = new Umfrage();
            entity.setAnlass("Public Survey");
            entity.setBeschreibung("Description");
            entity.setEndDatum(LocalDate.now().plusDays(5));
            entity = umfrageRepository.save(entity);

            // Act & Assert
            mockMvc.perform(get("/api/survey/umfragen/" + entity.getUnr()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.anlass", is("Public Survey")))
                    .andExpect(jsonPath("$.unr", is(entity.getUnr().toString())));
        }

        @Test
        @DisplayName("GET /api/survey/umfragen/{id} - Should return 404 if not found")
        void shouldReturn404ForUnknownId() throws Exception {
            String nonExistentId = UUID.randomUUID().toString();

            mockMvc.perform(get("/api/survey/umfragen/" + nonExistentId))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("2. Protected Endpoints (Auth Required)")
    class ProtectedEndpoints {

        @Nested
        @DisplayName("GET /api/survey/umfragen (List)")
        class ListSurveys {

            @Test
            @DisplayName("Should return 401 Unauthorized if not logged in")
            void shouldReturn401WhenListingWithoutAuth() throws Exception {
                mockMvc.perform(get("/api/survey/umfragen"))
                        .andExpect(status().isUnauthorized());
            }

            @Test
            @WithMockUser(username = "admin")
            @DisplayName("Should list all surveys when logged in")
            void shouldReturnListWhenLoggedIn() throws Exception {
                // Arrange
                Umfrage u1 = new Umfrage();
                u1.setAnlass("Survey 1");
                u1.setEndDatum(LocalDate.now());

                Umfrage u2 = new Umfrage();
                u2.setAnlass("Survey 2");
                u2.setEndDatum(LocalDate.now().plusDays(1));

                umfrageRepository.saveAll(List.of(u1, u2));

                // Act & Assert
                mockMvc.perform(get("/api/survey/umfragen"))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(2)))
                        .andExpect(jsonPath("$[0].anlass", notNullValue()));
            }
        }

        @Nested
        @DisplayName("POST /api/survey/umfragen (Create)")
        class CreateSurvey {

            @Test
            @WithMockUser(username = "admin")
            @DisplayName("Should create new survey (CSRF included)")
            void shouldCreateSurvey() throws Exception {
                // Arrange
                UmfrageDTO dto = new UmfrageDTO();
                dto.setAnlass("New Created Survey");
                dto.setEndDatum(LocalDate.now().plusDays(10));
                dto.setBeschreibung("Test Description");

                AuswahloptionNestedDTO opt = new AuswahloptionNestedDTO();
                opt.setTitel("Option A");
                dto.setAuswahloptionendtos(List.of(opt));

                // Act
                mockMvc.perform(post("/api/survey/umfragen")
                                .with(csrf()) // REQUIRED
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.unr", notNullValue()))
                        .andExpect(jsonPath("$.anlass", is("New Created Survey")))
                        .andExpect(jsonPath("$.auswahloptionendtos", hasSize(1)));

                // Assert DB
                assertThat(umfrageRepository.count()).isEqualTo(1);
            }

            @Test
            @DisplayName("Should fail 403 Forbidden if CSRF is missing")
            @WithMockUser(username = "admin")
            void shouldFailWithoutCsrf() throws Exception {
                UmfrageDTO dto = new UmfrageDTO();
                dto.setAnlass("Hacker Attempt");

                mockMvc.perform(post("/api/survey/umfragen")
                                // .with(csrf()) MISSING
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
                        .andExpect(status().isForbidden());
            }
        }

        @Nested
        @DisplayName("PUT /api/survey/umfragen/{id} (Update)")
        class UpdateSurvey {

            @Test
            @WithMockUser(username = "admin")
            @DisplayName("Should update existing survey")
            void shouldUpdateSurvey() throws Exception {
                // Arrange
                Umfrage u = new Umfrage();
                u.setAnlass("Old Title");
                u = umfrageRepository.save(u);

                UmfrageDTO updateDto = new UmfrageDTO();
                updateDto.setUnr(u.getUnr());
                updateDto.setAnlass("Updated Title");

                // Act
                mockMvc.perform(put("/api/survey/umfragen/" + u.getUnr())
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateDto)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.anlass", is("Updated Title")));

                // Assert DB
                Umfrage updated = umfrageRepository.findById(u.getUnr()).orElseThrow();
                assertThat(updated.getAnlass()).isEqualTo("Updated Title");
            }
        }

        @Nested
        @DisplayName("DELETE /api/survey/umfragen/{id} (Delete)")
        class DeleteSurvey {

            @Test
            @WithMockUser(username = "admin")
            @DisplayName("Should delete survey")
            void shouldDeleteSurvey() throws Exception {
                // Arrange
                Umfrage u = new Umfrage();
                u.setAnlass("Delete Me");
                u = umfrageRepository.save(u);

                // Act
                mockMvc.perform(delete("/api/survey/umfragen/" + u.getUnr())
                                .with(csrf()))
                        .andExpect(status().isOk());

                // Assert
                assertThat(umfrageRepository.existsById(u.getUnr())).isFalse();
            }
        }
    }

}

