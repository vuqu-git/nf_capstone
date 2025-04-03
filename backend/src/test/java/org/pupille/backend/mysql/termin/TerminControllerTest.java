package org.pupille.backend.mysql.termin;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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

//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@SpringBootTest
@ActiveProfiles("test") // Use "test" profile to load application-test.properties
@AutoConfigureMockMvc
@Transactional
class TerminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TerminRepository terminRepository;

//    @AfterEach
//    void cleanUp() {
//        terminRepository.deleteAll();
//    }

    @Test
    void testCreateAndRetrieveTermin() {
        // Arrange: Create a new Termin entity
        Termin termin = new Termin();
        termin.setTitel("Test Title");
        termin.setText("Test Text");

        // Act: Save and retrieve it from the repository
        terminRepository.save(termin);
        List<Termin> allTermine = terminRepository.findAll();

        // Assert: Verify the results
        assertThat(allTermine).hasSize(1);
        assertThat(allTermine.get(0).getTitel()).isEqualTo("Test Title");
    }

    @Test
    void testCreateAndGetTermin() throws Exception {
        Termin termin = new Termin();
        termin.setTermin(LocalDateTime.now());
        termin.setTitel("Test Termin");
        termin.setText("Test Text");
        termin.setKurztext("Short Test Text");
        termin.setBesonderheit("Special Test");
        termin.setStartReservierung(LocalDate.now());
        termin.setLinkReservierung("http://test.com");
        termin.setSonderfarbeTitel(1);
        termin.setSonderfarbe(2);
        termin.setVeroeffentlichen((short) 1);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/termine")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(termin)))
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

    // Add more tests for updateTermin, deleteTermin, etc.

}

