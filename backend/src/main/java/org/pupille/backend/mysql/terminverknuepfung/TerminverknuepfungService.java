package org.pupille.backend.mysql.terminverknuepfung;

import jakarta.persistence.EntityNotFoundException;
import org.pupille.backend.mysql.film.Film;
import org.pupille.backend.mysql.film.FilmRepository;
import org.pupille.backend.mysql.termin.Termin;
import org.pupille.backend.mysql.termin.TerminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TerminverknuepfungService {

    private final FilmRepository filmRepository;
    private final TerminRepository terminRepository;
    private final TerminverknuepfungRepository terminverknuepfungRepository;

    @Autowired
    public TerminverknuepfungService(FilmRepository filmRepository,
                                     TerminRepository terminRepository,
                                     TerminverknuepfungRepository terminverknuepfungRepository) {
        this.filmRepository = filmRepository;
        this.terminRepository = terminRepository;
        this.terminverknuepfungRepository = terminverknuepfungRepository;
    }


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


    public Optional<TerminverknuepfungDTOSelection> getTerminverknuepfungById(Terminverknuepfung.TerminverknuepfungId id) {
        return Optional.of( new TerminverknuepfungDTOSelection(terminverknuepfungRepository.findById(id).get()) );
    }


    // this simple saving doesn't work because of the relationships of Terminverknuepfung entity!
    public Terminverknuepfung saveTerminverknuepfung(Terminverknuepfung terminverknuepfung) {
        return terminverknuepfungRepository.save(terminverknuepfung);
    }

//    // this "traditional" update does not work, because in the update we want to change the composite key of tnr and fnr
//    // when I pass the new tnr-fnr-pair the method terminverknuepfungRepository.findById(id) won't find it
//    // beside, JPA (in the standard/default setting) doesn't allow changes in the primary key
//    public TerminverknuepfungDTOSelection updateTerminverknuepfung(
//                  Long tnr, Long fnr,
//                  TerminverknuepfungDTOSelection updatingTV
//    ) {
//        Terminverknuepfung.TerminverknuepfungId id =
//                new Terminverknuepfung.TerminverknuepfungId(tnr, fnr);
//
//        return terminverknuepfungRepository.findById(id)
//                .map(existing -> {
//                    existing.setVorfilm(updatingTV.vorfilm());
//                    existing.setRang(updatingTV.rang());
//                    Terminverknuepfung updated = terminverknuepfungRepository.save(existing);
//                    return new TerminverknuepfungDTOSelection(updated);
//                })
//                .orElseThrow(() -> new EntityNotFoundException(
//                        "Terminverknuepfung not found with tnr: " + tnr + " and fnr: " + fnr));
//    }

    @Transactional
    public TerminverknuepfungDTOSelection updateTerminverknuepfung(
            Long oldTnr, Long oldFnr,
            TerminverknuepfungDTOSelection newTV
    ) {
        // 1. Delete the old entity
        Terminverknuepfung.TerminverknuepfungId oldId =
                new Terminverknuepfung.TerminverknuepfungId(oldTnr, oldFnr);
        if (!terminverknuepfungRepository.existsById(oldId)) {
            throw new EntityNotFoundException("No Terminverknuepfung found for old key");
        }
        terminverknuepfungRepository.deleteById(oldId);

        // 2. Create and save the new entity
        Film film = filmRepository.findById(newTV.fnr())
                .orElseThrow(() -> new RuntimeException("Film not found"));
        Termin termin = terminRepository.findById(newTV.tnr())
                .orElseThrow(() -> new RuntimeException("Termin not found"));

        Terminverknuepfung newEntity = new Terminverknuepfung();
        newEntity.setTnr(newTV.tnr());
        newEntity.setFnr(newTV.fnr());
        newEntity.setVorfilm(newTV.vorfilm());
        newEntity.setRang(newTV.rang());
        newEntity.setFilm(film);
        newEntity.setTermin(termin);

        Terminverknuepfung saved = terminverknuepfungRepository.save(newEntity);
        return new TerminverknuepfungDTOSelection(saved);
    }


    public void deleteTerminverknuepfung(Terminverknuepfung.TerminverknuepfungId deletingTVId) {
        terminverknuepfungRepository.deleteById(deletingTVId);
    }

    //    #############################################################

    // this represents the usual add or save function for new Terminverknuepfung
    // since Terminverknuepfung has relationships a simple save is not enough
    // and more relationship management needs to be done to keep the (relationship) data consistent
    @Transactional
    public void linkExistingFilmToExistingTermin(TerminverknuepfungDTOSelection newTV) {
        Film existingFilm = filmRepository.findById(newTV.fnr())
                .orElseThrow(() -> new RuntimeException("Film not found with ID: " + newTV.fnr()));

        Termin existingTermin = terminRepository.findById(newTV.tnr())
                .orElseThrow(() -> new RuntimeException("Termin not found with ID: " + newTV.tnr()));

        // ID check remains critical
        if (terminverknuepfungRepository.existsById(new Terminverknuepfung.TerminverknuepfungId(newTV.tnr(), newTV.fnr()))) {
            throw new RuntimeException("Link already exists");
        }

        Terminverknuepfung connection = new Terminverknuepfung();
        connection.setFilm(existingFilm);
        connection.setTermin(existingTermin);
        connection.setVorfilm(newTV.vorfilm());
        connection.setRang(newTV.rang());

        // Remove bidirectional relationship management
        terminverknuepfungRepository.save(connection);
    }

    //    #############################################################

    public List<TVWithFilmAndTerminDTOSelection> getAllTVwithFilmAndTermin() {
        return terminverknuepfungRepository.findAllWithFilmAndTermin()
                .stream()
                .map(TVWithFilmAndTerminDTOSelection::new)
                .collect(Collectors.toList());
    }

//    // some processing on the Film data using the extractDirectors(film.getStab()) method i.e. the FilmDTOSelection contains a specifically processed version of the film's directors.
//    public List<TVwithFilmAndTerminDTOSelection> getAllTVwithFilmAndTermin() {
//        List<Terminverknuepfung> terminverknuepfungen = terminverknuepfungRepository.findAllWithFilmAndTermin();
//
//        return terminverknuepfungen.stream()
//                .map(tv -> {
//                    Film film = tv.getFilm();
//                    Termin termin = tv.getTermin();
//
//                    // Create processed FilmDTOSelection
//                    FilmDTOSelection filmDTO = new FilmDTOSelection(
//                            film.getFnr(),
//                            film.getTitel(),
//                            film.getJahr(),
//                            extractDirectors(film.getStab())  // Apply processing
//                    );
//
//                    // Create Termin projection
//                    TerminProjectionSelection terminProjection = new TerminProjectionSelection() {
//                        @Override public Long getTnr() { return termin.getTnr(); }
//                        @Override public LocalDateTime getTermin() { return termin.getTermin(); }
//                        @Override public String getTitel() { return termin.getTitel(); }
//                    };
//
//                    return new TVwithFilmAndTerminDTOSelection(
//                            tv.getTnr(),
//                            tv.getFnr(),
//                            tv.getVorfilm(),
//                            tv.getRang(),
//                            filmDTO,
//                            terminProjection
//                    );
//                })
//                .collect(Collectors.toList());
//    }


    public TVWithFilmAndTerminDTOSelection getTVwithFilmAndTerminbyTnrAndFnr(Long tnr, Long fnr) {
        return terminverknuepfungRepository.findWithFilmAndTerminByTnrAndFnr(tnr, fnr)
                .map(TVWithFilmAndTerminDTOSelection::new)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Terminverknüpfung not found with tnr: " + tnr + " and fnr: " + fnr
                ));
    }


    public List<TVWithFilmAndTerminDTOSelection> getAllTVwithFilmAndTerminSortedByTermin() {
        return terminverknuepfungRepository.findAllWithFilmAndTerminOrderByTerminDesc()
                .stream()
                .map(TVWithFilmAndTerminDTOSelection::new)
                .collect(Collectors.toList());
    }
}
