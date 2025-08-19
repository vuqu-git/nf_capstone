package org.pupille.backend.oauthgithub;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

// without this class (and its usage in .failureHandler(customOAuth2AuthenticationFailureHandler) within SecurityConfig) the thrown BadCredentialsException would redirect to an authentication failure page: localhost:8080/login?error is Spring Security's default error page for authentication failures, which results in a Whitelabel Error Page when you have a separate frontend like React/Vite.
// To handle authentication failures gracefully with a separate frontend, you need to configure Spring Security to redirect to a specific URL on your frontend when a BadCredentialsException (or any other authentication failure during OAuth2 login) occurs.
// Here's how you can achieve this by configuring a custom AuthenticationFailureHandler for your OAuth2 login
@Component
public class CustomOAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final String oauthErrorurl;

    // Use @Value to inject the frontend URL for error redirection
    public CustomOAuth2AuthenticationFailureHandler(@Value("${oauth.errorurl}") String oauthErrorurl) {
        this.oauthErrorurl = oauthErrorurl;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // log the exception for debugging purposes
        System.err.println("OAuth2 authentication failed: " + exception.getMessage());

        // construct the URL to redirect to your frontend and pass an error message as a query parameter
        String redirectUrl = oauthErrorurl + "?error=" + exception.getMessage();

        response.sendRedirect(redirectUrl);
    }
}