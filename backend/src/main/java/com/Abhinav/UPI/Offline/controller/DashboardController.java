package com.Abhinav.UPI.Offline.controller;


import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class DashboardController {

    @GetMapping("/")
    public String home(Principal principal, Model model) {
        model.addAttribute("username", displayName(principal));
        return "dashboard";
    }

    /**
     * Local logins use the chosen username as Principal#getName() directly.
     * Google logins are an OAuth2AuthenticationToken whose default name is
     * the opaque "sub" id, so pull the friendlier "name" attribute instead.
     */
    private String displayName(Principal principal) {
        if (principal instanceof OAuth2AuthenticationToken oauthToken) {
            OAuth2User oUser = oauthToken.getPrincipal();
            String name = oUser.getAttribute("name");
            return name != null ? name : oauthToken.getName();
        }
        return principal != null ? principal.getName() : "guest";
    }
}