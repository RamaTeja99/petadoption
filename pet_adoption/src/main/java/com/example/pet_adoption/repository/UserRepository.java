package com.example.pet_adoption.repository;

import com.example.pet_adoption.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	    Optional<User> findByEmail(String email);
	    boolean existsByEmail(String email);
}
