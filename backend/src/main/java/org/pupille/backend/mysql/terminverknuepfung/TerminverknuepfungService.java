package org.pupille.backend.mysql.terminverknuepfung;

import jakarta.persistence.EntityNotFoundException;
import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.film.FilmDTOSelection;
import org.pupille.backend.mysql.film.FilmRepository;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminProjectionSelection;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TerminverknuepfungService {

    private final FilmRepository filmRepository;
    private final TerminRepository terminRepository;
    private final TerminverknuepfungRepository terminverknuepfungRepository;

    //@Autowired
    public TerminverknuepfungService(FilmRepository filmRepository,
                                     TerminRepository terminRepository,
                                     TerminverknuepfungRepository terminverknuepfungRepository) {
        this.filmRepository = filmRepository;
        this.terminRepository = terminRepository;
        this.terminverknuepfungRepository = terminverknuepfungRepository;
    }

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // it seems there's no real usage for these 3 methods, which are only called in the "plain" endpoints in TerminverknuepfungController
    public List<TerminverknuepfungDTOSelection> getAllTerminverknuepfung() {
        List<Terminverknuepfung> terminverknuepfungen = terminverknuepfungRepository.findAll();
        return terminverknuepfungen.stream()
                .map(TerminverknuepfungDTOSelection::new)
                .collect(Collectors.toList());
    }

    public List<TerminverknuepfungDTOSelection> getAllTVByOrderByTnrDesc() {
        List<Terminverknuepfung> terminverknuepfungen = terminverknuepfungRepository.findAllByOrderByTnrDesc();
        return terminverknuepfungen.stream()
                .map(TerminverknuepfungDTOSelection::new)
                .collect(Collectors.toList());
    }

    public Optional<TerminverknuepfungDTOSelection> getTVById(Terminverknuepfung.TerminverknuepfungId id) {
        Optional<Terminverknuepfung> optionalTV = terminverknuepfungRepository.findById(id);
        return optionalTV.map(TerminverknuepfungDTOSelection::new);
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    public List<TVWithFilmAndTerminDTOSelection> getAllTVWithFilmAndTermin() {
        return terminverknuepfungRepository.findAllWithFilmAndTermin()
                .stream()
                .map(TVWithFilmAndTerminDTOSelection::new)
                .collect(Collectors.toList());
    }

    public List<TVWithFilmAndTerminDTOSelection> getAllTVWithFilmAndTerminSortedByTerminDesc() {
        return terminverknuepfungRepository.findAllWithFilmAndTerminOrderByTerminDesc()
                .stream()
                .map(TVWithFilmAndTerminDTOSelection::new)
                .collect(Collectors.toList());
    }

    public TVWithFilmAndTerminDTOSelection getTVWithFilmAndTerminByTnrAndFnr(Long tnr, Long fnr) {
        return terminverknuepfungRepository.findWithFilmAndTerminByTnrAndFnr(tnr, fnr)
                .map(TVWithFilmAndTerminDTOSelection::new)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Terminverknüpfung not found with tnr: " + tnr + " and fnr: " + fnr
                ));
    }

    // ---------------------------------------------------------------------------------------------
    // two methods for fetching list of filme (termine) when giving tnr (fnr)
    // the first one: getFilmlistByTnr uses a simple repo method and a constructor to create FilmDTOSelection objects
    // the second one: getTerminlistByFnr contains logic in the repo method (see SELECT in @Query) to return TerminProjectionSelection objects
    public List<FilmDTOSelection> getFilmlistByTnr(Long tnr) {
        List<Terminverknuepfung> fnrList = terminverknuepfungRepository.findByTnrWithFilms(tnr);
        List<FilmDTOSelection> filmList = new ArrayList<>();

        for (Terminverknuepfung tv : fnrList) {
            Film film = tv.getFilm();
            filmList.add( new FilmDTOSelection(film) );
        }
        return filmList;
    }

    public List<TerminProjectionSelection> getTerminlistByFnr(Long fnr) {
        return terminverknuepfungRepository.findTermineByFilmFnr(fnr);
    }
    // ---------------------------------------------------------------------------------------------

    //    #############################################################
    //    #############################################################

//    // this "traditional" update does not work, because only vorfilm and rang can be amended in this implementation below
//    // when new relationships with film or termin are formed (which also changes composite key TerminverknuepfungId(tnr, fnr) of the tv to be updated) nothing will change because in the request the old relationships are sent
//    // besides: JPA (in the standard/default setting) doesn't allow changes in the primary key
//    @Transactional
//    public TerminverknuepfungDTOSelection updateTerminverknuepfung(
//                  Long tnr, Long fnr,
//                  TerminverknuepfungDTOSelection updatingTVDTO
//    ) {
//        Terminverknuepfung.TerminverknuepfungId id =
//                new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
//
//        return terminverknuepfungRepository.findById(id)
//                .map(existing -> {
//                    existing.setVorfilm(updatingTVDTO.vorfilm());
//                    existing.setRang(updatingTVDTO.rang());
//                    Terminverknuepfung updated = terminverknuepfungRepository.save(existing);
//                    return new TerminverknuepfungDTOSelection(updated);
//                })
//                .orElseThrow(() -> new EntityNotFoundException(
//                        "Terminverknuepfung not found with tnr: " + tnr + " and fnr: " + fnr));
//    }

    // THIS update method works!
    // since Terminverknuepfung has relationships (i.e. fields film and termin) a simple save is not enough
    // and more relationship management needs to be done to keep the (relationship) data consistent
    @Transactional
    public TerminverknuepfungDTOSelection updateTerminverknuepfung(
            Long oldTnr, Long oldFnr,
            TerminverknuepfungDTOSelection updatingTVDTO
    ) {
        // 1. Delete the old entity
        Terminverknuepfung.TerminverknuepfungId oldId = new Terminverknuepfung.TerminverknuepfungId(oldTnr, oldFnr);
        if (!terminverknuepfungRepository.existsById(oldId)) {
            throw new EntityNotFoundException(String.format("No Terminverknuepfung found for old key (%d, %d)", oldTnr, oldFnr));
        }
        terminverknuepfungRepository.deleteById(oldId);

        // 2. Create and save the new entity
        //      If RuntimeException occurs during step 2, because of @Transactional the whole transaction rolls back, so the delete operation is reverted.
        Film film = filmRepository.findById(updatingTVDTO.fnr())
                .orElseThrow(() -> new RuntimeException("Film not found"));
        Termin termin = terminRepository.findById(updatingTVDTO.tnr())
                .orElseThrow(() -> new RuntimeException("Termin not found"));

        Terminverknuepfung newTV = new Terminverknuepfung();
        // newTV.setTnr(updatingTVDTO.tnr()); // Redundant - JPA does this automatically because of the @MapsId("tnr") in Terminverknuepfung.class
        // newTV.setFnr(updatingTVDTO.fnr()); // Redundant - JPA does this automatically because of the @MapsId("fnr") in Terminverknuepfung.class
        newTV.setVorfilm(updatingTVDTO.vorfilm());
        newTV.setRang(updatingTVDTO.rang());
        newTV.setTermin(termin);
        newTV.setFilm(film);

        Terminverknuepfung saved = terminverknuepfungRepository.save(newTV);
        return new TerminverknuepfungDTOSelection(saved);
    }

                                                         // TerminverknuepfungId is a class within Terminverknuepfung!
    public void deleteTerminverknuepfung(Terminverknuepfung.TerminverknuepfungId deletingTVId) {
        terminverknuepfungRepository.deleteById(deletingTVId);
    }

//    // this simple saving/creating doesn't work because of the relationships of Terminverknuepfung entity!
//    public Terminverknuepfung saveTerminverknuepfung(Terminverknuepfung terminverknuepfung) {
//        return terminverknuepfungRepository.save(terminverknuepfung);
//    }

    // THIS represents the add or save function for new Terminverknuepfung (requires more logic than ordinary)
    // since Terminverknuepfung has relationships a simple save is not enough
    // and more relationship management needs to be done to keep the (relationship) data consistent
    @Transactional
    public void linkExistingFilmToExistingTermin(TerminverknuepfungDTOSelection newTVDTO) {
        Film existingFilm = filmRepository.findById(newTVDTO.fnr())
                .orElseThrow(() -> new RuntimeException("Film not found with ID: " + newTVDTO.fnr()));

        Termin existingTermin = terminRepository.findById(newTVDTO.tnr())
                .orElseThrow(() -> new RuntimeException("Termin not found with ID: " + newTVDTO.tnr()));

        // ID check remains critical
        if (terminverknuepfungRepository.existsById(new Terminverknuepfung.TerminverknuepfungId(newTVDTO.tnr(), newTVDTO.fnr()))) {
            throw new RuntimeException("Link already exists");
        }

        Terminverknuepfung newTV = new Terminverknuepfung();
        // newTV.setTnr(updatingTVDTO.tnr()); // Redundant - JPA does this automatically because of the @MapsId("tnr") in Terminverknuepfung.class
        // newTV.setFnr(updatingTVDTO.fnr()); // Redundant - JPA does this automatically because of the @MapsId("fnr") in Terminverknuepfung.class
        newTV.setTermin(existingTermin);
        newTV.setFilm(existingFilm);
        newTV.setVorfilm(newTVDTO.vorfilm());
        newTV.setRang(newTVDTO.rang());

        // Remove bidirectional relationship management
        terminverknuepfungRepository.save(newTV);
    }
    //    #############################################################
    //    #############################################################

}