package org.pupille.backend.oauthgithub;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${oauth.appurl}")
    String oauthAppurl;

    // Inject your custom services
    private final OAuth2UserService<org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest, org.springframework.security.oauth2.core.user.OAuth2User> customOAuth2UserService;
    private final AuthenticationFailureHandler customOAuth2AuthenticationFailureHandler; // Inject the new failure handler

    public SecurityConfig(
            OAuth2UserService<org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest, org.springframework.security.oauth2.core.user.OAuth2User> customOAuth2UserService,
            AuthenticationFailureHandler customOAuth2AuthenticationFailureHandler) { // Add to constructor
        this.customOAuth2UserService = customOAuth2UserService;
        this.customOAuth2AuthenticationFailureHandler = customOAuth2AuthenticationFailureHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // (1A): this is more explicit than (1B)
        CookieCsrfTokenRepository csrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfTokenRepository.setCookiePath("/"); // absolutely required, when using this explicit version !!!

        // ???????????????????
        // do NOT call csrfTokenRepository.setSecure(false);

        // (2A): more explicit regards (2B) :
        // CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        // requestHandler.setCsrfRequestAttributeName("_csrf");
        // http
        //        .csrf(csrf -> csrf
        //                .csrfTokenRepository(csrfTokenRepository)
        //                .csrfTokenRequestHandler(requestHandler)
        //        )
        //        //...

        http
//                .csrf(AbstractHttpConfigurer::disable) // this DISables the csrf protection!
                .csrf(csrf -> csrf
//                        // (1B)
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()) // send CSRF token as cookie accessible to JS;  inline version of the line in (1A) above
//                        // (1A)
                        .csrfTokenRepository(csrfTokenRepository)   // uses CookieCsrfTokenRepository → Cookie gets set
                )
                .csrf(csrf -> csrf
                        // (2B)
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())    // Explicitly opt out of BREACH protection, to address common issue:
                                                                                            // Spring Security automatically uses XorCsrfTokenRequestAttributeHandler as the default CSRF token request handler when you don't explicitly specify one like above
                                                                                            // XorCsrfTokenRequestAttributeHandler provides BREACH protection by encoding randomness into the CSRF token value. This means that each time you request a token, it may return a slightly different encoded value, even though the underlying token is the same. This is why you're seeing different token values between your GET request and your non GET request.
                )
                .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class) // Add this line
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST,"/api/news").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/news/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/news/{id}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/filme").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/filme/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/filme/{id}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/termine").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/termine/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/termine/{id}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/reihe").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/reihe/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/reihe/{id}").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/reihe/{rnr}/termin/{tnr}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/reihe/{rnr}/termin/{tnr}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/terminverknuepfung/link-film-termin").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/terminverknuepfung/{tnr}/{fnr}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/terminverknuepfung/{tnr}/{fnr}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/programmheft").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/programmheft/{pnr}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/programmheft/{pnr}").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/perplexityai/emojify").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/perplexityai/film-text").authenticated()

                        .requestMatchers(HttpMethod.POST,"/api/clicks").permitAll()

                        .requestMatchers(HttpMethod.GET,"/api/survey/umfragen").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/survey/umfragen/{unr}").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/survey/umfragen").authenticated()
                        .requestMatchers(HttpMethod.PUT,"/api/survey/umfragen/{unr}").authenticated()
                        .requestMatchers(HttpMethod.DELETE,"/api/survey/umfragen/{unr}").authenticated()

                        .requestMatchers(HttpMethod.GET,"/api/survey/stimmabgaben/option/{onr}").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/survey/stimmabgaben/forumfrage/{unr}").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/survey/stimmabgaben/forumfrage/{selectedUnr}/export").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/survey/stimmabgaben/forumfrage/{selectedUnr}/exportgrouped").authenticated()
                        .requestMatchers(HttpMethod.GET,"/api/survey/stimmabgaben/forumfrage/{unr}/grouped").authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/survey/stimmabgaben").permitAll()
                        .requestMatchers(HttpMethod.DELETE,"/api/survey/stimmabgaben/{snr}").authenticated()

                        .anyRequest().permitAll()
                )
                .sessionManagement(sessions ->
                        sessions.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                .logout(l -> l.logoutSuccessUrl(oauthAppurl))
                .oauth2Login(o -> o
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService)) // here is the custom service used
                        .defaultSuccessUrl(oauthAppurl)
                        .failureHandler(customOAuth2AuthenticationFailureHandler) // here the custom AuthenticationFailureHandler kicks in
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                );

        return http.build();
    }

    // common issue: Spring Security 6 called "Deferred CSRF Token Loading":
    //  What's Happening
    //      Spring Security 6 defers CSRF token creation until it's actually needed for performance reasons
    //      The CookieCsrfTokenRepository.saveToken() method only gets called when CsrfFilter calls deferredCsrfToken.get()
    //      This only happens on POST, PUT, PATCH, and DELETE methods - not on GET requests
    //      So for example the FIRST PUT request fails because no cookie exists yet, but this failure triggers cookie creation
    //      The SECOND PUT request succeeds because now the cookie exists
    // -> Force Eager Token Loading
    //      custom filter that forces the CSRF token to be created on every request
    private static final class CsrfCookieFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
            if (csrfToken != null) {
                // Render the token value to a cookie by causing the deferred token to be loaded
                csrfToken.getToken();
            }
            filterChain.doFilter(request, response);
        }
    }

}