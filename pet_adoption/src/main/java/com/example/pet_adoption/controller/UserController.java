package com.example.pet_adoption.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.pet_adoption.dto.UserRegistrationDto;
import com.example.pet_adoption.service.UserService;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        Map<String, Object> response = userService.registerUser(registrationDto);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Map<String, Object> response = userService.loginUser(email, password);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/get-profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestHeader("token") String token,
                                                             @RequestAttribute("userId") Long userId) {
        Map<String, Object> response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestHeader("token") String token,
                                                            @RequestAttribute("userId") Long userId,
                                                            @RequestParam("name") String name,
                                                            @RequestParam("phone") String phone,
                                                            @RequestParam("address") String address,
                                                            @RequestParam("dob") String dob,
                                                            @RequestParam("gender") String gender,
                                                            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        Map<String, Object> response = userService.updateUserProfile(userId, name, phone, address, dob, gender, imageFile);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/book-adoption")
    public ResponseEntity<Map<String, Object>> bookAdoption(@RequestHeader("token") String token,
                                                           @RequestAttribute("userId") Long userId,
                                                           @RequestBody Map<String, Object> adoptionData) {
        
        Long petId = Long.valueOf(adoptionData.get("petId").toString());
        String slotDate = (String) adoptionData.get("slotDate");
        String slotTime = (String) adoptionData.get("slotTime");
        
        Map<String, Object> response = userService.bookAdoption(userId, petId, slotDate, slotTime);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/adoptions")
    public ResponseEntity<Map<String, Object>> listAdoptions(@RequestHeader("token") String token,
                                                            @RequestAttribute("userId") Long userId) {
        System.out.println("UserId"+userId);
        Map<String, Object> response = userService.listUserAdoptions(userId);
        System.out.println("Responses"+response);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/cancel-adoption")
    public ResponseEntity<Map<String, Object>> cancelAdoption(@RequestHeader("token") String token,
                                                             @RequestAttribute("userId") Long userId,
                                                             @RequestBody Map<String, Long> adoptionData) {
        
        Long adoptionId = adoptionData.get("adoptionId");
        
        Map<String, Object> response = userService.cancelAdoption(userId, adoptionId);
        return ResponseEntity.ok(response);
    }
}