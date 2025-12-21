package org.pupille.backend.csrftoken;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// create a simple, dedicated endpoint for fetching the current CSRF token
// How it Works
//        Spring Argument Resolver: When a request comes to /api/csrf-token, Spring MVC sees the CsrfToken token argument in your method. It then uses a special built-in component called CsrfTokenArgumentResolver to handle it.
//        Token Retrieval: The resolver fetches the current CsrfToken object, which your CsrfCookieFilter has already ensured is generated.
//        Injection: The resolver "injects" this complete token object into your token method parameter.
//        JSON Serialization: Your controller returns the CsrfToken object. Spring's Jackson library automatically serializes this into a JSON response.

// What it Produces
// When a client (like a browser) makes a GET request to /api/csrf-token, they receive a JSON object structured like this:
//{
//        "parameterName": "_csrf",
//        "token": "2e29fec6-7b1b-4c58-b0c9-c24201ed9999",
//        "headerName": "X-XSRF-TOKEN"
//}

@RestController
public class CsrfTokenController {

    @GetMapping("/api/csrf-token")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token; // Spring injects token here, returns headerName and token value
    }
}
