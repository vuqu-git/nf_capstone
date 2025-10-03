package org.pupille.backend.oauthgithub;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // Use "test" profile to load application-test.properties
public class OAuthGitHubControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @WithMockUser
    void testGetMe_withLoggedInUser_expectedUsername() throws Exception {
        mockMvc.perform(get("/api/oauthgithub/me")
                    // this line for fetching github username
                    .with(oidcLogin().userInfoToken(token -> token.claim("login", "github-username")))
                    .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("github-username"));
    }

    @Test
    void testGetMe_withoutLogin_expectedAnonymousUser() throws Exception {
        mockMvc.perform(get("/api/oauthgithub/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }

}
