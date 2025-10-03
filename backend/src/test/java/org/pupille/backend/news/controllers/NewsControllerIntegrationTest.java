package org.pupille.backend.news.controllers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.pupille.backend.news.models.News;
import org.pupille.backend.news.repositories.NewsRepo;
import org.pupille.backend.news.services.DateNowService;

import org.pupille.backend.news.services.IdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@Import(org.pupille.backend.TestMailConfig.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
                // this one searches for class with @SpringBootApplication and starts the overall application (launches entire Spring Boot application context)
                // => creates a fully configured application context for your tests, effectively booting up a version of your Spring application within the test environment
                    //Complete Application Context:
                            //Loads your entire Spring application context
                            //Creates all beans, services, repositories, and controllers
                            //Configures all auto-configurations that would run in your real application
                    //Web Environment Options: like @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
                            //MOCK: (Default) Uses a mock web environment, no real HTTP server
                            //RANDOM_PORT: Starts the actual server on a random port (great for testing REST APIs)
                            //DEFINED_PORT: Starts the server on a defined port
                            //NONE: No web environment
@AutoConfigureMockMvc // This tells Spring Boot to automatically configure and create a MockMvc instance and make it available in the test's ApplicationContext
                      // It's designed to be used in conjunction with @SpringBootTest (which loads the full application context) or @WebMvcTest (which loads a "slice" of the context focused on the web layer).
@ActiveProfiles("test") // Activate Test Profile: application-test.properties file is only loaded when 'test' profile is active
class NewsControllerIntegrationTest {

//    @MockitoBean
//    private JavaMailSender javaMailSender;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    NewsRepo newsTestRepo;

    // ######################################
    // even in integration tests still some things need to be mocked because there are methods containing randomness UUID.randomUUID() (c.f. randomId in NewsService) or the current date LocalDate.now() (cf localDateNow() in NewsService)
    // the following @MockitoBean annotation:
    //      It tells Spring Boot to create a mock instance of DateNowService.
    //      It replaces the real DateNowService bean in the application context with this mock.
    //      It injects this mock into the NewsService where the DateNowService is autowired.
    @MockitoBean
    private DateNowService mockDateNowService; // why IntelliJ says "Private field 'mockDateNowService' is never assigned " => IntelliJ's static analysis is looking for a direct Java assignment statement (like this.mockDateNowService = new DateNowService();), but the assignment is performed dynamically (via @MockitoBean) by the Spring Boot test runner at runtime.
    // usage in a test method: when(dateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 5, 28));
    //      → This line sets the behavior of the mock. When NewsService calls dateNowService.localDateNow(), it will now receive LocalDate.of(2025, 5, 28).
    // example: see test method getValidNews_whenFound_returnNews below

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // not required here, because I use the real IdService, but don't test assert the real generated id in addNewsItem test method
    // @MockitoBean
    // private IdService mockIdService;

            //    Let's break down the difference between @Autowired private IdService idService; and @SpyBean private IdService idService; in your Spring Integration Test scenario.
            //    1. @Autowired private IdService idService; (The Real Deal)
            //    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //    When you use @Autowired private IdService idService; without any mocking annotations, you are telling Spring:
            //            "Please inject the actual IdService bean that is managed by the Spring application context."
            //
            //    Characteristics:
            //    Real Behavior: All methods on idService will execute their actual, production-like implementation.
            //    Production Code Path: You are testing the exact code path that would run in your production environment, including any internal logic, database interactions (if IdService had them), or external calls IdService might make.
            //    No Interference: You cannot change the behavior of idService.generateNewId() in your test. It will always return a new UUID.randomUUID().toString().
            //    Full Integration: This is a true integration test for IdService within the context of MyService.
            //
            //    When to use it:
            //    When IdService is a relatively simple, stable, and fast dependency that you don't need to control or isolate for the specific test case.
            //    When you want to verify that MyService correctly integrates with the real IdService.
            //    When IdService's behavior is deterministic enough (or irrelevant to the specific test outcome) that you don't need to fix its output. (In your IdService example, it's non-deterministic, but often you don't care about the exact UUID, just that a UUID is generated).
            //    This is the default and preferred approach for dependencies you don't intend to mock.

                    //    ==> It's absolutely okay to leave out @Autowired private IdService idService; in your test class.
                    //
                    //    Here's why:
                    //    When you use @SpringBootTest, Spring loads your entire application context, including all your @Service, @Component, @Repository, etc., beans.
                    //
                    //    MyService has IdService as a dependency (via constructor injection).
                    //    Since IdService is itself a Spring @Service, Spring will find its bean and inject it into MyService automatically when it creates the MyService bean for your test context.
                    //
                    //    !!! You only need to @Autowired a bean into your test class itself if you want to directly interact with that bean within your test methods. !!!

            //    2. @SpyBean private IdService idService; (The "Partial" Control)
            //    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //    When you use @SpyBean private IdService idService;, you are telling Spring Boot:
            //            "Create the actual IdService bean as usual."
            //            "But then, wrap this real bean in a Mockito Spy. When methods are called on this spy, by default, they will execute the real implementation. However, I can choose to stub specific methods to return fixed values or throw exceptions."
            //
            //    Characteristics:
            //    Default Real Behavior: If you don't stub a method (e.g., idService.generateNewId()), it will call the original, real implementation.
            //    Selective Stubbing: You can stub methods if you need to. For example, doReturn("fixed-test-id").when(idService).generateNewId(); would make generateNewId() return "fixed-test-id" instead of a random UUID.
            //    Verification: You can still verify that methods were called on the spy (e.g., verify(idService).generateNewId();).
            //    Hybrid Control: You have a blend of real behavior and mocked behavior.
            //
            //    When to use it:
            //    When IdService has some complex or slow methods that you want to avoid executing in your test, but other methods that you do want to execute as real.
            //    When you need to verify that a specific method on IdService was called by MyService, even if you don't care about its return value or want to control its return value for a specific scenario.
            //    When IdService has side effects (e.g., writes to a database, calls an external API) that you want to prevent during your test, but still need the core logic of IdService for other methods. You could then stub the side-effecting method.
            //    When you need to throw an exception from IdService to test error handling in MyService without changing IdService's production code.
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    @BeforeEach
    void repoTabulaRasa() {
        newsTestRepo.deleteAll();
    }

    @Test
    void getAllNews_whenEmpty_returnEmptyList() throws Exception {
        // GIVEN
        // i.e. empty newsTestRepo

        // WHEN
        mockMvc.perform(get("/api/news")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                  []
                """));
    }

    @Test
    // only mark tests as dirty if they modify the Spring context or global/static state, not just for regular data changes
    //      better manual delete with repo's deleteAll() and @BeforeEach
    //@DirtiesContext
    void getAllNews_whenFound_returnNews() throws Exception {
        // GIVEN
        News news1 = new News("1",
                        "Theatre closed!",
                            "",
                                LocalDate.parse("2025-05-01"),
                                LocalDate.parse("2025-05-10"),
                                "light");
        News news2 = new News("2",
                    "Action double feature coming soon!",
                        "",
                            LocalDate.of(2025, 4, 20),
                            LocalDate.of(2025, 5, 15),
                "light");

        newsTestRepo.save(news1);
        newsTestRepo.save(news2);
        // WHEN
        mockMvc.perform(get("/api/news")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [
                    {
                        "id": "1",
                        "text": "Theatre closed!",
                        "image": "",
                        "startDate": "2025-05-01",
                        "endDate": "2025-05-10",
                        "newsVariant": "light"
                    },
                    {
                        "id": "2",
                        "text": "Action double feature coming soon!",
                        "image": "",
                        "startDate": "2025-04-20",
                        "endDate": "2025-05-15",
                        "newsVariant": "light"

                    }
                ]
                """));
    }

    @Test
    //@DirtiesContext
    void getValidNews_whenFound_returnNews() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-15"),
                "light");
        News news2 = new News("2",
                "Action double feature coming soon!",
                "",
                LocalDate.of(2025, 5, 1),
                LocalDate.of(2025, 5, 31),
                "light");

        newsTestRepo.save(news1);
        newsTestRepo.save(news2);

        // !!!!! these 2 lines doesn't work (wrong syntax, cf unit tests for usage of when for mocking):
        // when(mock(NewsRepo.class).findNewsByDateInRange( LocalDate.of(2025, 5, 12) )).thenReturn( List.of(news2) );
        // when(mock(DateNowService.class).localDateNow()).thenReturn(LocalDate.of(2025, 5, 28));
        // Here, you're creating a new mock object inside the when() call with mock(DateNowService.class). This is problematic because:
            // You're creating a new, temporary mock that isn't stored anywhere
            // This new mock isn't the same instance that's injected into your service
            // The mock behavior you're setting up won't affect your actual test

        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 5, 28));

        // WHEN
        mockMvc.perform(get("/api/news/valid")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [
                    {
                        "id": "2",
                        "text": "Action double feature coming soon!",
                        "image": "",
                        "startDate": "2025-05-01",
                        "endDate": "2025-05-31",
                        "newsVariant": "light"

                    }
                ]
                """));
    }

    @Test
    //@DirtiesContext
    void getValidNews_whenNotFound_returnEmpty() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-15"),
                "light");
        News news2 = new News("2",
                "Action double feature coming soon!",
                "",
                LocalDate.of(2025, 5, 1),
                LocalDate.of(2025, 5, 31),
                "light");

        newsTestRepo.save(news1);
        newsTestRepo.save(news2);

        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 28));

        // WHEN
        mockMvc.perform(get("/api/news/valid")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [
                ]
                """));
    }

    @Test
    //@DirtiesContext
    void getNewsItem_whenFound_returnNews() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-10"),
                "light");
        News news2 = new News("2",
                "Action double feature coming soon!",
                "",
                LocalDate.of(2025, 4, 20),
                LocalDate.of(2025, 5, 15),
                "light");

        newsTestRepo.save(news1);
        newsTestRepo.save(news2);
        // WHEN
        mockMvc.perform(get("/api/news/1")
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                
                    {
                        "id": "1",
                        "text": "Theatre closed!",
                        "image": "",
                        "startDate": "2025-05-01",
                        "endDate": "2025-05-10",
                        "newsVariant": "light"
                    }
                
                """));
    }

    @Test
    void getNewsItem_whenNotFound_throwException() throws Exception {
        // GIVEN
        String targetId = "1a2b3c";
        // i.e. empty newsTestRepo

        // WHEN
        mockMvc.perform(get("/api/news/" + targetId)
                        .contentType(MediaType.APPLICATION_JSON))
                // THEN
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No news found with the id " + targetId));
    }


    // from here on for best practice: add additional tests to assert/check if objects in the test repo are really deleted/added/changes

    @Test
    //@DirtiesContext
    void deleteNewsItem_whenFound_removesNews() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-10"),
                "light");
        News news2 = new News("2",
                "Action double feature coming soon!",
                "",
                LocalDate.of(2025, 4, 20),
                LocalDate.of(2025, 5, 15),
                "light");

        newsTestRepo.save(news1);
        newsTestRepo.save(news2);
        // WHEN
        mockMvc.perform(delete("/api/news/" + news1.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))

                // THEN
                .andExpect(status().isOk());

        // testing on the repo
        // ~~~~~~~~~~~~~~~~~~~
        // if changes were really made (persistent)
        Assertions.assertFalse( newsTestRepo.existsById(news1.id()) );

        // no other data was amended
        Assertions.assertTrue( newsTestRepo.existsById(news2.id()) );
        Assertions.assertEquals(1, newsTestRepo.count() );
    }

    @Test
    void deleteNewsItem_whenNotFound_throwException() throws Exception {
        // GIVEN
        String targetId = "1a2b3c";
        // i.e. empty newsTestRepo

        // WHEN
        mockMvc.perform(delete("/api/news/" + targetId)
                        .contentType(MediaType.APPLICATION_JSON)
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))
                // THEN
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No news found with the id " + targetId));

        // testing on the repo
        // ~~~~~~~~~~~~~~~~~~~
        Assertions.assertFalse( newsTestRepo.existsById(targetId) );

        // no other data was amended
        Assertions.assertEquals(0, newsTestRepo.count() );
        // Assertions.assertTrue(newsTestRepo.findAll().isEmpty());
    }

    @Test
//    @DirtiesContext
    void addNewsItem() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-10"),
                "light");

        newsTestRepo.save(news1);
        // WHEN
        mockMvc.perform(post("/api/news")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                """
                                {
                                    "id": null,
                                    "text": "Action double feature coming soon!",
                                    "image": "",
                                    "startDate": "2025-04-20",
                                    "endDate": "2025-05-15",
                                    "newsVariant": "light"
                                }
                                """
                        )
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                
                    {
                        "text": "Action double feature coming soon!",
                        "image": "",
                        "startDate": "2025-04-20",
                        "endDate": "2025-05-15",
                        "newsVariant": "light"
                    }
                
                """))
                .andExpect(jsonPath("$.id").isNotEmpty());

        // testing on the repo
        // ~~~~~~~~~~~~~~~~~~~
        // old data record is still there and unchanged
        News old = newsTestRepo.findById("1").orElseThrow(NoSuchElementException::new);
        Assertions.assertEquals(news1, old);

        Assertions.assertEquals(2, newsTestRepo.count());
    }

    @Test
    //@DirtiesContext
    void updateMovie_whenFound_returnMovie() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-10"),
                "light");

        newsTestRepo.save(news1);
        // WHEN
        mockMvc.perform(put("/api/news/" + news1.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        // the following json needs to have all the fields of a java News object
                        .content(
                                """
                                {
                                    "id": "1",
                                    "text": "Action double feature coming soon!",
                                    "image": "",
                                    "startDate": "2025-04-20",
                                    "endDate": "2025-05-15",
                                    "newsVariant": "light"
                                }
                                """
                        )
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().json("""
                
                    {
                        "id": "1",
                        "text": "Action double feature coming soon!",
                        "image": "",
                        "startDate": "2025-04-20",
                        "endDate": "2025-05-15",
                        "newsVariant": "light"
                    }
                
                """));

        // testing on the repo
        // ~~~~~~~~~~~~~~~~~~~
        Assertions.assertTrue(newsTestRepo.existsById("1"));

        News updated = newsTestRepo.findById("1").orElseThrow(NoSuchElementException::new);
        Assertions.assertEquals("Action double feature coming soon!", updated.text());
        Assertions.assertEquals(LocalDate.parse("2025-04-20"), updated.startDate());
        Assertions.assertEquals(LocalDate.parse("2025-05-15"), updated.endDate());
    }

    @Test
    void updateMovie_whenNotFound_throwNewsNotFoundException() throws Exception {
        // GIVEN
        String targetId = "1";
        // newsTestRepo is empty

        // WHEN
        mockMvc.perform(put("/api/news/" + targetId)
                        .contentType(MediaType.APPLICATION_JSON)
                        // the following json needs to have all the fields of a java News object
                        .content(
                                """
                                {
                                    "id": "1",
                                    "text": "Action double feature coming soon!",
                                    "image": "",
                                    "startDate": "2025-04-20",
                                    "endDate": "2025-05-15",
                                    "newsVariant": "light"
                                }
                                """
                        )
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))
                // THEN
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No news found with the id " + targetId));

        // testing on the repo
        // ~~~~~~~~~~~~~~~~~~~
        Assertions.assertTrue(newsTestRepo.findAll().isEmpty());
    }

    @Test
    void updateMovie_whenFound_throwNewsUpdateException() throws Exception {
        // GIVEN
        News news1 = new News("1",
                "Theatre closed!",
                "",
                LocalDate.parse("2025-05-01"),
                LocalDate.parse("2025-05-10"),
                "light");

        newsTestRepo.save(news1);

        // WHEN
        mockMvc.perform(put("/api/news/" + news1.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        // the following json needs to have all the fields of a java News object
                        .content(
                                """
                                {
                                    "id": "1111111",
                                    "text": "Action double feature coming soon!",
                                    "image": "",
                                    "startDate": "2025-04-20",
                                    "endDate": "2025-05-15",
                                    "newsVariant": "light"
                                }
                                """
                        )
                        // this line for fetching github username
                        .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                        .with(csrf()))
                // THEN
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ID in path and body do not match"));
    }
}