package com.example.pet_adoption.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.pet_adoption.service.UserService;
import com.example.pet_adoption.model.User;
import com.example.pet_adoption.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("UserController: Register request for " + user.getEmail());
            
            // Check if user already exists
            if (userService.existsByEmail(user.getEmail())) {
                response.put("success", false);
                response.put("message", "User already exists with this email");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Encrypt password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save user
            User savedUser = userService.registerUser(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());
            
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("userId", savedUser.getId());
            
            System.out.println("UserController: Registration successful for " + user.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("UserController: Registration failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.out.println("UserController: Unexpected error: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Registration failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginUser) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("UserController: Login request for " + loginUser.getEmail());
            
            // Find user by email
            Optional<User> userOptional = userService.findByEmail(loginUser.getEmail());
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOptional.get();
            
            // Check password
            if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("userData", createUserDataResponse(user));
            
            System.out.println("UserController: Login successful for " + user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("UserController: Login failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Login failed");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/get-profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("UserController: Get profile request");
            
            // Get userId from request attributes (set by filter)
            Long userId = (Long) request.getAttribute("userId");
            String userEmail = (String) request.getAttribute("userEmail");
            
            if (userId == null) {
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            System.out.println("UserController: Getting profile for userId: " + userId + ", email: " + userEmail);
            
            // Get user from database
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOptional.get();
            response.put("success", true);
            response.put("userData", createUserDataResponse(user));
            
            System.out.println("UserController: Profile data returned for " + user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("UserController: Get profile failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to load profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateUserProfile(@RequestBody User updateUser, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("UserController: Update profile request");
            
            // Get userId from request attributes (set by filter)
            Long userId = (Long) request.getAttribute("userId");
            
            if (userId == null) {
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // Update user
            User updatedUser = userService.updateUser(userId, updateUser);
            
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("userData", createUserDataResponse(updatedUser));
            
            System.out.println("UserController: Profile updated for userId: " + userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("UserController: Update profile failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Update failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private Map<String, Object> createUserDataResponse(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("address", user.getAddress() != null ? user.getAddress() : "{\"line1\": \"\", \"line2\": \"}");
        userData.put("dob", user.getDob());
        userData.put("gender", user.getGender());
        return userData;
    }
}