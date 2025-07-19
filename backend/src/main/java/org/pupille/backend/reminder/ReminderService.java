package org.pupille.backend.reminder;

import org.pupille.backend.contact.ContactService;
import org.pupille.backend.mysql.screening.FilmDTOMailReminder;
import org.pupille.backend.mysql.screening.ScreeningService;
import org.pupille.backend.mysql.screening.TerminDTOWithFilmDTOMailReminder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class ReminderService {

//    // service method using rest client):
//    // ''''''''''''''''''''''''''''''''''
//    private final RestClient restClient;
//    private final ContactService contactService;
//
//    public ReminderService(RestClient.Builder restClient, ContactService contactService) {
//        this.restClient = restClient
//                .baseUrl("http://localhost:8080") // <--- Add your API's base URL here
//                .build();
//
//        this.contactService = contactService;
//    }
//
//    @Scheduled(cron = "45 23 1 * * *", zone = "Europe/Berlin")
//    public void scheduledReminder() {
//
//        final int FUTURE_DAYS = 10;
//        List<TerminDTOWithFilmDTOMailReminder> futureScreenings = restClient.get()
//                .uri("/api/screenings/future/{days}", FUTURE_DAYS)
//                .retrieve()
//                .body(new ParameterizedTypeReference<>() {});
//
//        if (futureScreenings != null && !futureScreenings.isEmpty()) {
//                                                      // .isEmpty() returns true if the list contains no elements,  returns false if the list contains one or more elements.
//            for (TerminDTOWithFilmDTOMailReminder screening : futureScreenings) {
//
//                // check if an email is present in patenschaft field in Termin object
//                if (screening.patenschaft() == null || screening.patenschaft().trim().isEmpty()) {
//                    //preparation of input parameters for contactService.sendReminder, which sends the mail
//                    String titel = screening.titel();
//
//                    // if it's not a programmtermin, but a Standardtermin (i.e. 1 main feature + optional short film(s)) take the film titel of the 1st feature
//                    if (titel == null || titel.trim().isEmpty()) {
//                        List<FilmDTOMailReminder> mainfilms = screening.mainfilms();
//                        if (mainfilms != null && !mainfilms.isEmpty()) {
//                            titel = mainfilms.get(0).titel();
//                        }
//                    }
//
//                    contactService.sendReminder(
//                            FUTURE_DAYS,
//                            screening.vorstellungsbeginn().toString(),
//                            titel,
//                            "quy8vuong@gmail.com",
//                            true
//                    );
//                }
//            }
//        }
//
//        // ######################################################
//
//        final int PAST_DAYS = 7;
//        List<TerminDTOWithFilmDTOMailReminder> pastScreenings = restClient.get()
//                .uri("/api/screenings/past/{days}", PAST_DAYS)
//                .retrieve()
//                .body(new ParameterizedTypeReference<>() {});
//
//        if (pastScreenings != null && !pastScreenings.isEmpty()) {
//                                                  // .isEmpty() returns true if the list contains no elements,  returns false if the list contains one or more elements.
//            for (TerminDTOWithFilmDTOMailReminder screening : pastScreenings) {
//
//                // check if an email is present in patenschaft field in Termin object
//                if (screening.patenschaft() == null || screening.patenschaft().trim().isEmpty()) {
//                    //preparation of input parameters for contactService.sendReminder, which sends the mail
//                    String titel = screening.titel();
//
//                    // if it's not a programmtermin, but a Standardtermin (i.e. 1 main feature + optional short film(s)) take the film titel of the 1st feature
//                    if (titel == null || titel.trim().isEmpty()) {
//                        List<FilmDTOMailReminder> mainfilms = screening.mainfilms();
//                        if (mainfilms != null && !mainfilms.isEmpty()) {
//                            titel = mainfilms.get(0).titel();
//                        }
//                    }
//
//                    contactService.sendReminder(
//                            PAST_DAYS,
//                            screening.vorstellungsbeginn().toString(),
//                            titel,
//                            "quy8vuong@gmail.com",
//                            false
//                    );
//                }
//            }
//        }
//    }

    // service methods using ScreeningService directly):
    // '''''''''''''''''''''''''''''''''''''''''''''''''
    private final ContactService contactService;
    private final ScreeningService screeningService;

    public ReminderService(ContactService contactService, ScreeningService screeningService) {
        this.contactService = contactService;
        this.screeningService = screeningService;
    }

    @Scheduled(cron = "45 23 1 * * *", zone = "Europe/Berlin")
    public void periodicFetchAndEmail() {

        final int FUTURE_DAYS = 10;

        List<TerminDTOWithFilmDTOMailReminder> futureScreenings = screeningService.getTermineDaysInFuture(FUTURE_DAYS);

        if (futureScreenings != null && !futureScreenings.isEmpty()) {
            // .isEmpty() returns true if the list contains no elements,  returns false if the list contains one or more elements.
            for (TerminDTOWithFilmDTOMailReminder screening : futureScreenings) {

                // check if an email is present in patenschaft field in Termin object
                if (screening.patenschaft() != null && !screening.patenschaft().trim().isEmpty()) {
                    //preparation of input parameters for contactService.sendReminder, which sends the mail
                    String titel = screening.titel();

                    // if it's not a programmtermin, but a Standardtermin (i.e. 1 main feature + optional short film(s)) take the film titel of the 1st feature
                    if (titel == null || titel.trim().isEmpty()) {
                        List<FilmDTOMailReminder> mainfilms = screening.mainfilms();
                        if (mainfilms != null && !mainfilms.isEmpty()) {
                            titel = mainfilms.get(0).titel();
                        }
                    }

                    contactService.sendReminder(
                            FUTURE_DAYS,
                            screening.vorstellungsbeginn().toString(),
                            titel,
                            screening.patenschaft(),
                            true
                    );

                    System.out.println("Mail (future reminder) sent to " + screening.patenschaft());
                }
            }
        }

        // ######################################################

        final int PAST_DAYS = 7;

        List<TerminDTOWithFilmDTOMailReminder> pastScreenings = screeningService.getTermineDaysInPast(PAST_DAYS);

        if (pastScreenings != null && !pastScreenings.isEmpty()) {
            // .isEmpty() returns true if the list contains no elements,  returns false if the list contains one or more elements.
            for (TerminDTOWithFilmDTOMailReminder screening : pastScreenings) {

                // check if an email is present in patenschaft field in Termin object
                if (screening.patenschaft() != null && !screening.patenschaft().trim().isEmpty()) {
                    //preparation of input parameters for contactService.sendReminder, which sends the mail
                    String titel = screening.titel();

                    // if it's not a programmtermin, but a Standardtermin (i.e. 1 main feature + optional short film(s)) take the film titel of the 1st feature
                    if (titel == null || titel.trim().isEmpty()) {
                        List<FilmDTOMailReminder> mainfilms = screening.mainfilms();
                        if (mainfilms != null && !mainfilms.isEmpty()) {
                            titel = mainfilms.get(0).titel();
                        }
                    }

                    contactService.sendReminder(
                            PAST_DAYS,
                            screening.vorstellungsbeginn().toString(),
                            titel,
                            screening.patenschaft(),
                            false
                    );

                    System.out.println("Mail (past reminder) sent to " + screening.patenschaft());
                }
            }
        }
    }

}
