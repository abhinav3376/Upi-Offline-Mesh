package com.Abhinav.UPI.Offline.controller;

import com.Abhinav.UPI.Offline.model.LocalUser;
import com.Abhinav.UPI.Offline.model.LocalUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    @Autowired private LocalUserRepository users;
    @Autowired private SecurityContextRepository securityContextRepository;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @GetMapping("/login")
    public String loginPage() {
        return "redirect:" + frontendUrl + "/login";
    }

    @PostMapping("/auth/local")
    public String localLogin(@RequestParam String name, @RequestParam String username,
                             HttpServletRequest request, HttpServletResponse response) {

        LocalUser user = users.findByUsername(username)
                .orElseGet(() -> new LocalUser(username, name, null, LocalUser.Provider.LOCAL));
        user.setName(name);
        users.save(user);

        var authorities = AuthorityUtils.createAuthorityList("ROLE_USER");
        var authToken = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return "redirect:/";
    }
}