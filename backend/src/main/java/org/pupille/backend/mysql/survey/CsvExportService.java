package org.pupille.backend.mysql.survey;

import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.pupille.backend.mysql.survey.stimmabgabe.StimmabgabeByUmfrageDTO;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvExportService {

    public void exportVotes(List<StimmabgabeByUmfrageDTO> votes, OutputStream outputStream) {
        try (CSVPrinter printer = new CSVPrinter(
                new OutputStreamWriter(outputStream, StandardCharsets.UTF_8),
                CSVFormat.DEFAULT.withHeader("snr", "datum", "onr", "auswahloption_titel",
                        "auswahloption_details", "is_session_duplicate", "is_user_duplicate"))) {

            votes.forEach(vote -> {
                try {
                    printer.printRecord(
                            vote.getSnr(),
                            vote.getDatum(),
                            vote.getOnr(),
                            vote.getAuswahloptionTitel(),
                            vote.getAuswahloptionDetails(),
                            vote.getIsSessionDuplicate(),
                            vote.getIsUserDuplicate()
                    );
                } catch (IOException e) {
                    throw new RuntimeException("Error writing CSV row", e);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
}
