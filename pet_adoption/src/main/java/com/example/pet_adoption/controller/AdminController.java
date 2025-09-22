package com.example.pet_adoption.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.pet_adoption.service.AdminService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Map<String, Object> response = adminService.loginAdmin(email, password);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/adoptions")
    public ResponseEntity<Map<String, Object>> getAllAdoptions(@RequestHeader("atoken") String token) {
        Map<String, Object> response = adminService.getAllAdoptions();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/cancel-adoption")
    public ResponseEntity<Map<String, Object>> cancelAdoption(@RequestHeader("atoken") String token,
                                                             @RequestBody Map<String, Long> adoptionData) {
        Long adoptionId = adoptionData.get("adoptionId");
        
        Map<String, Object> response = adminService.cancelAdoption(adoptionId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/add-pet")
    public ResponseEntity<Map<String, Object>> addPet(@RequestHeader("atoken") String token,
                                                     @RequestParam("name") String name,
                                                     @RequestParam("breed") String breed,
                                                     @RequestParam("age") String age,
                                                     @RequestParam("gender") String gender,
                                                     @RequestParam("about") String about,
                                                     @RequestParam("fees") Double fees,
                                                     @RequestParam("address") String address,
                                                     @RequestParam("shelter") String shelter,
                                                     @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        Map<String, Object> response = adminService.addPet(name, breed, age, gender, about, fees, address, shelter, imageFile);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all-pets")
    public ResponseEntity<Map<String, Object>> getAllPets(@RequestHeader("atoken") String token) {
        Map<String, Object> response = adminService.getAllPets();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminDashboard(@RequestHeader("atoken") String token) {
        Map<String, Object> response = adminService.getAdminDashboard();
        return ResponseEntity.ok(response);
    }
}
