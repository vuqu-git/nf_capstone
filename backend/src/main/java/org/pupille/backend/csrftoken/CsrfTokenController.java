//package org.pupille.backend.csrftoken;
//
//import org.springframework.security.web.csrf.CsrfToken;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class CsrfTokenController {
//
//    @GetMapping("/api/csrf-token")
//    public CsrfToken csrf(CsrfToken token) {
//        return token; // Spring injects token here, returns headerName and token value
//    }
//}
