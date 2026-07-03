package com.Abhinav.UPI.Offline.controller;

import com.Abhinav.UPI.Offline.model.LocalUser;
import com.Abhinav.UPI.Offline.model.LocalUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * JSON auth surface for the React frontend: password signup/login, session
 * check, logout. Complements (doesn't replace) the OAuth2 flow — Google and
 * GitHub still go through /oauth2/authorization/{google|github} directly,
 * driven by full-page redirects from the frontend, not fetch() calls here.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @Autowired private LocalUserRepository users;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private SecurityContextRepository securityContextRepository;

    public record SignupRequest(String name, String username, String password) {}
    public record LoginRequest(String username, String password) {}

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req,
                                    HttpServletRequest request, HttpServletResponse response) {
        if (req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Username is required and password must be at least 6 characters"));
        }
        if (users.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.status(409).body(Map.of(
                    "error", "An account with that username already exists"));
        }

        LocalUser user = new LocalUser(req.username(),
                req.name() != null && !req.name().isBlank() ? req.name() : req.username(),
                null, LocalUser.Provider.LOCAL);
        user.setPassword(passwordEncoder.encode(req.password()));
        users.save(user);

        establishSession(user.getUsername(), request, response);
        return ResponseEntity.ok(toUserJson(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req,
                                   HttpServletRequest request, HttpServletResponse response) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username(), req.password()));

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            LocalUser user = users.findByUsername(req.username()).orElseThrow();
            return ResponseEntity.ok(toUserJson(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not signed in"));
        }
        String username = resolveUsername(principal);
        return users.findByUsername(username)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toUserJson(u)))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Not signed in")));
    }

    private String resolveUsername(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken oauthToken) {
            OAuth2User oUser = oauthToken.getPrincipal();
            String email = oUser.getAttribute("email");
            if (email != null) return email;
            String login = oUser.getAttribute("login");
            return login != null ? login + "@users.noreply.github.com" : oauthToken.getName();
        }
        return principal.getName();
    }

    private void establishSession(String username, HttpServletRequest request, HttpServletResponse response) {
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        var authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

    private Map<String, Object> toUserJson(LocalUser u) {
        return Map.of(
                "username", u.getUsername(),
                "name", u.getName(),
                "provider", u.getProvider().name()
        );
    }
}