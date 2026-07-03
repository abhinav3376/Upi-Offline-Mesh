
package com.Abhinav.UPI.Offline.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocalUserRepository extends JpaRepository<LocalUser, Long> {
    Optional<LocalUser> findByUsername(String username);
}
