package com.Abhinav.UPI.Offline.model;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * A logged-in person. Rows are created by any of three login paths:
 *   - LOCAL:  password signup/login via AuthApiController (BCrypt-hashed,
 *             see the `password` field below)
 *   - GOOGLE: "Sign in with Google", keyed by email
 *   - GITHUB: "Sign in with GitHub", keyed by email (or a synthetic
 *             username if the GitHub account has no public email)
 */
@Entity
@Table(name = "local_users")
public class LocalUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // chosen username for LOCAL, email for GOOGLE/GITHUB

    @Column(nullable = false)
    private String name;

    @Column
    private String email; // populated for GOOGLE/GITHUB sign-ins

    /**
     * BCrypt hash. Null for OAuth-provisioned users (Google/GitHub) — they
     * never authenticate via this field, only via the provider.
     */
    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(nullable = false)
    private Instant createdAt;

    public enum Provider { LOCAL, GOOGLE, GITHUB }

    public LocalUser() {}

    public LocalUser(String username, String name, String email, Provider provider) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}