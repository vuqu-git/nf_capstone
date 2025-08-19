package org.pupille.backend.oauthgithub;

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
        http
                .csrf(AbstractHttpConfigurer::disable)
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
                        .anyRequest().permitAll())
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
}