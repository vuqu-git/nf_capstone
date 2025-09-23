package org.pupille.backend.contact;

import org.pupille.backend.contact.exceptions.EmailSendingFailedException;
import org.pupille.backend.contact.exceptions.InvalidContactDataException;
import org.pupille.backend.contact.exceptions.InvalidDateTimeFormatException;
import org.pupille.backend.contact.exceptions.InvalidEngagementHoursFormatException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.MailException; // This is the base class for all Spring Mail exceptions

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// better: modularize this class by adding EmailBuilder and EmailSender classes

@Service
public class ContactService {

    private final JavaMailSender mailSender;
//    @Value("${bcc.email.infoatpupille:info@pupille.org")
//    private String bccEmailInfoatpupille;
//
//    public ContactService(JavaMailSender mailSender) { // Inject MailService
//        this.mailSender = mailSender;
//    }

    private final String bccEmailInfoatpupille;
    //  best practice is to use constructor injection for mandatory dependencies and @Value for configuration values
    public ContactService(JavaMailSender mailSender,
                          @Value("${bcc.email.infoatpupille:info@pupille.org}") String bccEmailInfoatpupille) {
        this.mailSender = mailSender;
        this.bccEmailInfoatpupille = bccEmailInfoatpupille;
    }


    private static final String SENDER_EMAIL_NOREPLY = "no-reply@pupille.org";
//    private static final String bccEmailInfoatpupille = "quy8vuong@gmail.com"; // here: info@pupille.org in production

    private static final String CELL_STYLE = "padding:4px;border:1px solid #ddd;text-align:left;";
    private static final String CELL_STYLE_HEADER = "width: 200px;padding:4px;border:1px solid #ddd;text-align:left;";
    private static final String NO_REPLY_TEXT = "<p style=\"font-size: 0.85em; color: #b00; background-color: #f5f5f5; padding: 8px; border-radius: 4px; margin-top: 10px;\">Diese Nachricht wurde automatisch erzeugt. Antworten an no-reply@pupille.org werden nicht bearbeitet.</p>";
    private static final String INTRO_TEXT = "<p>Nachfolgend sind die vom Kontaktformular übermittelten Daten:</p>";


    public void handleContact(String issue, Map<String, Object> payload) {
        switch (issue.toLowerCase()) {
            case "aob":
                handleAOBInquiry(payload);
                break;
            case "kinomitarbeit":
                handleKinomitarbeit(payload);
                break;
            case "kooperation":
                handleKooperation(payload);
                break;
            case "eigenstaendig":
                handleEigenstaendig(payload);
                break;
            case "mitkinotechnik":
                handleMitKinotechnik(payload);
                break;
            default:
                throw new IllegalArgumentException("Invalid issue type: " + issue);
        }
    }

            // utils functions to embellish HTML mail
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            private String escapeHtml(String input) {
                if (input == null) return "";
                return input.replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                        .replace("\"", "&quot;")
                        .replace("'", "&#39;")
                        .replace("\n", "<br/>");  // New line
            }

            private String formatDateTime(String dateTimeStr) {
                if (dateTimeStr == null || dateTimeStr.isEmpty()) {
                    return null;
                }
                try {
                    LocalDateTime ldt = LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    return ldt.format(DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm 'Uhr'"));
                } catch (DateTimeParseException e) {
                    System.err.println("Error parsing date/time string: " + dateTimeStr + "  Error: " + e.getMessage());
                    throw new InvalidDateTimeFormatException("Invalid date/time format. Please use ISO 8601 format.");
                }
            }

            private String tableRow(String label, String value) {
                if (value == null) value = "";
                return "<tr><th style=\"" + CELL_STYLE_HEADER + "\">" + label + "</th><td style=\"" + CELL_STYLE + "\">" + value + "</td></tr>";
            }
            // ~~~~~~~~~~~~~~~

    // Java 10 and later, var is a local variable type inference keyword.
    // It lets you declare a local variable without explicitly specifying its type.
    //  Instead, the compiler infers the type from the right-hand side of the assignment.

    public void handleAOBInquiry(Map<String, Object> payload) {
        // Extract and sanitize all fields
        var betreff = escapeHtml((String) payload.get("betreff"));
        var name = escapeHtml((String) payload.get("name"));
        var email = escapeHtml((String) payload.get("email"));
        var nachricht = escapeHtml((String) payload.get("nachricht"));

        var istEinverstandenObj = (Boolean) payload.get("istEinverstandenMitDatennutzung");
        var istEinverstanden = istEinverstandenObj != null && istEinverstandenObj;

        // Collect required fields (match frontend required attributes)
        Map<String, String> requiredFields = Map.of(
                "betreff", betreff,
                "email", email,
                "nachricht", nachricht
        );
        List<String> missingFields = requiredFields.entrySet().stream()
                .filter(e -> e.getValue() == null || e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidContactDataException(
                    "Please fill in all required fields. Missing: " + String.join(", ", missingFields)
            );
        }

        // --- Construct email HTML body ---
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(SENDER_EMAIL_NOREPLY);
            helper.setTo(email);
            helper.setBcc(bccEmailInfoatpupille);

            helper.setSubject("[Sonstige Anfrage] " + betreff);

            StringBuilder htmlBody = new StringBuilder()
                    .append(NO_REPLY_TEXT)
                    .append(INTRO_TEXT)
                    .append("<table style=\"border-collapse:collapse;width:100%;\">")
                    .append(tableRow("Betreff", betreff))
                    .append(tableRow("Name", name))
                    .append(tableRow("Email", email))
                    .append(tableRow("Nachricht", nachricht))
                    .append(tableRow("Datenschutzerklärung gelesen + akzeptiert", istEinverstanden ? "Ja" : "Nein"))
                    .append("</table>");

            helper.setText(htmlBody.toString(), true);
        };

        // --- Robust email sending with detailed error handling ---
        // see package exceptions
        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            // This exception typically wraps lower-level JavaMail exceptions (e.g., SMTP errors)
            // You can inspect e.getFailedMessages() if you sent multiple messages
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            // Catch any other Spring Mail related exceptions
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }


    public void handleKinomitarbeit(Map<String, Object> payload) {
        // Extract and sanitize fields
        var name = escapeHtml((String) payload.get("name"));
        var email = escapeHtml((String) payload.get("email"));
        var nachricht = escapeHtml((String) payload.get("nachricht"));
        var stundenEngagementStr = escapeHtml((String) payload.get("stundenEngagement"));

        var istEinverstandenObj = (Boolean) payload.get("istEinverstandenMitDatennutzung");
        var istEinverstanden = istEinverstandenObj != null && istEinverstandenObj;

        // --- Parse double with null-safe default and validation ---
        double stundenEngagement = 0.0;
        if (stundenEngagementStr != null && !stundenEngagementStr.isEmpty()) {
            try {
                stundenEngagement = Double.parseDouble(stundenEngagementStr);
                if (stundenEngagement < 0) {
                    throw new InvalidEngagementHoursFormatException("Number of hours must be greater than or equal to 0.");
                }
            } catch (NumberFormatException ex) {
                // You could log "Invalid value: " + stundenEngagementStr here if helpful
                throw new InvalidEngagementHoursFormatException("Invalid value for engagement hours. Please enter a valid number.");
            }
        }

        // --- Validate required fields ---
        Map<String, String> requiredFields = Map.of(
                "name", name,
                "email", email,
                "nachricht", nachricht
        );
        List<String> missingFields = requiredFields.entrySet().stream()
                .filter(e -> e.getValue() == null || e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidContactDataException(
                    "Please fill in all required fields. Missing: " + String.join(", ", missingFields)
            );
        }

        // --- Construct email HTML body ---
        double finalStundenEngagement = stundenEngagement;
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            // Send to staff, CC to user (optional), BCC if needed
            helper.setFrom(SENDER_EMAIL_NOREPLY);
            helper.setTo(email);
            helper.setBcc(bccEmailInfoatpupille);

            helper.setSubject("[Kinomitarbeit: Anfrage] " + name);

            // --- Build HTML table ---
            StringBuilder htmlBody = new StringBuilder()
                    .append(NO_REPLY_TEXT)
                    .append(INTRO_TEXT)
                    .append("<table style=\"border-collapse:collapse;width:100%;\">")
                    .append(tableRow("Name", name))
                    .append(tableRow("Email", email))
                    .append(tableRow("Nachricht", nachricht))
                    .append(tableRow("Geschätztes Engagement (Stunden/Monat)", String.format("%.1f", finalStundenEngagement)))
                    .append(tableRow("Datenschutzerklärung gelesen + akzeptiert", istEinverstanden ? "Ja" : "Nein"))
                    .append("</table>");

            helper.setText(htmlBody.toString(), true);
        };

        // --- Send email ---
        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }


    public void handleEigenstaendig(Map<String, Object> payload) {
        // Extract and sanitize all fields
        var betreff = escapeHtml((String) payload.get("betreff"));
        var ansprechperson = escapeHtml((String) payload.get("ansprechperson"));
        var email = escapeHtml((String) payload.get("email"));
        var veranstaltungsbeginnStr = escapeHtml((String) payload.get("veranstaltungsbeginn"));
        var veranstaltungsendeStr = escapeHtml((String) payload.get("veranstaltungsende"));

        var istEinverstandenMitDatennutzungObj = (Boolean) payload.get("istEinverstandenMitDatennutzung");
        var istEinverstandenMitDatennutzung = istEinverstandenMitDatennutzungObj != null && istEinverstandenMitDatennutzungObj;

        // --- Validate required fields ---
        Map<String, String> requiredFields = Map.of(
                "betreff", betreff,
                "email", email,
                "veranstaltungsbeginn", veranstaltungsbeginnStr,
                "veranstaltungsende", veranstaltungsendeStr
        );
        List<String> missingFields = requiredFields.entrySet().stream()
                .filter(e -> e.getValue() == null || e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidContactDataException(
                    "Please fill in all required fields. Missing: " + String.join(", ", missingFields)
            );
        }

        // Format date/time for display; will show original string if parsing fails
        String formattedVeranstaltungsbeginn = formatDateTime(veranstaltungsbeginnStr);
        String formattedVeranstaltungsende = formatDateTime(veranstaltungsendeStr);

        // --- Construct email HTML body ---
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(SENDER_EMAIL_NOREPLY);
            helper.setTo(email);
            helper.setBcc(bccEmailInfoatpupille);

            helper.setSubject("[Eigenständige Nutzung Leinwand] " + betreff);

            // --- Build HTML table ---
            var html = new StringBuilder()
                    .append(NO_REPLY_TEXT)
                    .append(INTRO_TEXT)
                    .append("<table style=\"border-collapse:collapse;width:100%;\">")
                    .append(tableRow("Betreff", betreff))
                    .append(tableRow("Ansprechperson", ansprechperson))
                    .append(tableRow("Email", email))
                    .append(tableRow("Veranstaltungsbeginn", formattedVeranstaltungsbeginn))
                    .append(tableRow("Veranstaltungsende", formattedVeranstaltungsende))
                    .append(tableRow("Datenschutzerklärung gelesen + akzeptiert", istEinverstandenMitDatennutzung ? "Ja" : "Nein"))
                    .append("</table>");

            helper.setText(html.toString(), true);
        };

        // --- Send email ---
        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }

    public void handleMitKinotechnik(Map<String, Object> payload) {
        // Extract and sanitize all fields
        var betreff = escapeHtml((String) payload.get("betreff"));
        var ansprechperson = escapeHtml((String) payload.get("ansprechperson"));
        var email = escapeHtml((String) payload.get("email"));
        var telefon = escapeHtml((String) payload.get("telefon"));
        var nachricht = escapeHtml((String) payload.get("nachricht"));
        var projektionsinhalt = escapeHtml((String) payload.get("projektionsinhalt"));
        var verleih = escapeHtml((String) payload.get("verleih"));
        var format = escapeHtml((String) payload.get("format"));
        var veranstaltungsbeginnStr = escapeHtml((String) payload.get("veranstaltungsbeginn"));
        var veranstaltungsendeStr = escapeHtml((String) payload.get("veranstaltungsende"));

        var istGemietetBeiAstaObj = (Boolean) payload.get("istGemietetBeiAsta");
        var wurdeGelesenHinweisEventlocationObj = (Boolean) payload.get("wurdeGelesenHinweisEventlocation");
        var istEinverstandenMitDatennutzungObj = (Boolean) payload.get("istEinverstandenMitDatennutzung");

        // Boolean flags
        var istGemietetBeiAsta = istGemietetBeiAstaObj != null && istGemietetBeiAstaObj;
        var wurdeGelesenHinweisEventlocation = wurdeGelesenHinweisEventlocationObj != null && wurdeGelesenHinweisEventlocationObj;
        var istEinverstandenMitDatennutzung = istEinverstandenMitDatennutzungObj != null && istEinverstandenMitDatennutzungObj;

        // Number of microphones (optional field, default 0)
        int anzMikrofone = 0;
        var anzMikrofoneObj = payload.get("anzMikrofone");
        if (anzMikrofoneObj instanceof Number) {
            anzMikrofone = ((Number) anzMikrofoneObj).intValue();
        } else if (anzMikrofoneObj instanceof String) {
            try {
                anzMikrofone = Integer.parseInt((String) anzMikrofoneObj);
            } catch (NumberFormatException e) {
                throw new InvalidContactDataException("Invalid value for 'anzMikrofone'.");
            }
        }

        if (anzMikrofone < 0) {
            throw new InvalidContactDataException("'anzMikrofone' must be greater than or equal to 0.");
        }

        // --- Validate required fields ---
        Map<String, String> requiredFields = Map.of(
                "betreff", betreff,
                "ansprechperson", ansprechperson,
                "email", email,
                "nachricht", nachricht,
                "projektionsinhalt", projektionsinhalt,
                "format", format,
                "veranstaltungsbeginn", veranstaltungsbeginnStr,
                "veranstaltungsende", veranstaltungsendeStr
        );
        List<String> missingFields = requiredFields.entrySet().stream()
                .filter(e -> e.getValue() == null || e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidContactDataException(
                    "Please fill in all required fields. Missing: " + String.join(", ", missingFields)
            );
        }

        // Format date/time for display; will show original string if parsing fails
        String veranstaltungsbeginn = formatDateTime(veranstaltungsbeginnStr);
        String veranstaltungsende = formatDateTime(veranstaltungsendeStr);

        // --- Construct email HTML body ---
        int finalAnzMikrofone = anzMikrofone;
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(SENDER_EMAIL_NOREPLY);
            helper.setTo(email);
            helper.setBcc(bccEmailInfoatpupille);

            helper.setSubject("[Kinotechnik: Anfrage] " + betreff);

            // --- Build HTML table ---
            StringBuilder htmlBody = new StringBuilder();
            htmlBody.append(NO_REPLY_TEXT)
                    .append(INTRO_TEXT)
                    .append("<table style=\"border-collapse:collapse;width:100%;\">")
                    .append(tableRow("Betreff", betreff))
                    .append(tableRow("Ansprechperson", ansprechperson))
                    .append(tableRow("Email", email))
                    .append(tableRow("Telefon", telefon))
                    .append(tableRow("Nachricht", nachricht))
                    .append(tableRow("Projektionsinhalt", projektionsinhalt))
                    .append(tableRow("Verleiher/Rechteinhaber", verleih))
                    .append(tableRow("Abspielformat", format))
                    .append(tableRow("Anzahl benötigter Mikrofone", String.valueOf(finalAnzMikrofone)))
                    .append(tableRow("Veranstaltungsbeginn", veranstaltungsbeginn))
                    .append(tableRow("Veranstaltungsende", veranstaltungsende))
                    .append(tableRow("Festsaal beim AStA bereits gemietet", istGemietetBeiAsta ? "Ja" : "Nein"))
                    .append(tableRow("Hinweis zum Veranstaltungsort bei Werbung gelesen", wurdeGelesenHinweisEventlocation ? "Ja" : "Nein"))
                    .append(tableRow("Datenschutzerklärung gelesen + akzeptiert", istEinverstandenMitDatennutzung ? "Ja" : "Nein"))
                    .append("</table>");

            helper.setText(htmlBody.toString(), true);
        };

        // --- Send email ---
        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }

    public void handleKooperation(Map<String, Object> payload) {
        // Extract and sanitize all fields
        var betreff = escapeHtml((String) payload.get("betreff"));
        var ansprechperson = escapeHtml((String) payload.get("ansprechperson"));
        var email = escapeHtml((String) payload.get("email"));
        var telefon = escapeHtml((String) payload.get("telefon"));
        var filmtitel = escapeHtml((String) payload.get("filmtitel"));
        var verleih = escapeHtml((String) payload.get("verleih"));
        var format = escapeHtml((String) payload.get("format"));
        var terminpraeferenz = escapeHtml((String) payload.get("terminpraeferenz"));
        var nachricht = escapeHtml((String) payload.get("nachricht"));
        var zusammenarbeit = escapeHtml((String) payload.get("zusammenarbeit"));

        var istEinverstandenMitDatennutzungObj = (Boolean) payload.get("istEinverstandenMitDatennutzung");
        var istEinverstandenMitDatennutzung = istEinverstandenMitDatennutzungObj != null && istEinverstandenMitDatennutzungObj;

        // --- Validate required fields ---
        Map<String, String> requiredFields = Map.of(
                "betreff", betreff,
                "ansprechperson", ansprechperson,
                "email", email,
                "filmtitel", filmtitel,
                "verleih", verleih,
                "format", format,
                "terminpraeferenz", terminpraeferenz,
                "nachricht", nachricht,
                "zusammenarbeit", zusammenarbeit
        );
        List<String> missingFields = requiredFields.entrySet().stream()
                .filter(e -> e.getValue() == null || e.getValue().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidContactDataException(
                    "Please fill in all required fields. Missing: " + String.join(", ", missingFields)
            );
        }

        // --- Construct email HTML body ---
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(SENDER_EMAIL_NOREPLY);
            helper.setTo(email);
            helper.setBcc(bccEmailInfoatpupille);

            helper.setSubject("[Kooperationsanfrage] " + betreff);

            // --- Build HTML table ---
            var htmlBody = new StringBuilder()
                    .append(NO_REPLY_TEXT)
                    .append(INTRO_TEXT)
                    .append("<table style=\"border-collapse:collapse;width:100%;\">")
                    .append(tableRow("Betreff", betreff))
                    .append(tableRow("Ansprechperson", ansprechperson))
                    .append(tableRow("Email", email))
                    .append(tableRow("Telefon", telefon))
                    .append(tableRow("Filmtitel", filmtitel))
                    .append(tableRow("Verleiher/Rechteinhaber", verleih))
                    .append(tableRow("Abspielformat", format))
                    .append(tableRow("Terminpräferenzen", terminpraeferenz))
                    .append(tableRow("Nachricht", nachricht))
                    .append(tableRow("Überlegungen zur Zusammenarbeit", zusammenarbeit))
                    .append(tableRow("Datenschutzerklärung gelesen + akzeptiert", istEinverstandenMitDatennutzung ? "Ja" : "Nein"))
                    .append("</table>");

            helper.setText(htmlBody.toString(), true);
        };

        // --- Send email ---
        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }

//    ++++++++++++++++++++++++++++++++++++++++++++++++++++++
//    Reminder mails
//    ++++++++++++++++++++++++++++++++++++++++++++++++++++++

    public void sendReminder(int days, String vorstellungsbeginn, String titel, String patenschaft, boolean isPreReminder) {
        // titel is either of Programmscreening or of the mainfilm in case of Standardscreening (mainfilms.get(0).titel())

        // Do nothing if patenschaft is null or empty
        if (patenschaft == null || patenschaft.isEmpty()) {
            return;
        }

        if (vorstellungsbeginn == null || vorstellungsbeginn.isEmpty() ||
                titel == null || titel.isEmpty()
//                || patenschaft == null || patenschaft.isEmpty()
        ) {
            throw new InvalidContactDataException("Alle Felder müssen ausgefüllt sein.");
        }

        LocalDateTime ldtVorstellungsbeginn;
        try {
            ldtVorstellungsbeginn = LocalDateTime.parse(vorstellungsbeginn, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            throw new InvalidDateTimeFormatException("Ungültiges Datumsformat für vorstellungsbeginn.");
        }
        String datum = ldtVorstellungsbeginn.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        String uhrzeit = ldtVorstellungsbeginn.format(DateTimeFormatter.ofPattern("HH:mm"));

//        String betreff = (isPreReminder ? "Pupille: Vorbereitung von " : "Pupille: Nachbereitung von ")
//                + titel.toUpperCase() + " am " + datum;
        String betreff = (isPreReminder ? "Pupille: Vorbereitung von '" : "Pupille: Nachbereitung von '")
                + titel + "' am " + datum;

        StringBuilder htmlBody = new StringBuilder();
        htmlBody.append(NO_REPLY_TEXT);
        if (isPreReminder) {
            htmlBody.append("<p>Hallo,</p>");
            htmlBody.append("<p>in der Pupille läuft in ")
                    .append(days)
                    .append(" Tagen am <b>")
                    .append(datum)
                    .append(" um ")
                    .append(uhrzeit)
                    .append(" Uhr</b> die Vorstellung von '<b>")
//                    .append(titel.toUpperCase())
                    .append(titel)
                    .append("</b>' für die du die Patenschaft inne hast :)</p>");
            htmlBody.append("<p>Dies ist ein automatischer Reminder für u.a. folgende vorbereitenden Aufgaben:</p>");
            htmlBody.append("<ul>");
            htmlBody.append("<li>Liegt eine Terminbestätigung vor?</li>");
            htmlBody.append("<li>Bitte achte darauf, dass der Kopienversand bzw. Download rechtzeitig initiiert wird!</li>");
            htmlBody.append("<li>Sind genügend Personen im Dienstplan eingetragen?</li>");
            htmlBody.append("</ul>");
            htmlBody.append("<p>Freundliche Grüße!</p>");
        } else {
            htmlBody.append("<p>Hallo,</p>");
            htmlBody.append("<p>in der Pupille lief vor ")
                    .append(days)
                    .append(" Tagen am ")
                    .append(datum)
                    .append(" die Vorstellung von '<b>")
//                    .append(titel.toUpperCase())
                    .append(titel)
                    .append("</b>' für die du die Patenschaft inne hast :)</p>");
            htmlBody.append("<p>Dies ist ein automatischer Reminder für u.a. folgende Erledigungen im Nachgang:</p>");
            htmlBody.append("<ul>");
            htmlBody.append("<li>Rückversand der Kopie vorbereiten bzw. Löschung der Filmdateien auf PC und Server durchführen</li>");
            htmlBody.append("<li>Spielfilmabrechnung machen und verschicken</li>");
            htmlBody.append("<li>Einzahlung der Einnahmen in die Wege leiten</li>");
            htmlBody.append("</ul>");
            htmlBody.append("<p>Freundliche Grüße!</p>");
        }

        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            messageHelper.setFrom(SENDER_EMAIL_NOREPLY);
//            messageHelper.setTo(patenschaft);
            String[] recipients = patenschaft.split("\\s*,\\s*");
            messageHelper.setTo(recipients);
            messageHelper.setSubject(betreff);
            messageHelper.setText(htmlBody.toString(), true);
        };

        try {
            mailSender.send(messagePreparator);
        } catch (MailAuthenticationException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to authentication issues. Please send a message to info@pupille.org instead.", e);
        } catch (MailParseException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message due to malformed email content. Please send a message to info@pupille.org instead.", e);
        } catch (MailSendException e) {
            throw new EmailSendingFailedException("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead.", e);
        } catch (MailException e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred while sending the email. Please try again later or send a message to info@pupille.org instead.", e);
        } catch (Exception e) {
            throw new EmailSendingFailedException("⛔ An unexpected error occurred. Please try again later or send a message to info@pupille.org instead.", e);
        }
    }

}
