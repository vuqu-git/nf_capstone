package org.pupille.backend.mysql.reihe;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.springframework.data.domain.Sort;

import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReiheServiceTest {

    @Mock
    private ReiheRepository reiheRepository;

    @Mock
    private TerminRepository terminRepository;

    @InjectMocks
    private ReiheService reiheService;

    @BeforeEach
    void setUp() {
        //  initializes all fields above annotated with @Mock, @Spy, @Captor, or @InjectMocks inside the test class instance.
        //  This replaces the deprecated initMocks() method and supports better resource management.
        //  It prepares mock objects so they can be used in tests properly.
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllReihen_returnsSortedReiheDTOSelection() {
        Reihe r1 = new Reihe();
        r1.setRnr(1L);
        r1.setTitel("Alpha");
        Reihe r2 = new Reihe();
        r2.setRnr(2L);
        r2.setTitel("Beta");

        when(reiheRepository.findAll(any(Sort.class))).thenReturn(List.of(r1, r2));

        List<ReiheDTOSelection> result = reiheService.getAllReihen();

        assertEquals(2, result.size());
        assertEquals("Beta", result.get(1).getTitel());
        assertEquals("Alpha", result.get(0).getTitel());
        verify(reiheRepository).findAll(any(Sort.class));
    }

    @Test
    void getReiheDTOFormByIdWithTermineAndFilms_found_returnsDTO() {
        Reihe r = new Reihe();
        r.setRnr(10L);
        r.setTitel("Test Reihe");
        when(reiheRepository.findWithTermineAndFilmsByRnr(10L)).thenReturn(Optional.of(r));

        ReiheDTOFormWithTermineAndFilme dto = reiheService.getReiheDTOFormByIdWithTermineAndFilms(10L);

        assertEquals(10L, dto.getRnr());
        assertEquals("Test Reihe", dto.getTitel());
        verify(reiheRepository).findWithTermineAndFilmsByRnr(10L);
    }

    @Test
    void getReiheDTOFormByIdWithTermineAndFilms_notFound_throws() {
        when(reiheRepository.findWithTermineAndFilmsByRnr(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                reiheService.getReiheDTOFormByIdWithTermineAndFilms(999L));
        assertTrue(ex.getMessage().contains("Reihe not found with ID"));
    }

    @Test
    void getReiheById_existing_returnsReihe() {
        Reihe r = new Reihe();
        r.setRnr(5L);
        when(reiheRepository.findById(5L)).thenReturn(Optional.of(r));

        Reihe found = reiheService.getReiheById(5L);

        assertEquals(5L, found.getRnr());
    }

    @Test
    void getReiheById_notFound_throws() {
        when(reiheRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> reiheService.getReiheById(42L));
        assertTrue(ex.getMessage().contains("Reihe not found"));
    }

            @Test
            void getReiheByIdWithTermine_existing_returnsReihe() {
                Reihe r = new Reihe();
                r.setRnr(6L);
                when(reiheRepository.findWithTermineByRnr(6L)).thenReturn(Optional.of(r));

                Reihe found = reiheService.getReiheByIdWithTermine(6L);

                assertEquals(6L, found.getRnr());
            }

            @Test
            void getReiheByIdWithTermine_notFound_throws() {
                when(reiheRepository.findWithTermineByRnr(anyLong())).thenReturn(Optional.empty());

                RuntimeException ex = assertThrows(RuntimeException.class, () -> reiheService.getReiheByIdWithTermine(7L));
                assertTrue(ex.getMessage().contains("Reihe not found"));
            }

    @Test
    void createReihe_savesSuccessfully() {
        Reihe r = new Reihe();
        r.setTitel("Neu");

        when(reiheRepository.save(r)).thenReturn(r);

        Reihe created = reiheService.createReihe(r);

        assertEquals("Neu", created.getTitel());
        verify(reiheRepository).save(r);
    }

    @Test
    void updateReihe_existing_updatesAndSaves() {
        Reihe existing = new Reihe();
        existing.setRnr(100L);
        existing.setTitel("Alt");
        existing.setText("Text Alt");
        existing.setSonderfarbe("Rot");

        Reihe updated = new Reihe();
        updated.setTitel("Neu");
        updated.setText("Text Neu");
        updated.setSonderfarbe("Blau");

        when(reiheRepository.findById(100L)).thenReturn(Optional.of(existing));
        when(reiheRepository.save(existing)).thenReturn(existing);

        Reihe result = reiheService.updateReihe(100L, updated);

        assertEquals("Neu", result.getTitel());
        assertEquals("Text Neu", result.getText());
        assertEquals("Blau", result.getSonderfarbe());
        verify(reiheRepository).save(existing);
    }

    @Test
    void deleteReihe_existing_deletes() {
        Reihe r = new Reihe();
        r.setRnr(10L);

        when(reiheRepository.findById(10L)).thenReturn(Optional.of(r));
        doNothing().when(reiheRepository).delete(r);

        reiheService.deleteReihe(10L);

        verify(reiheRepository).delete(r);
    }

    @Test
    void getAllReihenByTerminId_existing_returnsList() {
        Termin termin = new Termin();
        termin.setTnr(5L);

        Reihe r1 = new Reihe();
        r1.setRnr(1L);

        Reihe r2 = new Reihe();
        r2.setRnr(2L);

        termin.setReihen(new HashSet<>(Set.of(r1, r2)));

        when(terminRepository.findById(5L)).thenReturn(Optional.of(termin));

        List<ReiheDTOSelection> list = reiheService.getAllReihenByTerminId(5L);

        assertEquals(2, list.size());
        verify(terminRepository).findById(5L);
    }

    @Test
    void getAllReihenByTerminId_notFound_throws() {
        when(terminRepository.findById(anyLong())).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(NoSuchElementException.class, () -> reiheService.getAllReihenByTerminId(3L));
        assertTrue(ex.getMessage().contains("Termin not found"));
    }

    @Test
    void getAllReihenByTerminIdWithAllItsTermineAndFilms_existing_returnsList() {
        Termin termin = new Termin();
        termin.setTnr(7L);

        Reihe r = new Reihe();
        r.setRnr(1L);
                                // singletonList creates an immutable list containing a single specified element
        termin.setReihen(new HashSet<>(Collections.singletonList(r)));

        when(terminRepository.findWithReihenAndTermineAndFilmsByTnr(7L)).thenReturn(Optional.of(termin));

        List<ReiheDTOFormWithTermineAndFilme> list = reiheService.getAllReihenByTerminIdWithAllItsTermineAndFilms(7L);

        assertEquals(1, list.size());
        assertEquals(1L, list.getFirst().getRnr());

        verify(terminRepository).findWithReihenAndTermineAndFilmsByTnr(7L);
    }

    @Test
    void getAllReihenByTerminIdWithAllItsTermineAndFilms_notFound_throws() {
        when(terminRepository.findWithReihenAndTermineAndFilmsByTnr(anyLong())).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(NoSuchElementException.class, () -> reiheService.getAllReihenByTerminIdWithAllItsTermineAndFilms(2L));
        assertTrue(ex.getMessage().contains("Termin not found"));
    }

    @Test
    void addTerminToReihe_addsAndSavesCorrectly() {
        Reihe reihe = new Reihe();
        reihe.setRnr(1L);
        reihe.setTermine(new HashSet<>());

        Termin termin = new Termin();
        termin.setTnr(2L);
        termin.setReihen(new HashSet<>());

        when(reiheRepository.findWithTermineByRnr(1L)).thenReturn(Optional.of(reihe));
        when(terminRepository.findWithReihenByTnr(2L)).thenReturn(Optional.of(termin));
                            // any(Reihe.class) matcher means that this setup will apply to any instance of the Reihe class that is passed to the save method
                                    // thenAnswer(...): This method allows you to define a custom response when the specified method is called. Instead of returning a fixed value, you can provide a lambda expression that determines the return value dynamically.
                                            // i -> i.getArguments()[0]: This lambda expression is the implementation of the custom answer. Here, i represents the invocation of the method call.
                                            // The getArguments() method retrieves the arguments passed to the save method, and [0] accesses the first argument. Since the save method is expected to return the instance of Reihe that was passed to it,
                                            // this setup effectively makes the save method return the same Reihe instance that was provided as an argument.
        when(reiheRepository.save(any(Reihe.class))).thenAnswer(i -> i.getArguments()[0]);
        when(terminRepository.save(any(Termin.class))).thenAnswer(i -> i.getArguments()[0]);

        Reihe resultReihe = reiheService.addTerminToReihe(1L, 2L);

        assertTrue(resultReihe.getTermine().contains(termin));
        assertTrue(termin.getReihen().contains(reihe));
        verify(reiheRepository).save(reihe);
        verify(terminRepository).save(termin);
    }

    @Test
    void removeTerminFromReihe_removesAndSavesCorrectly() {
        Reihe reihe = new Reihe();
        reihe.setRnr(1L);
        Termin termin = new Termin();
        termin.setTnr(2L);

        Set<Termin> termineSet = new HashSet<>();
        termineSet.add(termin);
        reihe.setTermine(termineSet);

        Set<Reihe> reihenSet = new HashSet<>();
        reihenSet.add(reihe);
        termin.setReihen(reihenSet);

        when(reiheRepository.findWithTermineByRnr(1L)).thenReturn(Optional.of(reihe));
        when(terminRepository.findWithReihenByTnr(2L)).thenReturn(Optional.of(termin));
        when(reiheRepository.save(any(Reihe.class))).thenAnswer(i -> i.getArguments()[0]);
        when(terminRepository.save(any(Termin.class))).thenAnswer(i -> i.getArguments()[0]);

        reiheService.removeTerminFromReihe(1L, 2L);

        // False is asserted here!
        assertFalse(reihe.getTermine().contains(termin));
        assertFalse(termin.getReihen().contains(reihe));
        verify(reiheRepository).save(reihe);
        verify(terminRepository).save(termin);
    }

    @Test
    void removeTerminFromReihe_notFound_throws() {
        Reihe reihe = new Reihe();
        reihe.setRnr(1L);
        Termin termin = new Termin();
        termin.setTnr(2L);

        // Both collections empty to trigger exception
        reihe.setTermine(new HashSet<>());
        termin.setReihen(new HashSet<>());

        when(reiheRepository.findWithTermineByRnr(1L)).thenReturn(Optional.of(reihe));
        when(terminRepository.findWithReihenByTnr(2L)).thenReturn(Optional.of(termin));

        NoSuchElementException ex = assertThrows(NoSuchElementException.class, () ->
                reiheService.removeTerminFromReihe(1L, 2L));
        assertTrue(ex.getMessage().contains("Connection between"));
    }
}

