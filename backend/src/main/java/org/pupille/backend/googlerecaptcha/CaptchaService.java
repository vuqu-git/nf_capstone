package org.pupille.backend.googlerecaptcha;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Value("${recaptcha.secret.key}")
    private  String recaptchaSecretKey;

    public boolean verifyCaptcha(String captchaResponse) {
        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("secret", recaptchaSecretKey);
        body.add("response", captchaResponse);

        CaptchaResponse response = restTemplate.postForObject(
                RECAPTCHA_VERIFY_URL, body, CaptchaResponse.class);

        return response != null && response.isSuccess();
    }

    private static class CaptchaResponse {
        private boolean success;
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
    }
}
