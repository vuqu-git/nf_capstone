package org.pupille.backend.oauthgithub;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

// To restrict authentication to only a list of approved GitHub users,
// you'll need to implement a custom OAuth2UserService that intercepts the user information after a successful GitHub login
// and checks if the authenticated user's GitHub username is in your APPROVED_USERS list.
// --> usage in .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService)) within SecurityConfig
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final List<String> approvedGithubUsers;

    // Use constructor injection with @Value to get the property
    public CustomOAuth2UserService(@Value("${oauth.approved.github.users}") String oauthApprovedGithubUsers) {
        // Split the comma-separated string from the property into a List
        // Trim each element to remove any leading/trailing whitespace
        this.approvedGithubUsers = Arrays.stream(oauthApprovedGithubUsers.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty()) // Filter out empty strings if there are consecutive commas
                .collect(Collectors.toList());

        // System.out.println("Loaded approved GitHub users: " + approvedGithubUsers); // For verification during startup
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Get the GitHub username. GitHub typically provides the username in the 'login' attribute.
        String githubUsername = oauth2User.getAttribute("login");

        if (githubUsername == null || !approvedGithubUsers.contains(githubUsername)) {
            throw new BadCredentialsException("GitHub user '" + githubUsername + "' is not authorized to access this application.");
        }

        return oauth2User;
    }
}