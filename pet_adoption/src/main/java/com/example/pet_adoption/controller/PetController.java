package com.example.pet_adoption.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.pet_adoption.service.PetService;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "*")
public class PetController {
    
    @Autowired
    private PetService petService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginShelter(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Map<String, Object> response = petService.loginShelter(email, password);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/welcome")
    public String welcome() {
        return new String("Welcome to Pet Adoption Service Server is running...");
    }
    
    @GetMapping("/adoptions")
    public ResponseEntity<Map<String, Object>> getShelterAdoptions(@RequestHeader("stoken") String token,
                                                                  @RequestAttribute("petId") Long petId) {
        Map<String, Object> response = petService.getShelterAdoptions(petId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/cancel-adoption")
    public ResponseEntity<Map<String, Object>> cancelAdoption(@RequestHeader("stoken") String token,
                                                             @RequestAttribute("petId") Long petId,
                                                             @RequestBody Map<String, Long> adoptionData) {
        Long adoptionId = adoptionData.get("adoptionId");
        
        Map<String, Object> response = petService.cancelAdoption(petId, adoptionId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/complete-adoption")
    public ResponseEntity<Map<String, Object>> completeAdoption(@RequestHeader("stoken") String token,
                                                               @RequestAttribute("petId") Long petId,
                                                               @RequestBody Map<String, Long> adoptionData) {
        Long adoptionId = adoptionData.get("adoptionId");
        
        Map<String, Object> response = petService.completeAdoption(petId, adoptionId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllPets() {
        Map<String, Object> response = petService.getAllPets();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/change-availability")
    public ResponseEntity<Map<String, Object>> changeAvailability(@RequestHeader("stoken") String token,
                                                                 @RequestBody Map<String, Long> petData) {
        Long petId = petData.get("petId");
        
        Map<String, Object> response = petService.changeAvailability(petId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getPetProfile(@RequestHeader("stoken") String token,
                                                            @RequestAttribute("petId") Long petId) {
        Map<String, Object> response = petService.getPetProfile(petId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updatePetProfile(@RequestHeader("stoken") String token,
                                                               @RequestAttribute("petId") Long petId,
                                                               @RequestBody Map<String, Object> updateData) {
        
        Double fees = updateData.get("fees") != null ? Double.valueOf(updateData.get("fees").toString()) : null;
        String address = (String) updateData.get("address");
        Boolean available = updateData.get("available") != null ? (Boolean) updateData.get("available") : null;
        String about = (String) updateData.get("about");
        
        Map<String, Object> response = petService.updatePetProfile(petId, fees, address, available, about);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getShelterDashboard(@RequestHeader("stoken") String token,
                                                                  @RequestAttribute("petId") Long petId) {
        Map<String, Object> response = petService.getShelterDashboard(petId);
        return ResponseEntity.ok(response);
    }
}