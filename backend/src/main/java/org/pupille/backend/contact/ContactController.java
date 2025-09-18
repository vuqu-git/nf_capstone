package org.pupille.backend.contact;

import org.pupille.backend.googlerecaptcha.CaptchaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ContactController {

    private final ContactService contactService;
    private final CaptchaService captchaService;

    public ContactController(ContactService contactService, CaptchaService captchaService) {
        this.contactService = contactService;
        this.captchaService = captchaService;
    }

    @PostMapping("/api/contact/{issue}")
    public ResponseEntity<?> handleContactForm(
            @PathVariable String issue,
            @RequestBody Map<String, Object> payload) {

        // 1. Extract CAPTCHA token from payload
        String captcha = (String) payload.get("captcha");

        // 2. Verify CAPTCHA
        if (captcha == null || !captchaService.verifyCaptcha(captcha)) {
            return ResponseEntity.badRequest().body("{\"message\": \"CAPTCHA verification failed\"}");
        }

        // 3. Process the form
        contactService.handleContact(issue, payload);
        return ResponseEntity.ok("{\"message\": \"Message sent successfully!\"}");
    }
}
