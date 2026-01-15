package org.pupille.backend.mysql.survey.umfrage;

import org.pupille.backend.mysql.survey.SurveyMapper;
import org.pupille.backend.mysql.survey.auswahloption.Auswahloption;
import org.pupille.backend.mysql.survey.auswahloption.AuswahloptionNestedDTO;
import org.pupille.backend.mysql.survey.exception.UmfrageNotFoundException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// approach here (using @ExtendWith, @Nested, and AssertJ) is generally considered the more modern and maintainable "Spring Boot Professional" standard
// but testing technique in TerminServiceTest is perfectly valid and functional code

@ExtendWith(MockitoExtension.class)
class UmfrageServiceTest {

    @Mock
    private UmfrageRepository umfrageRepository;

    @Mock
    private SurveyMapper surveyMapper;

    @InjectMocks
    private UmfrageService umfrageService;

    // --- Helper Methods to create Dummy Data ---
    private Umfrage createDummyEntity(Long id) {
        Umfrage u = new Umfrage();
        u.setUnr(id);
        u.setAnlass("Test Umfrage");
        u.setEndDatum(LocalDate.now().plusDays(7));
        u.setBeschreibung("Beschreibung");
        u.setAuswahloptionen(new ArrayList<>());
        return u;
    }

    private UmfrageDTO createDummyDto(Long id) {
        UmfrageDTO dto = new UmfrageDTO();
        dto.setUnr(id);
        dto.setAnlass("Test Umfrage");
        dto.setEndDatum(LocalDate.now().plusDays(7));
        dto.setBeschreibung("Beschreibung");
        dto.setAuswahloptionendtos(new ArrayList<>());
        return dto;
    }

    @Nested
    @DisplayName("Tests for getAllUmfragenForSelection")
    class GetAllTests {

        @Test
        @DisplayName("Should return list of selection DTOs sorted by endDatum DESC")
        void shouldReturnSortedSelectionList() {
            // Arrange
            Umfrage entity1 = createDummyEntity(1L);
            Umfrage entity2 = createDummyEntity(2L);
            List<Umfrage> entities = List.of(entity1, entity2);

            UmfrageSelectionDTO selDto1 = new UmfrageSelectionDTO();
            selDto1.setUnr(1L);
            UmfrageSelectionDTO selDto2 = new UmfrageSelectionDTO();
            selDto2.setUnr(2L);

            // Mock Repository call with specific Sort
            when(umfrageRepository.findAll(Sort.by(Sort.Direction.DESC, "endDatum")))
                    .thenReturn(entities);

            // Mock Mapper calls
            when(surveyMapper.toUmfrageSelectionDto(entity1)).thenReturn(selDto1);
            when(surveyMapper.toUmfrageSelectionDto(entity2)).thenReturn(selDto2);

            // Act
            List<UmfrageSelectionDTO> result = umfrageService.getAllUmfragenForSelection();

            // Assert
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getUnr()).isEqualTo(1L);
            verify(umfrageRepository).findAll(any(Sort.class));
        }
    }

    @Nested
    @DisplayName("Tests for getUmfrageById")
    class GetByIdTests {

        @Test
        @DisplayName("Should return DTO when found")
        void shouldReturnDtoWhenFound() {
            // Arrange
            Long id = 1L;
            Umfrage entity = createDummyEntity(id);
            UmfrageDTO dto = createDummyDto(id);

            when(umfrageRepository.findById(id)).thenReturn(Optional.of(entity));
            when(surveyMapper.toUmfrageDto(entity)).thenReturn(dto);

            // Act
            UmfrageDTO result = umfrageService.getUmfrageById(id);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getUnr()).isEqualTo(id);
        }

        @Test
        @DisplayName("Should throw Exception when not found")
        void shouldThrowExceptionWhenNotFound() {
            // Arrange
            Long id = 99L;
            when(umfrageRepository.findById(id)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> umfrageService.getUmfrageById(id))
                    .isInstanceOf(UmfrageNotFoundException.class)
                    .hasMessageContaining("Umfrage not found: 99");
        }
    }

    @Nested
    @DisplayName("Tests for createUmfrage")
    class CreateTests {

        @Test
        @DisplayName("Should create Umfrage with nested options")
        void shouldCreateUmfrageWithNestedOptions() {
            // Arrange
            UmfrageDTO inputDto = createDummyDto(null);

            // Add a nested option DTO
            AuswahloptionNestedDTO optDto = new AuswahloptionNestedDTO();
            optDto.setTitel("Option A");
            inputDto.setAuswahloptionendtos(List.of(optDto));

            Umfrage mappedEntity = createDummyEntity(null);
            // Mapper usually returns entity without children from DTO (as per your code comment)

            Auswahloption optEntity = new Auswahloption();
            optEntity.setTitel("Option A");

            Umfrage savedEntity = createDummyEntity(1L);
            savedEntity.getAuswahloptionen().add(optEntity);

            UmfrageDTO resultDto = createDummyDto(1L);

            // Mocking
            when(surveyMapper.toUmfrageEntity(inputDto)).thenReturn(mappedEntity);
            when(surveyMapper.toAuswahloptionEntity(optDto)).thenReturn(optEntity);
            when(umfrageRepository.save(mappedEntity)).thenReturn(savedEntity);
            when(surveyMapper.toUmfrageDto(savedEntity)).thenReturn(resultDto);

            // Act
            UmfrageDTO result = umfrageService.createUmfrage(inputDto);

            // Assert
            assertThat(result).isNotNull();

            // Verify parent-child linkage happened
            verify(surveyMapper).toAuswahloptionEntity(optDto);
            // Check that the child was added to the parent's list
            assertThat(mappedEntity.getAuswahloptionen()).contains(optEntity);
            // Check that the parent was set on the child
            assertThat(optEntity.getUmfrage()).isEqualTo(mappedEntity);

            verify(umfrageRepository).save(mappedEntity);
        }
    }

    @Nested
    @DisplayName("Tests for updateUmfrage")
    class UpdateTests {

        @Test
        @DisplayName("Should update fields, add new options, and remove orphans")
        void shouldUpdateComplexLogic() {
            // Arrange
            Long umfrageId = 1L;

            // Existing Entity in DB: Has Option 10 (keep) and Option 20 (remove)
            Umfrage existingEntity = createDummyEntity(umfrageId);

            Auswahloption existingOptKeep = new Auswahloption();
            existingOptKeep.setOnr(10L);
            existingOptKeep.setTitel("Old Title");
            existingOptKeep.setUmfrage(existingEntity);

            Auswahloption existingOptRemove = new Auswahloption();
            existingOptRemove.setOnr(20L);
            existingOptRemove.setTitel("To be removed");
            existingOptRemove.setUmfrage(existingEntity);

            existingEntity.getAuswahloptionen().add(existingOptKeep);
            existingEntity.getAuswahloptionen().add(existingOptRemove);

            // Input DTO: Updates Option 10, Adds Option New
            UmfrageDTO inputDto = createDummyDto(umfrageId);
            inputDto.setAnlass("Updated Anlass");

            AuswahloptionNestedDTO updateOptDto = new AuswahloptionNestedDTO();
            updateOptDto.setOnr(10L);
            updateOptDto.setTitel("Updated Title"); // Changed title

            AuswahloptionNestedDTO newOptDto = new AuswahloptionNestedDTO();
            newOptDto.setOnr(null); // New one
            newOptDto.setTitel("New Option");

            inputDto.setAuswahloptionendtos(List.of(updateOptDto, newOptDto));

            // New Child Entity for the new DTO
            Auswahloption newOptEntity = new Auswahloption();
            newOptEntity.setTitel("New Option");

            // Mocking
            when(umfrageRepository.findById(umfrageId)).thenReturn(Optional.of(existingEntity));
            when(surveyMapper.toAuswahloptionEntity(newOptDto)).thenReturn(newOptEntity);
            when(umfrageRepository.save(any(Umfrage.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Return what was saved
            when(surveyMapper.toUmfrageDto(any(Umfrage.class))).thenReturn(inputDto); // Simplified return

            // Act
            umfrageService.updateUmfrage(umfrageId, inputDto);

            // Assert & Verify

            // 1. Verify simple fields updated
            assertThat(existingEntity.getAnlass()).isEqualTo("Updated Anlass");

            // 2. Verify List structure
            // Should contain 2 elements: Option 10 (updated) and New Option. Option 20 should be gone.
            List<Auswahloption> finalOptions = existingEntity.getAuswahloptionen();
            assertThat(finalOptions).hasSize(2);

            // Check Update
            Auswahloption updatedOpt = finalOptions.stream().filter(o -> o.getOnr() != null && o.getOnr().equals(10L)).findFirst().get();
            assertThat(updatedOpt.getTitel()).isEqualTo("Updated Title"); // Verify setter was called

            // Check Add
            Auswahloption newOpt = finalOptions.stream().filter(o -> o.getTitel().equals("New Option")).findFirst().get();
            assertThat(newOpt.getUmfrage()).isEqualTo(existingEntity); // Verify parent set

            // Check Removal (Option 20 should not be in the list)
            boolean hasOption20 = finalOptions.stream().anyMatch(o -> o.getOnr() != null && o.getOnr().equals(20L));
            assertThat(hasOption20).isFalse();
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent umfrage")
        void shouldThrowExceptionOnUpdateNotFound() {
            when(umfrageRepository.findById(99L)).thenReturn(Optional.empty());
            UmfrageDTO dto = new UmfrageDTO();

            assertThatThrownBy(() -> umfrageService.updateUmfrage(99L, dto))
                    .isInstanceOf(UmfrageNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Tests for deleteUmfrage")
    class DeleteTests {

        @Test
        @DisplayName("Should delete when found")
        void shouldDeleteWhenFound() {
            Long id = 1L;
            when(umfrageRepository.existsById(id)).thenReturn(true);

            umfrageService.deleteUmfrage(id);

            verify(umfrageRepository).deleteById(id);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent umfrage")
        void shouldThrowExceptionOnDeleteNotFound() {
            Long id = 99L;
            when(umfrageRepository.existsById(id)).thenReturn(false);

            assertThatThrownBy(() -> umfrageService.deleteUmfrage(id))
                    .isInstanceOf(UmfrageNotFoundException.class);

            verify(umfrageRepository, never()).deleteById(any());
        }
    }
}
