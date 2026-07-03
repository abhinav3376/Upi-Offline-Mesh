package com.Abhinav.UPI.Offline.config;

import com.Abhinav.UPI.Offline.model.LocalUser;
import com.Abhinav.UPI.Offline.model.LocalUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Backs password-based login (/api/auth/login) via Spring's standard
 * DaoAuthenticationProvider. Only LOCAL-provider users have a password to
 * check — Google/GitHub users fail closed here rather than risk a
 * null-password comparison ever passing.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private LocalUserRepository users;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LocalUser user = users.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No such user: " + username));

        if (user.getProvider() != LocalUser.Provider.LOCAL || user.getPassword() == null) {
            throw new UsernameNotFoundException("Account uses social login: " + username);
        }

        return User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
    }
}