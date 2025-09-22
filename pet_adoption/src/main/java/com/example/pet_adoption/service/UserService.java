package com.example.pet_adoption.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.pet_adoption.model.User;
import com.example.pet_adoption.repository.UserRepository;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(User user) {
        try {
            System.out.println("UserService: Registering user " + user.getEmail());
            
            // Set default values if not provided
            if (user.getAddress() == null || user.getAddress().isEmpty()) {
                user.setAddress("{\"line1\": \"\", \"line2\": \"\"}");
            }
            
            User savedUser = userRepository.save(user);
            System.out.println("UserService: User registered successfully with ID " + savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            System.out.println("UserService: Registration failed: " + e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    public Optional<User> findByEmail(String email) {
        try {
            System.out.println("UserService: Finding user by email " + email);
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                System.out.println("UserService: User found with ID " + user.get().getId());
            } else {
                System.out.println("UserService: No user found with email " + email);
            }
            return user;
        } catch (Exception e) {
            System.out.println("UserService: Error finding user by email: " + e.getMessage());
            return Optional.empty();
        }
    }
    
    public Optional<User> findById(Long id) {
        try {
            System.out.println("UserService: Finding user by ID " + id);
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                System.out.println("UserService: User found with email " + user.get().getEmail());
            } else {
                System.out.println("UserService: No user found with ID " + id);
            }
            return user;
        } catch (Exception e) {
            System.out.println("UserService: Error finding user by ID: " + e.getMessage());
            return Optional.empty();
        }
    }
    
    public boolean existsByEmail(String email) {
        try {
            boolean exists = userRepository.existsByEmail(email);
            System.out.println("UserService: User exists with email " + email + ": " + exists);
            return exists;
        } catch (Exception e) {
            System.out.println("UserService: Error checking user existence: " + e.getMessage());
            return false;
        }
    }
    
    public User updateUser(Long userId, User updateUser) {
        try {
            System.out.println("UserService: Updating user with ID " + userId);
            
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            
            User existingUser = userOptional.get();
            
            // Update fields if provided
            if (updateUser.getName() != null && !updateUser.getName().isEmpty()) {
                existingUser.setName(updateUser.getName());
            }
            if (updateUser.getPhone() != null && !updateUser.getPhone().isEmpty()) {
                existingUser.setPhone(updateUser.getPhone());
            }
            if (updateUser.getAddress() != null && !updateUser.getAddress().isEmpty()) {
                existingUser.setAddress(updateUser.getAddress());
            }
            if (updateUser.getDob() != null && !updateUser.getDob().isEmpty()) {
                existingUser.setDob(updateUser.getDob());
            }
            if (updateUser.getGender() != null && !updateUser.getGender().isEmpty()) {
                existingUser.setGender(updateUser.getGender());
            }
            
            User savedUser = userRepository.save(existingUser);
            System.out.println("UserService: User updated successfully");
            return savedUser;
        } catch (Exception e) {
            System.out.println("UserService: Update failed: " + e.getMessage());
            throw new RuntimeException("Update failed: " + e.getMessage());
        }
    }
}