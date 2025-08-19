package org.pupille.backend.news.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.pupille.backend.news.exceptions.NewsNotFoundException;
import org.pupille.backend.news.models.News;
import org.pupille.backend.news.repositories.NewsRepo;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// !!! When using @Mock and @InjectMocks => see below the code!!!

class NewsServiceTest {

    private NewsRepo mockNewsRepo;
    private IdService mockIdService;
    private DateNowService mockDateNowService;

    private NewsService newsService;

    private News n1, n2;

    @BeforeEach
    void testSetup() {
        // best practice: Keep mock creation and NewsService initialization inside @BeforeEach to ensure each test starts with fresh, unmodified mocks.
        //        Advantages:
        //        Fresh test objects for each test - prevents accidental state mutation between tests
        //        More explicit control over when objects are created
        //        Better encapsulation - all test setup happens in one place
        mockNewsRepo = mock(NewsRepo.class);
        mockIdService = mock(IdService.class);
        mockDateNowService = mock(DateNowService.class);

        newsService = new NewsService(mockNewsRepo, mockIdService, mockDateNowService);

        n1 = new News("1",
                "Vorführung X fällt aus",
                null,
                LocalDate.of(2025, 3, 10),
                LocalDate.of(2025, 3, 28),
                "light");

        n2 = new News("2",
                "Geburtstagsfilm",
                null,
                LocalDate.of(2025, 2, 20),
                LocalDate.of(2025, 3, 15),
                "light");
    }

    @Test
    void getAllNews_whenEmpty_returnEmptyList() {
//        // GIVEN
//        List<News> expected = List.of(); // the crucial thing here is the usage of List.of!
//        when(mockNewsRepo.findAll()).thenReturn(expected);
//        // WHEN
//        // Attention: here with thenReturn(List.of("A", "B")) => the mock repository is returning an immutable list, the sort operation within getAllNews will throw the UnsupportedOperationException.
//        List<News> actual = newsService.getAllNews();
//        // THEN
//        verify(mockNewsRepo).findAll();
//        assertEquals(expected, actual);

        // GIVEN
        List<News> expected = new ArrayList<>(); // !! or new ArrayList<>(List.of()) => using the common implementations ArrayList or LinkedList the resulting List is Mutable
        when(mockNewsRepo.findAllByOrderByEndDateDesc()).thenReturn(expected);
        // WHEN
        List<News> actual = newsService.getAllNews();
        // THEN
        verify(mockNewsRepo).findAllByOrderByEndDateDesc();
        assertEquals(expected, actual);

        //        // alternative instead of List, use ArrayList directly for the variables
        //        // GIVEN
        //        ArrayList<News> expectedArrayList = new ArrayList<>(List.of());
        //        when(mockNewsRepo.findAll()).thenReturn(expectedArrayList);
        //        // WHEN
        //        ArrayList<News> actualArrayList = new ArrayList<>( newsService.getAllNews() );
        //
        //        // THEN
        //        verify(mockNewsRepo).findAll();
        //        assertEquals(expectedArrayList, actualArrayList);
            }

    @Test
    void getAllNews_whenNotEmpty_returnNewsList() {
//        // GIVEN
//        expected is unmodifiable (e.g., created with List.of())
//        → you cannot sort it directly. You need to create a new modifiable list from it and then sort that new list:
//        List<News> expected = List.of(n2, n1);
//        when(mockNewsRepo.findAll()).thenReturn(List.of(n1, n2));
//        // WHEN
//        // Attention: here with thenReturn(List.of(n1, n2)) => the mock repository is returning an immutable list, the sort operation within getAllNews will throw the UnsupportedOperationException.
//        List<News> actual = newsService.getAllNews();
//        // THEN
//        verify(mockNewsRepo).findAll();
//        assertEquals(expected, actual);

        // GIVEN
        List<News> expected = new ArrayList<>(List.of(n2, n1));
        when(mockNewsRepo.findAllByOrderByEndDateDesc()).thenReturn( expected );
        // WHEN
        // Attention: Because the mock repository is returning an immutable list, the sort operation within getAllNews will throw the UnsupportedOperationException.
        List<News> actual = newsService.getAllNews();
        // THEN
        verify(mockNewsRepo).findAllByOrderByEndDateDesc();
        assertEquals(expected, actual);

        //        // alternative instead of List, use ArrayList directly for the variables
        //        // GIVEN
        //        ArrayList<News> expectedArrayList = new ArrayList<>(List.of(n2, n1));
        //        when(mockNewsRepo.findAll()).thenReturn( new ArrayList<>(List.of(n1, n2)) );
        //        // WHEN
        //        // Attention: Because the mock repository is returning an immutable list, the sort operation within getAllNews will throw the UnsupportedOperationException.
        //        List<News> actual = newsService.getAllNews();
        //        ArrayList<News> actualArrayList = new ArrayList<>(actual);
        //        // THEN
        //        verify(mockNewsRepo).findAll();
        //        assertEquals(expectedArrayList, actualArrayList);
    }

    @Test
    void getNewsById_found() {
        // GIVEN
        News expected = n2;
        String id = "2";
        when(mockNewsRepo.findById(id)).thenReturn(Optional.of(expected));
        // WHEN
        News actual = newsService.getNewsById(id);
        // THEN
        verify(mockNewsRepo).findById(id);
        assertEquals(expected, actual);
    }

    @Test
    void getNewsById_notFound() {
        // GIVEN
        String id = "3";
        //  when(mockNewsRepo.findById(id)).thenReturn(Optional.empty()); // mock the behavior to ensure it returns an empty Optional => but this line is obsolete because implementation of newsService.getNewsById return News and not Optional
        // WHEN + THEN
        assertThrows(NewsNotFoundException.class, () -> newsService.getNewsById(id));


        // Order Matters: The order of operations in a test is crucial.
        // You must first execute the code under test and then verify any interactions with mock objects.
        // The verify call should be placed after the method under test is executed.
        verify(mockNewsRepo).findById(id); // Verify the method was called
    }

    @Test
    void saveNews() {
        // GIVEN
        News expected = n2;
        String id = "2";
        // Mock ID generation
        when(mockIdService.randomId()).thenReturn(id);

        when(mockNewsRepo.save(n2)).thenReturn(expected);
        // WHEN
        News actual = newsService.saveNews(n2);
        // THEN
        verify(mockIdService).randomId();
        verify(mockNewsRepo).save(n2);
        assertEquals(expected, actual);
    }

    // Test with Null Input
    @Test
    void saveNewsNullInput() {
        assertThrows(NullPointerException.class, () -> newsService.saveNews(null));
    }

    // 2. Test with Empty or Invalid News Object
    @Test
    void saveNewsInvalidNews_A() {
        // GIVEN
        // Mock ID generation if necessary, but actually not required
//        String id = "2";
//        when(mockIdService.randomId()).thenReturn(id);

        // WHEN & THEN
        // Create an invalid News object (here the end date is NOT after the start date), see raised IllegalArgumentException in News class
        assertThrows(IllegalArgumentException.class, () -> newsService.saveNews(new News(null, null, "", LocalDate.now(), LocalDate.now(), "light")));

        // SonarQube complains: Refactor the code of the lambda to have only one invocation possibly throwing a runtime exception.
        // When verifying that code raises a runtime exception, a good practice is to avoid having multiple method calls inside the tested code, to be explicit about which method call is expected to raise the exception.
        // It increases the clarity of the test, and avoid incorrect testing when another method is actually raising the exception.
        // Solution: see saveNewsInvalidNews_B
    }
    @Test
    void saveNewsInvalidNews_B() {
        // same test as saveNewsInvalidNews_A but written differently

        // Mock ID generation if necessary, but actually not required
//        String id = "2";
//        when(mockIdService.randomId()).thenReturn(id);

        try {
            newsService.saveNews(new News("", null, "", LocalDate.now(), LocalDate.now(), "light"));
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            // Expected behavior
        }
    }

    // the following both tests are negligible
            // Test Repository Save Failure
            @Test
            void saveNewsRepositoryFailure() {
                String id = "2";
                when(mockIdService.randomId()).thenReturn(id);
                when(mockNewsRepo.save(n2)).thenThrow(new RuntimeException("Save failed"));

                assertThrows(RuntimeException.class, () -> newsService.saveNews(n2));
            }

            // Test Id Generation Failure
            @Test
            void saveNewsIdGenerationFailure() {
                when(mockIdService.randomId()).thenThrow(new RuntimeException("ID generation failed"));

                assertThrows(RuntimeException.class, () -> newsService.saveNews(n2));
            }

    @Test
    void deleteNews_notFound() {
        // GIVEN
        String id = "2";
        when(mockNewsRepo.existsById(id)).thenReturn(false);

        // WHEN & THEN
        assertThrows(NewsNotFoundException.class, () -> newsService.deleteNews(id));

        verify(mockNewsRepo).existsById(id);
        // opposite i.e. was NOT called
        verify(mockNewsRepo, never()).deleteById(id);
    }

    @Test
    void deleteNews_found() {
        // GIVEN
        String id = "2";
        when(mockNewsRepo.existsById(id)).thenReturn(true);
//        // WHEN // here not required because invocation of newsService.deleteNews(id) happens in the assertDoesNotThrow
//        newsService.deleteNews(id);

        // WHEN & THEN
        assertDoesNotThrow(() -> newsService.deleteNews(id));

        // THEN
        verify(mockNewsRepo).existsById(id);
        verify(mockNewsRepo).deleteById(id);
    }

    @Test
    void updateNews_succesful() {
        // GIVEN
        String id = "2";
        News newN2 = new News("2",
                "X-Mas-Film",
                null,
                LocalDate.of(2025, 2, 20),
                LocalDate.of(2025, 3, 15),
                "light"
        );
        News expected = newN2;
        when(mockNewsRepo.existsById(id)).thenReturn(true);
        when(mockNewsRepo.save(newN2)).thenReturn(newN2);

        // WHEN
        News actual = newsService.updateNews(id, newN2);

        // THEN
        verify(mockNewsRepo).existsById(id);
        verify(mockNewsRepo).save(newN2);
        assertEquals(expected, actual);
    }

    @Test
    void updateNews_idMismatch_IllegalArgument() {
        // GIVEN
        String id = "3";
        News newN2 = new News("2",
                "X-Mas-Film",
                null,
                LocalDate.of(2025, 2, 20),
                LocalDate.of(2025, 3, 15),
                "light"
        );
        when(mockNewsRepo.existsById(id)).thenReturn(true);

        // WHEN & THEN
        assertThrows(IllegalArgumentException.class, () -> newsService.updateNews(id, newN2));
        verify(mockNewsRepo).existsById(id);
        verify(mockNewsRepo, never()).save(any()); // Verify save is not called
    }

    @Test
    void updateNews_notFound_NewsNotFoundException() {
        // GIVEN
        String id = "2";
        News newN2 = new News("2",
                "X-Mas-Film",
                null,
                LocalDate.of(2025, 2, 20),
                LocalDate.of(2025, 3, 15),
                "light"
        );
        when(mockNewsRepo.existsById(id)).thenReturn(false);

        // WHEN & THEN
        assertThrows(NewsNotFoundException.class, () -> newsService.updateNews(id, newN2));
        verify(mockNewsRepo).existsById(id);
        verify(mockNewsRepo, never()).save(any()); // Verify save is not called
    }

    @Test
    void getAllValidNewsByDateInRange_whenEmpty_returnEmptyList() {
        // GIVEN
        List<News> expected = new ArrayList<>();

        // Mock now date generation
        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));

        LocalDate currentDate = mockDateNowService.localDateNow();
        when(mockNewsRepo.findAllValidNewsByDateInRange(currentDate)).thenReturn(expected);
        // WHEN
        List<News> actual = newsService.getAllValidNewsByDateInRange();
        // THEN
        verify(mockNewsRepo).findAllValidNewsByDateInRange(currentDate);
        assertEquals(expected, actual);

        //        // GIVEN
        //        ArrayList<News> expectedArrayList = new ArrayList<>(List.of());
        //
        //        // Mock now date generation
        //        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));
        //
        //        LocalDate currentDate = mockDateNowService.localDateNow();
        //        when(mockNewsRepo.findNewsByDateInRange(currentDate)).thenReturn(expectedArrayList);
        //        // WHEN
        //        ArrayList<News> actualArrayList = new ArrayList<>( newsService.getNewsByDateInRange() );
        //
        //        // THEN
        //        verify(mockNewsRepo).findNewsByDateInRange(currentDate);
        //        assertEquals(expectedArrayList, actualArrayList);
    }

    @Test
    void getNewsByDateInRange_whenNotEmpty_returnAllValidNewsList_1() {
        // GIVEN
        List<News> expected = new ArrayList<>(List.of(n1));
        // Mock now date generation
        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));

        LocalDate currentDate = mockDateNowService.localDateNow(); // currentDate contains the predefined now date above
        when(mockNewsRepo.findAllValidNewsByDateInRange(currentDate)).thenReturn(expected);
        // WHEN
        List<News> actual = newsService.getAllValidNewsByDateInRange();
        // THEN
        verify(mockNewsRepo).findAllValidNewsByDateInRange(currentDate);
        assertEquals(expected, actual);

        //        // GIVEN
        //        ArrayList<News> expectedArrayList = new ArrayList<>(List.of(n1));
        //        // Mock now date generation
        //        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));
        //
        //        LocalDate currentDate = mockDateNowService.localDateNow(); // currentDate contains the predefined now date above
        //        when(mockNewsRepo.findNewsByDateInRange(currentDate)).thenReturn(expectedArrayList);
        //        // WHEN
        //        ArrayList<News> actualArrayList = new ArrayList<>( newsService.getNewsByDateInRange() );
        //        // THEN
        //        verify(mockNewsRepo).findNewsByDateInRange(currentDate);
        //        assertEquals(expectedArrayList, actualArrayList);
    }

    // here with sorting in the actual call of newsService.getNewsByDateInRange()
    @Test
    void getNewsByDateInRange_whenNotEmpty_returnAllValidNewsList_2() {
        // GIVEN
        List<News> expected = new ArrayList<>(List.of(n2, n1));

        // Mock now date generation
        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));

        LocalDate currentDate = mockDateNowService.localDateNow(); // currentDate contains the predefined now date above
        when(mockNewsRepo.findAllValidNewsByDateInRange(currentDate)).thenReturn( new ArrayList<>(List.of(n1, n2)) );
        // WHEN
        List<News> actual = newsService.getAllValidNewsByDateInRange();
        // THEN
        verify(mockNewsRepo).findAllValidNewsByDateInRange(currentDate);
        assertEquals(expected, actual);

        //        // GIVEN
        //        ArrayList<News> expectedArrayList = new ArrayList<>(List.of(n2, n1));
        //
        //        // Mock now date generation
        //        when(mockDateNowService.localDateNow()).thenReturn(LocalDate.of(2025, 4, 20));
        //
        //        LocalDate currentDate = mockDateNowService.localDateNow(); // currentDate contains the predefined now date above
        //        when(mockNewsRepo.findNewsByDateInRange(currentDate)).thenReturn( new ArrayList<>(List.of(n1, n2)) );
        //        // WHEN
        //        ArrayList<News> actualArrayList = new ArrayList<>( newsService.getNewsByDateInRange() );
        //        // THEN
        //        verify(mockNewsRepo).findNewsByDateInRange(currentDate);
        //        assertEquals(expectedArrayList, actualArrayList);
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// remark: @RunWith(MockitoJUnitRunner.class) (instead of @ExtendWith(MockitoExtension.class)) is the JUnit 4 approach for initializing Mockito mocks. Since you appear to be using JUnit 5 (given the @BeforeEach annotation), the preferred approach is @ExtendWith(MockitoExtension.class).

//@ExtendWith(MockitoExtension.class)
//class NewsServiceTest {
//
//    @Mock
//    private NewsRepo newsRepo;
//
//    @Mock
//    private IdService idService;
//
//    @Mock
//    private DateNowService dateNowService;
//
//    @InjectMocks
//    private NewsService newsService;
//
//    private News n1, n2;
//
//    @BeforeEach
//    void setUp() {
//        // Initialize test data
//        n1 = new News("1",
//                "Vorführung X fällt aus",
//                null,
//                LocalDate.of(2025, 3, 10),
//                LocalDate.of(2025, 3, 28),
//                "light");
//
//        n2 = new News("2",
//                "Geburtstagsfilm",
//                null,
//                LocalDate.of(2025, 2, 20),
//                LocalDate.of(2025, 3, 15),
//                "light");
//    }
//
//    // Test methods will go here
//}