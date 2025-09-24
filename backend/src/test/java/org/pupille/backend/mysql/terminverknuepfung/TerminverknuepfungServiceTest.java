package org.pupille.backend.mysql.terminverknuepfung;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.film.FilmDTOSelection;
import org.pupille.backend.mysql.film.FilmRepository;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminProjectionSelection;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class TerminverknuepfungServiceTest {

    @Mock
    private FilmRepository filmRepository;

    @Mock
    private TerminRepository terminRepository;

    @Mock
    private TerminverknuepfungRepository terminverknuepfungRepository;

    @InjectMocks
    private TerminverknuepfungService service;

    private Film film1;
    private Film film2;
    private Termin termin1;
    private Termin termin2;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        film1 = new Film();
        film1.setFnr(1L);
        film1.setTitel("Film 1");

        film2 = new Film();
        film2.setFnr(2L);
        film2.setTitel("Film 2");

        termin1 = new Termin();
        termin1.setTnr(1L);
        termin1.setTitel("Termin 1");

        termin2 = new Termin();
        termin2.setTnr(2L);
        termin2.setTitel("Termin 2");
    }

    // Helper method remains same, using film and termin instances
    private Terminverknuepfung mockTV(Film film, Termin termin) {
        Terminverknuepfung tv = new Terminverknuepfung();
        tv.setFilm(film);
        tv.setTermin(termin);
        tv.setTnr(termin.getTnr());
        tv.setFnr(film.getFnr());
        tv.setVorfilm(true);
        tv.setRang((short) 1);
        return tv;
    }

    @Test
    void getAllTerminverknuepfung_returnsMappedDTOs() {
        when(terminverknuepfungRepository.findAll())
                .thenReturn(List.of(mockTV(film1, termin1), mockTV(film2, termin2)));

        List<TerminverknuepfungDTOSelection> result = service.getAllTerminverknuepfung();

        assertEquals(2, result.size());


        // Assert each DTO matches expected values
        TerminverknuepfungDTOSelection dto1 = result.stream()
                .filter(dto -> dto.tnr().equals(termin1.getTnr()) && dto.fnr().equals(film1.getFnr()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("DTO for film1 & termin1 not found"));

        assertTrue(dto1.vorfilm());
        assertEquals((short) 1, dto1.rang());

        TerminverknuepfungDTOSelection dto2 = result.stream()
                .filter(dto -> dto.tnr().equals(termin2.getTnr()) && dto.fnr().equals(film2.getFnr()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("DTO for film2 & termin2 not found"));

        assertTrue(dto2.vorfilm());
        assertEquals((short) 1, dto2.rang());
    }

    @Test
    void getAllTVByOrderByTnrDesc_returnsOrderedDTOs() {
        when(terminverknuepfungRepository.findAllByOrderByTnrDesc())
                .thenReturn(List.of(mockTV(film2, termin2), mockTV(film1, termin1)));

        List<TerminverknuepfungDTOSelection> result = service.getAllTVByOrderByTnrDesc();

        assertEquals(2, result.size());
        assertEquals(2L, result.get(0).tnr());
    }

    @Test
    void getTVById_existing_returnsDTO() {
        Terminverknuepfung.TerminverknuepfungId id = new Terminverknuepfung.TerminverknuepfungId(termin1.getTnr(), film2.getFnr());
        Terminverknuepfung tv = mockTV(film2, termin1);

        when(terminverknuepfungRepository.findById(id)).thenReturn(Optional.of(tv));

        Optional<TerminverknuepfungDTOSelection> result = service.getTVById(id);

        assertTrue(result.isPresent());
        assertEquals(termin1.getTnr(), result.get().tnr());
        assertEquals(film2.getFnr(), result.get().fnr());
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    @Test
    void getAllTVWithFilmAndTermin_returnsMappedDTOs() {
        Terminverknuepfung tv = mockTV(film1, termin1);

        when(terminverknuepfungRepository.findAllWithFilmAndTermin())
                .thenReturn(List.of(tv));

        List<TVWithFilmAndTerminDTOSelection> result = service.getAllTVWithFilmAndTermin();

        assertEquals(1, result.size());
        assertEquals("Film 1", result.get(0).film().titel());
        assertEquals("Termin 1", result.get(0).termin().titel());
    }

    //      '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    @Test
    void getAllTVWithFilmAndTerminSortedByTermin_Desc_returnsMappedDTOs() {
        // Create a mock projection
        // here: anonymous class that implements the TVWithFilmAndTerminProjection interface
        //  *An anonymous class is a way to create a one-time-use implementation of an interface or abstract class, without giving it a name.
        //  *defined and instantiated at the same time, right where it's needed
        //  *this implementation is only needed for this one test, so creating a full class would be overkill
        //  *quick, inline way to create a fake implementation of the projection interface for testing purposes. It’s a common pattern in unit tests when you need to mock complex return types.
        TVWithFilmAndTerminProjection projection = new TVWithFilmAndTerminProjection() {
            // new TVWithFilmAndTerminProjection() { ... }: This creates a new, unnamed class that implements the TVWithFilmAndTerminProjection interface.
            // { ... }: Inside the braces, you provide the implementation for all the abstract methods (getters) defined in the interface.
            // @Override: This annotation indicates that the method is overriding a method from the interface.
            // return ...: Each method returns a hardcoded value, simulating the data you expect from your projection.
            @Override public Long getTnr() { return 1L; }
            @Override public Long getFnr() { return 1L; }
            @Override public Boolean getVorfilm() { return false; }
            @Override public Short getRang() { return 1; }
            @Override public String getFilmTitel() { return "Film 1"; }
            @Override public Integer getFilmJahr() { return 2023; }
            @Override public String getFilmRegie() { return "Regie 1"; }
            @Override public String getFilmStab() { return "Stab 1"; }
            @Override public LocalDateTime getTerminVorstellungsbeginn() { return LocalDateTime.now(); }
            @Override public String getTerminTitel() { return "Termin 1"; }
        };

        // Mock the repository
        when(terminverknuepfungRepository.findAllWithFilmAndTerminOrderByTerminDesc())
                .thenReturn(List.of(projection));

        when(terminverknuepfungRepository.findAllWithFilmAndTerminOrderByTerminDesc())
                .thenReturn(List.of(projection));

        List<TVWithFilmAndTerminDTOSelection> result = service.getAllTVWithFilmAndTerminSortedByTerminDesc();

        assertEquals(1, result.size());
        assertEquals("Film 1", result.get(0).film().titel());
        assertEquals("Termin 1", result.get(0).termin().titel());

        verify(terminverknuepfungRepository).findAllWithFilmAndTerminOrderByTerminDesc();
    }

            //    @Test
            //    void getAllTVWithFilmAndTerminSortedByTermin_Desc_returnsMappedDTOs_SuperSlow() {
            //        Terminverknuepfung tv = mockTV(film1, termin1);
            //
            //        when(terminverknuepfungRepository.findAllWithFilmAndTerminOrderByTerminDesc_SuperSlow())
            //                .thenReturn(List.of(tv));
            //
            //        List<TVWithFilmAndTerminDTOSelection> result = service.getAllTVWithFilmAndTerminSortedByTerminDesc();
            //
            //        assertEquals(1, result.size());
            //        assertEquals("Film 1", result.get(0).film().titel());
            //        assertEquals("Termin 1", result.get(0).termin().titel());
            //
            //        verify(terminverknuepfungRepository).findAllWithFilmAndTerminOrderByTerminDesc();
            //    }
    //      '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    @Test
    void getTVWithFilmAndTerminByTnrAndFnr_existing_returnsDTO() {
        Terminverknuepfung tv = mockTV(film1, termin1);

        when(terminverknuepfungRepository.findWithFilmAndTerminByTnrAndFnr(termin1.getTnr(), film1.getFnr()))
                .thenReturn(Optional.of(tv));

        TVWithFilmAndTerminDTOSelection dto = service.getTVWithFilmAndTerminByTnrAndFnr(termin1.getTnr(), film1.getFnr());

        assertEquals(termin1.getTnr(), dto.tnr());
        assertEquals(film1.getFnr(), dto.fnr());
        assertEquals("Film 1", dto.film().titel());
        assertEquals("Termin 1", dto.termin().titel());
    }

    @Test
    void getTVWithFilmAndTerminByTnrAndFnr_notFound_throws() {
        when(terminverknuepfungRepository.findWithFilmAndTerminByTnrAndFnr(anyLong(), anyLong()))
                .thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> service.getTVWithFilmAndTerminByTnrAndFnr(1L, 2L));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    // ---------------------------------------------------------------------------------------------
    @Test
    void getFilmlistByTnr_returnsListOfFilmDTOSelection() {
        Terminverknuepfung tv = mockTV(film1, termin1);
        List<Terminverknuepfung> tvList = List.of(tv);

        when(terminverknuepfungRepository.findByTnrWithFilms(termin1.getTnr())).thenReturn(tvList);

        List<FilmDTOSelection> result = service.getFilmlistByTnr(termin1.getTnr());

        assertEquals(1, result.size());
        assertEquals("Film 1", result.get(0).getTitel());
    }

    @Test
    void getTerminlistByFnr_returnsProjectionList() {
        TerminProjectionSelection proj1 = mock(TerminProjectionSelection.class);
        when(proj1.getTnr()).thenReturn(termin1.getTnr());
        when(proj1.getVorstellungsbeginn()).thenReturn(LocalDateTime.now());
        when(proj1.getTitel()).thenReturn("Projection Title");

        when(terminverknuepfungRepository.findTermineByFilmFnr(film1.getFnr())).thenReturn(List.of(proj1));

        List<TerminProjectionSelection> result = service.getTerminlistByFnr(film1.getFnr());

        assertEquals(1, result.size());
        assertEquals("Projection Title", result.get(0).getTitel());
    }
    // ---------------------------------------------------------------------------------------------

    @Test
    void updateTerminverknuepfung_deletesOldAndSavesNew() {
        Film newFilm = film2;
        Termin newTermin = termin2;

        Terminverknuepfung.TerminverknuepfungId oldId = new Terminverknuepfung.TerminverknuepfungId(1L, 2L);
        TerminverknuepfungDTOSelection dto = new TerminverknuepfungDTOSelection(newTermin.getTnr(), newFilm.getFnr(), false, (short) 5);

        when(terminverknuepfungRepository.existsById(oldId)).thenReturn(true);
        when(filmRepository.findById(newFilm.getFnr())).thenReturn(Optional.of(newFilm));
        when(terminRepository.findById(newTermin.getTnr())).thenReturn(Optional.of(newTermin));

        // invocation parameter represents the method call that was made on the mock. It contains information about the method being called and the arguments passed to it
        when(terminverknuepfungRepository.save(any())).thenAnswer(invocation -> {
            // line retrieves the first argument passed to the save method. Since save is expected to receive a Terminverknuepfung object, it is cast to that type and stored in the variable arg
            Terminverknuepfung arg = invocation.getArgument(0);
            arg.setTnr(arg.getTermin().getTnr());
            arg.setFnr(arg.getFilm().getFnr());
            return arg;
        });

        TerminverknuepfungDTOSelection updated = service.updateTerminverknuepfung(1L, 2L, dto);

        assertNotNull(updated);
        assertEquals(newTermin.getTnr(), updated.tnr());
        assertEquals(newFilm.getFnr(), updated.fnr());
        assertEquals(dto.vorfilm(), updated.vorfilm());
        assertEquals(dto.rang(), updated.rang());

        verify(terminverknuepfungRepository).deleteById(oldId);
        verify(terminverknuepfungRepository).save(any());
    }

    @Test
    void updateTerminverknuepfung_oldNotFound_throws() {
        Terminverknuepfung.TerminverknuepfungId oldId = new Terminverknuepfung.TerminverknuepfungId(1L, 2L);
        when(terminverknuepfungRepository.existsById(oldId)).thenReturn(false);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> service.updateTerminverknuepfung(1L, 2L, new TerminverknuepfungDTOSelection(3L, 4L, false, (short) 1)));

        assertTrue(ex.getMessage().contains("No Terminverknuepfung found"));
    }

    @Test
    void deleteTerminverknuepfung_callsRepositoryDelete() {
        Terminverknuepfung.TerminverknuepfungId id = new Terminverknuepfung.TerminverknuepfungId(1L, 2L);

        doNothing().when(terminverknuepfungRepository).deleteById(id);

        service.deleteTerminverknuepfung(id);

        verify(terminverknuepfungRepository).deleteById(id);
    }

    @Test
    void linkExistingFilmToExistingTermin_createsAndSavesNew() {
        TerminverknuepfungDTOSelection dto = new TerminverknuepfungDTOSelection(termin1.getTnr(), film1.getFnr(), true, (short) 2);

        when(filmRepository.findById(film1.getFnr())).thenReturn(Optional.of(film1));
        when(terminRepository.findById(termin1.getTnr())).thenReturn(Optional.of(termin1));
        when(terminverknuepfungRepository.existsById(any())).thenReturn(false);
        when(terminverknuepfungRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        service.linkExistingFilmToExistingTermin(dto);

        verify(terminverknuepfungRepository).save(any());
    }

    @Test
    void linkExistingFilmToExistingTermin_linkExists_throws() {
        TerminverknuepfungDTOSelection dto = new TerminverknuepfungDTOSelection(termin1.getTnr(), film1.getFnr(), true, (short) 2);
        Terminverknuepfung.TerminverknuepfungId existingId = new Terminverknuepfung.TerminverknuepfungId(dto.tnr(), dto.fnr());

        when(filmRepository.findById(film1.getFnr())).thenReturn(Optional.of(film1));
        when(terminRepository.findById(termin1.getTnr())).thenReturn(Optional.of(termin1));

                                                // argThat is used to define a condition that the argument passed to the existsById method must satisfy
                                                // The purpose of using argThat in this context is to provide a flexible way to match complex conditions for method arguments.
                                                // Instead of relying on simple matchers like any() or eq(), which may not capture the specific logic you want to test, argThat allows you to define custom logic that can check multiple properties or conditions.
//        when(terminverknuepfungRepository.existsById(argThat(id ->
//                id.getTnr().equals(existingId.getTnr()) && id.getFnr().equals(existingId.getFnr())))).thenReturn(true);
        // alternative to the above:
        when(terminverknuepfungRepository.existsById(existingId)).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.linkExistingFilmToExistingTermin(dto));
        assertTrue(ex.getMessage().contains("Link already exists"));

        verify(terminverknuepfungRepository, never()).save(any());
    }

}