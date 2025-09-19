package org.pupille.backend.mysql.termin;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;

//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@Import(org.pupille.backend.TestMailConfig.class)
@SpringBootTest
@ActiveProfiles("test") // Use "test" profile to load application-test.properties
@AutoConfigureMockMvc
@Transactional // After the test method finishes (whether it passes or fails), Spring's test framework, by default, will rollback the transaction.
               // This means all changes made during that test method are effectively undone. The database returns to the state it was in before the test method started.
               // This is the opposite of how @Transactional typically behaves in a production application, where it would commit the transaction on success. For tests, the default is rollback for isolation.
class TerminControllerIntegrationTest {

//    @MockitoBean
//    private JavaMailSender javaMailSender;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // those both lines mean: performing CRUD operations on the TerminRepository as H2 in-memory relational DB
    @Autowired
    private TerminRepository terminRepository;

    @BeforeEach
    void setUp() {
        terminRepository.deleteAll();  // Clean the Termin table before each test
    }

    // !!!!!!!!!! this one is a unit test !!!!!!!!!!
    @Test
    void unitTestCreateAndRetrieveTermin() {
        // Arrange: Create a new Termin entity
        Termin termin = new Termin();
        termin.setVorstellungsbeginn(LocalDateTime.now());
        termin.setTitel("Test Title");
        termin.setText("Test Text");

        // Act: Save and retrieve it from the repository
        terminRepository.save(termin);
        List<Termin> allTermine = terminRepository.findAll();

        // Assert: Verify the results
        assertThat(allTermine).hasSize(1);
        assertThat(allTermine.get(0).getTitel()).isEqualTo("Test Title");
    }

    // Integration test for creating a new Termin and get it
    @Test
    void testCreateAndGetTermin() throws Exception {
        Termin termin = new Termin();
        termin.setVorstellungsbeginn(LocalDateTime.now());
        termin.setTitel("Test Termin");
        termin.setText("Test Text");
        termin.setKurztext("Short Test Text");
        termin.setBesonderheit("Special Test");
        termin.setStartReservierung(LocalDate.now());
        termin.setLinkReservierung("http://test.com");
        termin.setSonderfarbeTitel(1);
        termin.setSonderfarbe("pupille-glow");
        termin.setVeroeffentlichen((short) 1);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/termine")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(termin))
                            // ObjectMapper: This is a core class from the Jackson library, which Spring Boot uses by default for JSON serialization and deserialization.
                            // writeValueAsString(Object value): This method takes a Java object (termin in this case) and serializes it into a JSON string.
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username"))))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.tnr").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.titel").value("Test Termin"))
                .andReturn().getResponse().getContentAsString();

        // Get the id of the created object.
        Termin createdTermin = terminRepository.findAll().get(0);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/termine/" + createdTermin.getTnr()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.titel").value("Test Termin"));
    }

    // Integration test for updating an existing Termin
    @Test
    void testUpdateTermin() throws Exception {
        // Create and save an initial Termin
        Termin termin = new Termin();
        termin.setVorstellungsbeginn(LocalDateTime.now());
        termin.setTitel("Old Title");
        termin.setText("Old Text");
        termin = terminRepository.save(termin);

        // Modify some fields for update
        Termin updatedTermin = new Termin();
        updatedTermin.setVorstellungsbeginn(LocalDateTime.now().plusDays(1));
        updatedTermin.setTitel("Updated Title");
        updatedTermin.setText("Updated Text");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/termine/" + termin.getTnr())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTermin))
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.titel").value("Updated Title"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.text").value("Updated Text"));
    }

    // Integration test for deleting a Termin
    @Test
    void testDeleteTermin() throws Exception {
        // Create and save a Termin to delete
        Termin termin = new Termin();
        termin.setVorstellungsbeginn(LocalDateTime.now());
        termin.setTitel("To be deleted");
        termin = terminRepository.save(termin);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/termine/" + termin.getTnr())
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username"))))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        // Verify deletion from repository
        assertThat(terminRepository.findById(termin.getTnr())).isEmpty();
    }

    // Integration test for getTerminById with non-existing ID (expect 404)
    @Test
    void testGetTerminById_NotFound() throws Exception {
        long nonExistingId = 9999L;

        mockMvc.perform(MockMvcRequestBuilders.get("/api/termine/" + nonExistingId)
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    // Integration test for updateTermin with non-existing ID (expect 404)
    @Test
    void testUpdateTermin_NotFound() throws Exception {
        long nonExistingId = 9999L;
        Termin termin = new Termin();
        termin.setVorstellungsbeginn(LocalDateTime.now());
        termin.setTitel("Non-existing");

        mockMvc.perform(MockMvcRequestBuilders.put("/api/termine/" + nonExistingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(termin))
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

}
