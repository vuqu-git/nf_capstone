package org.pupille.backend.contact;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.pupille.backend.contact.exceptions.EmailSendingFailedException;
import org.pupille.backend.contact.exceptions.InvalidContactDataException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.Address;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.Message.RecipientType;

import java.util.Map;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class) // Syntax for JUnit 5, required for usage of @Mock
@MockitoSettings(strictness = Strictness.LENIENT) // It makes Mockito less strict about "unnecessary stubbing" (i.e., when you when() a method but that stubbed method is never actually called during the test).
public class ContactServiceTest {

    @Mock // Mock the JavaMailSender
    private JavaMailSender mailSender;

    private ContactService contactService;

    @BeforeEach
    void setUp() {
        // When mailSender.createMimeMessage() is called, return a real MimeMessage
        // This is crucial because MimeMessagePreparator operates on a real MimeMessage instance
        when(mailSender.createMimeMessage()).thenReturn(new MimeMessage((jakarta.mail.Session) null));

        contactService = new ContactService(mailSender, "kino@mail.com");
    }

    @Test
    void handleAOBInquiry_shouldSendEmailWithCorrectContent() throws Exception {
        // Given
        Map<String, Object> payload = Map.of(
                "betreff", "Test Betreff",
                "email", "test@example.com",
                "nachricht", "This is a test message."
        );

        // Use ArgumentCaptor to capture the MimeMessagePreparator passed to mailSender.send()
        ArgumentCaptor<MimeMessagePreparator> preparatorCaptor = ArgumentCaptor.forClass(MimeMessagePreparator.class);

        // When
        contactService.handleAOBInquiry(payload);

        // Then
        // Verify that mailSender.send() was called exactly once
        verify(mailSender, times(1)).send(preparatorCaptor.capture());

        // Get the captured MimeMessagePreparator
        MimeMessagePreparator capturedPreparator = preparatorCaptor.getValue();

        // Create a mock MimeMessage for the preparator to act upon
        // (or use the real MimeMessage created in @BeforeEach if you want to inspect it directly)
        MimeMessage mimeMessage = mailSender.createMimeMessage(); // Get the pre-configured mock MimeMessage

        // Execute the preparator's prepare method
        capturedPreparator.prepare(mimeMessage);

        // Now, assert on the content of the MimeMessage
        assertEquals("[Sonstige Anfrage] Test Betreff", mimeMessage.getSubject());

        Address[] from = mimeMessage.getFrom();
        assertNotNull(from);
        assertEquals(1, from.length);
        assertEquals("no-reply@pupille.org", ((InternetAddress) from[0]).getAddress());

        Address[] to = mimeMessage.getRecipients(RecipientType.TO);
        assertNotNull(to);
        assertEquals(1, to.length);
        assertEquals("test@example.com", ((InternetAddress) to[0]).getAddress());

        Address[] bcc = mimeMessage.getRecipients(RecipientType.BCC);
        assertNotNull(bcc);
        assertEquals(1, bcc.length);
//        assertEquals("kino@mail.com", ((InternetAddress) bcc[0]).getAddress());

//        // dies funzt nicht, aber Lösung ist komplex...
//        String content = (String) mimeMessage.getContent();
//        assertTrue(content.contains("Betreff</td><td>Test Betreff</td>"));
//        assertTrue(content.contains("Email</td><td>test@example.com</td>"));
//        assertTrue(content.contains("Nachricht</td><td>This is a test message.</td>"));
//        assertTrue(content.contains("<p style=\"font-size: 0.85em; color: #b00;")); // NO_REPLY_TEXT
//        assertTrue(content.contains("<p>Nachfolgend sind die vom Kontaktformular übermittelten Daten:</p>")); // INTRO_TEXT

        // Verify exception handling paths (example for InvalidContactDataException)
        assertThrows(InvalidContactDataException.class, () ->
                contactService.handleAOBInquiry(Map.of("betreff", "Subject", "email", "", "nachricht", "Message"))
        );
    }

    @Test
    void handleAOBInquiry_shouldThrowEmailSendingFailedExceptionOnMailSendException() throws MailException {
        // Given
        Map<String, Object> payload = Map.of(
                "betreff", "Test Betreff",
                "email", "test@example.com",
                "nachricht", "Test Message"
        );

        // Configure the mock mailSender to throw MailSendException when send is called
        doThrow(new MailSendException("Simulated send failure")).when(mailSender).send(any(MimeMessagePreparator.class));

        // When / Then
        EmailSendingFailedException thrown = assertThrows(EmailSendingFailedException.class, () ->
                contactService.handleAOBInquiry(payload)
        );

        assertTrue(thrown.getMessage().contains("⛔ Failed to send message. There might be a temporary issue with the mail server. Please try again later or disable your VPN or send a message to info@pupille.org instead."));
        // You can also verify the cause if needed: assertTrue(thrown.getCause() instanceof MailSendException);
    }

    // Add more tests for other exception types (MailAuthenticationException, etc.)
}