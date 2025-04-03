package org.pupille.backend.mysql.termin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TerminService {

    private final TerminRepository terminRepository;

    @Autowired
    public TerminService(TerminRepository terminRepository) {
        this.terminRepository = terminRepository;
    }

    public List<Termin> getAllTermine() {
        return terminRepository.findAll();
    }

    public Optional<Termin> getTerminById(Integer tnr) {
        return terminRepository.findById(tnr);
    }

    public Termin createTermin(Termin termin) {
        // Do NOT set termin.setTnr(someValue) because we use auto-increment in the db
        return terminRepository.save(termin);
    }

    public Termin updateTermin(Integer tnr, Termin terminDetails) {
        return terminRepository.findById(tnr)
                .map(termin -> {
                    termin.setTermin(terminDetails.getTermin());
                    termin.setTitel(terminDetails.getTitel());
                    termin.setText(terminDetails.getText());
                    // Update all other fields similarly
                    return terminRepository.save(termin);
                })
                .orElseThrow(() -> new RuntimeException("Termin not found"));
    }

    public void deleteTermin(Integer tnr) {
        terminRepository.deleteById(tnr);
    }
}

