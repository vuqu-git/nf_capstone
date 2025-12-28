package org.pupille.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


// The WebConfig in your Spring Boot application and the Vite proxy serve two different purposes and are both necessary for a smooth development workflow.
// Spring Boot WebConfig (CORS):
// ****************************
//      This is a backend-side configuration that handles Cross-Origin Resource Sharing (CORS).
//      It's a protocol that allows a web server to explicitly permit requests from a different origin.
//      When you deploy your application, your frontend (served from a different origin) will make a direct request to your backend.
//      The CORS configuration tells the backend to accept these requests, preventing the browser from blocking them for security reasons.
//      The Vite proxy bypasses this issue during development, but the CORS configuration on Spring backend is essential for production when your frontend and backend are deployed to different domains.
//      But Spring Boot CORS Configuration is also a perfectly valid way to solve the issue during development!

    //  You can enable CORS in Spring Boot globally or on a per-controller basis.
    //  * Global Configuration (see public class WebConfig below)
    //  * Per-Controller/Method Configuration: For a quicker, more targeted solution, you can use the @CrossOrigin annotation directly on your REST controllers or specific endpoint methods:
    //      for example:
    //          @RestController
    //          @CrossOrigin(origins = "http://localhost:5173")
    //          public class MyController {
    //              @GetMapping("/api/data")
    //              public String getData() {
    //                  return "Some data from Spring!";
    //              }
    //          }


// Vite Proxy:
// **********
//      This is a development-only feature!!!
//      It tells the Vite development server to redirect requests from your frontend (e.g., http://localhost:5173/api/) to your backend server (e.g., http://localhost:8080/api/).
//      This is crucial because a browser's security model, the Same-Origin Policy, prevents a web page from making direct API calls to a different origin (a different port, in this case) during development.
//      Without the proxy, your frontend app would attempt to call http://localhost:5173/api/ which doesn't exist.


// This configuration, your WebConfig.java file, defines Cross-Origin Resource Sharing (CORS) rules for your Spring Boot application.
// WebConfig is primarily for the production environment where the frontend and backend are hosted on different servers or different domains.
// Your frontend code (e.g., hosted at https://your-frontend-domain.com) will make direct API calls to your backend (e.g., at https://your-backend-api.com).
// Because these are different origins, the browser will block the requests unless the backend explicitly allows them via a CORS header, which your WebConfig provides.

// Here it allows your backend API (running on http://localhost:8080) to accept requests from your frontend application (running on http://localhost:5173 (dev in vite) or http://localhost:4173 (preview in vite)).
// Without this configuration, your browser would block these requests due to the Same-Origin Policy, which dictates that a web page can only request resources from the same origin (same protocol, host, and port).
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // Allow both the dev server (port 5173 under vite) and preview server (port 4173 under vite) origins
//                        .allowedOrigins("http://localhost:5173", "http://localhost:4173")
                        .allowedOrigins("http://localhost:4173") // no http://localhost:5173 required here because of vite proxy in vite.config.ts (see explanation below)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Set-Cookie") // Expose CSRF cookie
                        .allowCredentials(true); // Needed for cookies (CSRF, auth)
            }
        };
    }
}

// The Vite Proxy (The "Magic" Part)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vite proxy is handling the requests during development. The proxy makes the browser think that the frontend and backend are on the same origin (e.g., all requests appear to come from http://localhost:5173).
// So, the browser's Same-Origin Policy is not triggered, and there is no need for a CORS header from the backend.
// When you configure the proxy in vite.config.js:
//        proxy: {
//          '/api': {
//          target: 'http://localhost:8080',
//          },
//        }
//
//        You are telling the Vite dev server to act as an intermediary.
//        Based on the proxy rule, the Vite dev server INTERNALLY forwards that request to your backend.
//        From the browser's perspective, the request was always made to its own origin (http://localhost:5173).
//        The browser never knew that the request was forwarded to http://localhost:8080.
//        Since the browser never made a direct cross-origin request, the Same-Origin Policy was never triggered, and the WebConfig (CORS headers) was never needed.

//        The Vite proxy is a development tool that creates a seamless illusion, bypassing the need for CORS during local development.
//        The WebConfig is a backend configuration that handles CORS for production and any environment where the frontend and backend are on different domains and the proxy is no longer in use.
