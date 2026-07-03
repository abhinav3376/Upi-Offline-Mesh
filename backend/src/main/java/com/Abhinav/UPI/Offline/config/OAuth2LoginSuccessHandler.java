package com.Abhinav.UPI.Offline.config;

import com.Abhinav.UPI.Offline.model.LocalUser;
import com.Abhinav.UPI.Offline.model.LocalUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handles both Google and GitHub. The two providers expose different
 * attributes:
 *   - Google always has "email" and "name".
 *   - GitHub has "login" (always present) but "email" and "name" are only
 *     present if the user made them public, so we fall back to a synthetic,
 *     stable, non-colliding username for those.
 *
 * After upserting the LocalUser row, this redirects the browser back to the
 * React app instead of "/", since the SPA — not a server-rendered page —
 * now owns the post-login experience.
 */
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private LocalUserRepository users;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        LocalUser.Provider provider = LocalUser.Provider.GOOGLE;

        if ("github".equals(registrationId)) {
            provider = LocalUser.Provider.GITHUB;
            String login = oAuth2User.getAttribute("login");
            if (name == null) name = login;
            if (email == null) email = login + "@users.noreply.github.com";
        }

        String finalEmail = email;
        String finalName = name != null ? name : finalEmail;
        LocalUser.Provider finalProvider = provider;

        if (finalEmail != null) {
            users.findByUsername(finalEmail).orElseGet(() ->
                    users.save(new LocalUser(finalEmail, finalName, finalEmail, finalProvider))
            );
        }

        setDefaultTargetUrl(frontendUrl + "/oauth-callback");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}