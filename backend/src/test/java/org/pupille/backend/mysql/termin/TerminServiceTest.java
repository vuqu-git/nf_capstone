package org.pupille.backend.mysql.termin;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.pupille.backend.mysql.clicks.Clicks;
import org.pupille.backend.mysql.clicks.ClicksRepo;
import org.pupille.backend.mysql.reihe.Reihe;

import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class TerminServiceTest {

    @Mock
    private TerminRepository terminRepository;

    @Mock
    private ClicksRepo clicksRepo;

    @InjectMocks
    private TerminService terminService;

    @BeforeEach
    void setUp() {
        //  initializes all fields above annotated with @Mock, @Spy, @Captor, or @InjectMocks inside the test class instance.
        //  This replaces the deprecated initMocks() method and supports better resource management.
        //  It prepares mock objects so they can be used in tests properly.
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTermineByOrderByVorstellungsbeginnDesc_returnsProjectionList() {
        List<TerminProjectionSelection> projections = List.of(mock(TerminProjectionSelection.class));
        when(terminRepository.findAllByOrderByVorstellungsbeginnDesc()).thenReturn(projections);

        List<TerminProjectionSelection> result = terminService.getAllTermineByOrderByVorstellungsbeginnDesc();

        assertEquals(projections, result);
        verify(terminRepository).findAllByOrderByVorstellungsbeginnDesc();
    }

    @Test
    void getAllTermineWithMainfilmeByOrderByVorstellungsbeginnDesc_mapsToDTO() {
                                    // mock method creates 1 mock object of the specified class, in this case, Termin
        List<Termin> termine = List.of(mock(Termin.class));
        when(terminRepository.findWithMainfilmeAllByOrderByVorstellungsbeginnDesc()).thenReturn(termine);

        List<TerminDTOWithMainfilms> result = terminService.getAllTermineWithMainfilmeByOrderByVorstellungsbeginnDesc();

        assertEquals(termine.size(), result.size());
        verify(terminRepository).findWithMainfilmeAllByOrderByVorstellungsbeginnDesc();
    }

    @Test
    void getTerminById_existing_returnsDTOForm() {
        Termin termin = new Termin();
        termin.setTnr(1L);
        termin.setTitel("Beispieltitel");
        // ...

        when(terminRepository.findById(1L)).thenReturn(Optional.of(termin));

        Optional<TerminDTOForm> result = terminService.getTerminById(1L);

        assertTrue(result.isPresent());
        assertEquals(termin.getTnr(), result.get().getTnr());
        assertEquals(termin.getTitel(), result.get().getTitel());
        // ...

        verify(terminRepository).findById(1L);
    }

    @Test
    void getTerminById_notFound_throwsNoSuchElementException() {
        Long nonExistentId = 999L;

        when(terminRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(NoSuchElementException.class, () -> {
            terminService.getTerminById(nonExistentId);
        });

        assertEquals("Termin not found with id " + nonExistentId, ex.getMessage());
        verify(terminRepository).findById(nonExistentId);
    }

    @Test
    void createTermin_savesAndReturnsDTOForm() {
        Termin inputTermin = new Termin();
        inputTermin.setTnr(2L);
        inputTermin.setTitel("Neuer Termin");
        // ...

        Termin savedTermin = new Termin();
        savedTermin.setTnr(2L);
        savedTermin.setTitel("Neuer Termin");
        // ...

        when(terminRepository.save(inputTermin)).thenReturn(savedTermin);

        TerminDTOForm result = terminService.createTermin(inputTermin);

        assertEquals(savedTermin.getTnr(), result.getTnr());
        assertEquals(savedTermin.getTitel(), result.getTitel());
        // ...

        verify(terminRepository).save(inputTermin);
    }

    @Test
    void createTermin_withoutVeroeffentlichen_savesAndReturnsDTOForm() {
        // Test case where no Clicks should be created
        Termin inputTermin = new Termin();
        inputTermin.setTitel("Neuer Termin");
        inputTermin.setVeroeffentlichen(null); // or 0

        Termin savedTermin = new Termin();
        savedTermin.setTnr(2L);
        savedTermin.setTitel("Neuer Termin");
        savedTermin.setVeroeffentlichen(null);

        when(terminRepository.save(inputTermin)).thenReturn(savedTermin);

        TerminDTOForm result = terminService.createTermin(inputTermin);

        assertEquals(savedTermin.getTnr(), result.getTnr());
        assertEquals(savedTermin.getTitel(), result.getTitel());

        verify(terminRepository).save(inputTermin);
        verify(clicksRepo, never()).save(any(Clicks.class)); // Ensure no clicks created
    }

    @Test
    void createTermin_withVeroeffentlichenGreaterThanZero_createsClicksRecord() {
        // Test case where Clicks SHOULD be created
        Termin inputTermin = new Termin();
        inputTermin.setTitel("Neuer Termin");
        inputTermin.setVeroeffentlichen((short) 1);

        Termin savedTermin = new Termin();
        savedTermin.setTnr(2L);
        savedTermin.setTitel("Neuer Termin");
        savedTermin.setVeroeffentlichen((short) 1);

        when(terminRepository.save(inputTermin)).thenReturn(savedTermin);
        when(clicksRepo.save(any(Clicks.class))).thenReturn(new Clicks());

        TerminDTOForm result = terminService.createTermin(inputTermin);

        assertEquals(savedTermin.getTnr(), result.getTnr());
        assertEquals(savedTermin.getTitel(), result.getTitel());

        verify(terminRepository).save(inputTermin);
        verify(clicksRepo).save(any(Clicks.class)); // Verify clicks was created
    }

    @Test
    void createTermin_withVeroeffentlichenZero_doesNotCreateClicks() {
        // Test boundary case where veroeffentlichen = 0
        Termin inputTermin = new Termin();
        inputTermin.setTitel("Neuer Termin");
        inputTermin.setVeroeffentlichen((short) 0);

        Termin savedTermin = new Termin();
        savedTermin.setTnr(2L);
        savedTermin.setTitel("Neuer Termin");
        savedTermin.setVeroeffentlichen((short) 0);

        when(terminRepository.save(inputTermin)).thenReturn(savedTermin);

        TerminDTOForm result = terminService.createTermin(inputTermin);

        assertEquals(savedTermin.getTnr(), result.getTnr());
        verify(terminRepository).save(inputTermin);
        verify(clicksRepo, never()).save(any(Clicks.class));
    }

//    @Test
//    void updateTermin_existing_updatesAndReturnsDTOForm() {
//        Termin existing = new Termin();
//        Termin details = new Termin();
//        when(terminRepository.findById(1L)).thenReturn(Optional.of(existing));
//        when(terminRepository.save(existing)).thenReturn(existing);
//
//        TerminDTOForm result = terminService.updateTermin(1L, details);
//
//        assertNotNull(result);
//        verify(terminRepository).findById(1L);
//        verify(terminRepository).save(existing);
//    }
    @Test
    void updateTermin_existing_returnsUpdatedDTOForm() {
        // Arrange
        Long tnr = 1L;
        Termin existingTermin = new Termin();
        existingTermin.setTnr(tnr);
        existingTermin.setTitel("Old Title");

        Termin terminDetails = new Termin();
        terminDetails.setTitel("New Title");
        terminDetails.setText("New Text");

        Termin updatedTermin = new Termin();
        updatedTermin.setTnr(tnr);
        updatedTermin.setTitel("New Title");
        updatedTermin.setText("New Text");

        when(terminRepository.findById(tnr)).thenReturn(Optional.of(existingTermin));
        when(terminRepository.save(existingTermin)).thenReturn(updatedTermin);

        // Act
        TerminDTOForm result = terminService.updateTermin(tnr, terminDetails);

        // Assert
        assertNotNull(result);
        assertEquals(updatedTermin.getTnr(), result.getTnr());
        assertEquals(updatedTermin.getTitel(), result.getTitel());
        assertEquals(updatedTermin.getText(), result.getText());

        verify(terminRepository).findById(tnr);
        verify(terminRepository).save(existingTermin);
    }

    @Test
    void updateTermin_nonExisting_getTerminById_notFound_throwsNoSuchElementException() {
        when(terminRepository.findById(99L)).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(NoSuchElementException.class, () -> terminService.updateTermin(99L, new Termin()));
        assertTrue(ex.getMessage().contains("Termin not found"));
    }

    @Test
    void updateTermin_withVeroeffentlichenAndNoExistingClicks_createsClicks() {
        Long tnr = 1L;

        // Existing Termin
        Termin existingTermin = new Termin();
        existingTermin.setTnr(tnr);
        existingTermin.setTitel("Old Title");
        existingTermin.setVeroeffentlichen((short) 1);
        existingTermin.setVorstellungsbeginn(LocalDateTime.now());
        existingTermin.setBesonderheit("Some feature");

        // Create an empty list of reihen to simulate the size() check
        existingTermin.setReihen(new HashSet<>());

        // Termin details to update
        Termin terminDetails = new Termin();
        terminDetails.setTitel("New Title");
        terminDetails.setVeroeffentlichen((short) 1);
        terminDetails.setVorstellungsbeginn(existingTermin.getVorstellungsbeginn());
        terminDetails.setBesonderheit(existingTermin.getBesonderheit());

        // Mocked saved Termin
        Termin updatedTermin = new Termin();
        updatedTermin.setTnr(tnr);
        updatedTermin.setTitel("New Title");
        updatedTermin.setVeroeffentlichen((short) 1);
        updatedTermin.setVorstellungsbeginn(existingTermin.getVorstellungsbeginn());
        updatedTermin.setBesonderheit(existingTermin.getBesonderheit());
        updatedTermin.setReihen(existingTermin.getReihen());

        // Mocking repository behaviors
        when(terminRepository.findById(tnr)).thenReturn(Optional.of(existingTermin));
        when(terminRepository.save(existingTermin)).thenReturn(updatedTermin);

        // No existing clicks
        when(clicksRepo.existsById(tnr)).thenReturn(false);

        // Mock the createClicksForTermin method
        Clicks newClicks = new Clicks();
        newClicks.setTnr(tnr);
        newClicks.setVorstellungsbeginn(updatedTermin.getVorstellungsbeginn());
        newClicks.setWithTerminbesonderheit(updatedTermin.getBesonderheit() != null && !updatedTermin.getBesonderheit().isEmpty());
        newClicks.setInNumberReihen((short) updatedTermin.getReihen().size());

        when(clicksRepo.save(any(Clicks.class))).thenReturn(newClicks);
        when(clicksRepo.findById(tnr)).thenReturn(Optional.of(newClicks));

        // Act
        TerminDTOForm result = terminService.updateTermin(tnr, terminDetails);

        // Assert
        assertNotNull(result);
        assertEquals(updatedTermin.getTnr(), result.getTnr());
        assertEquals(updatedTermin.getTitel(), result.getTitel());

        // Verify method invocations
        verify(terminRepository).findById(tnr);
        verify(terminRepository).save(existingTermin);
        verify(clicksRepo).existsById(tnr);

        // Verify clicks are saved twice (creation and update)
        verify(clicksRepo, times(2)).save(any(Clicks.class));

        // Verify that findById is called for clicks update
        verify(clicksRepo).findById(tnr);
    }

    @Test
    void updateTermin_withVeroeffentlichenAndExistingClicks_doesNotCreateDuplicateClicks() {
        // Arrange
        Long tnr = 1L;

        // Existing Termin
        Termin existingTermin = new Termin();
        existingTermin.setTnr(tnr);
        existingTermin.setTitel("Old Title");
        existingTermin.setVeroeffentlichen((short) 1);
        existingTermin.setReihen(new HashSet<>()); // Empty list to simulate reihen
        existingTermin.setVorstellungsbeginn(LocalDateTime.now());
        existingTermin.setBesonderheit("Some special feature");

        // Termin details to update
        Termin terminDetails = new Termin();
        terminDetails.setTitel("New Title");
        terminDetails.setVeroeffentlichen((short) 1);
        terminDetails.setVorstellungsbeginn(existingTermin.getVorstellungsbeginn());
        terminDetails.setBesonderheit(existingTermin.getBesonderheit());

        // Mocked Clicks
        Clicks existingClicks = new Clicks();
        existingClicks.setTnr(tnr);

        // Mocking repository behaviors
        when(terminRepository.findById(tnr)).thenReturn(Optional.of(existingTermin));
        when(terminRepository.save(existingTermin)).thenReturn(existingTermin);
        when(clicksRepo.existsById(tnr)).thenReturn(true);
        when(clicksRepo.findById(tnr)).thenReturn(Optional.of(existingClicks));
        when(clicksRepo.save(any(Clicks.class))).thenReturn(existingClicks);

        // Act
        TerminDTOForm result = terminService.updateTermin(tnr, terminDetails);

        // Assert
        assertNotNull(result);
        assertEquals(tnr, result.getTnr());

        // Verify method invocations
        verify(terminRepository).findById(tnr);
        verify(terminRepository).save(existingTermin);
        verify(clicksRepo).existsById(tnr);
        verify(clicksRepo).findById(tnr);

        // Verify that clicks are updated (save is called), but not created from scratch
        verify(clicksRepo).save(any(Clicks.class));
        verify(clicksRepo, times(1)).existsById(tnr);
        verify(clicksRepo, times(1)).findById(tnr);
    }

    @Test
    void updateTermin_withoutVeroeffentlichen_doesNotCreateClicks() {
        Long tnr = 1L;
        Termin existingTermin = new Termin();
        existingTermin.setTnr(tnr);
        existingTermin.setTitel("Old Title");

        Termin terminDetails = new Termin();
        terminDetails.setTitel("New Title");
        terminDetails.setVeroeffentlichen(null); // or 0

        Termin updatedTermin = new Termin();
        updatedTermin.setTnr(tnr);
        updatedTermin.setTitel("New Title");
        updatedTermin.setVeroeffentlichen(null);

        when(terminRepository.findById(tnr)).thenReturn(Optional.of(existingTermin));
        when(terminRepository.save(existingTermin)).thenReturn(updatedTermin);

        TerminDTOForm result = terminService.updateTermin(tnr, terminDetails);

        assertNotNull(result);
        assertEquals(updatedTermin.getTnr(), result.getTnr());

        verify(terminRepository).findById(tnr);
        verify(terminRepository).save(existingTermin);
        verify(clicksRepo, never()).existsById(any());
        verify(clicksRepo, never()).save(any(Clicks.class));
    }

    @Test
    void deleteTermin_removesRelationshipsAndDeletes() {
        Termin termin = mock(Termin.class);
        Reihe reihe = mock(Reihe.class);

        Set<Reihe> reihen = new HashSet<>(List.of(reihe));
        when(termin.getReihen()).thenReturn(reihen);

        Set<Termin> termine = mock(HashSet.class);
        when(reihe.getTermine()).thenReturn(termine);

        when(terminRepository.findById(2L)).thenReturn(Optional.of(termin));

        terminService.deleteTermin(2L);

        verify(reihe).getTermine(); // verify that the getTermine method was called on the reihe mock object
        verify(termine).remove(termin);
        verify(terminRepository).deleteById(2L);
    }
}
