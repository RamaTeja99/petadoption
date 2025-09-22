package com.example.pet_adoption.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.pet_adoption.service.PetService;
import com.example.pet_adoption.model.Pet;
import java.util.*;

@RestController
@RequestMapping("/pet")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllPets() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("PetController: Get all pets request");
            
            // Return sample pets data - no authentication needed
            List<Map<String, Object>> samplePets = createSamplePetsData();
            
            response.put("success", true);
            response.put("pets", samplePets);
            
            System.out.println("PetController: Returned " + samplePets.size() + " pets");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("PetController: Get pets failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to load pets");
            response.put("pets", Collections.emptyList());
            return ResponseEntity.ok(response); // Return 200 with empty list rather than error
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPetById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("PetController: Get pet by ID: " + id);
            
            List<Map<String, Object>> samplePets = createSamplePetsData();
            Map<String, Object> pet = samplePets.stream()
                .filter(p -> p.get("id").equals(id))
                .findFirst()
                .orElse(null);
            
            if (pet != null) {
                response.put("success", true);
                response.put("pet", pet);
            } else {
                response.put("success", false);
                response.put("message", "Pet not found");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("PetController: Get pet by ID failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to load pet details");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addPet(@RequestBody Pet pet) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("PetController: Add pet request for " + pet.getName());
            response.put("success", true);
            response.put("message", "Pet added successfully");
            response.put("petId", System.currentTimeMillis()); // Mock ID
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("PetController: Add pet failed: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to add pet");
            return ResponseEntity.ok(response);
        }
    }

    private List<Map<String, Object>> createSamplePetsData() {
        List<Map<String, Object>> pets = new ArrayList<>();
        
        // Sample Pet 1
        Map<String, Object> pet1 = new HashMap<>();
        pet1.put("id", 1L);
        pet1.put("name", "Buddy");
        pet1.put("image", "/pet1.png");
        pet1.put("breed", "Golden Retriever");
        pet1.put("age", "2 Years");
        pet1.put("gender", "Male");
        pet1.put("fees", 500);
        pet1.put("about", "Friendly Golden Retriever looking for a loving home. Great with kids and other pets.");
        pet1.put("available", true);
        pet1.put("address", "{\"line1\": \"123 Pet St\", \"line2\": \"Pet City\"}");
        pet1.put("slotsBooked", "{}");
        pets.add(pet1);
        
        // Sample Pet 2
        Map<String, Object> pet2 = new HashMap<>();
        pet2.put("id", 2L);
        pet2.put("name", "Whiskers");
        pet2.put("image", "/pet2.png");
        pet2.put("breed", "Persian Cat");
        pet2.put("age", "1 Year");
        pet2.put("gender", "Female");
        pet2.put("fees", 300);
        pet2.put("about", "Gentle Persian cat who loves to cuddle. Very calm and well-behaved.");
        pet2.put("available", true);
        pet2.put("address", "{\"line1\": \"456 Cat Ave\", \"line2\": \"Cat Town\"}");
        pet2.put("slotsBooked", "{}");
        pets.add(pet2);
        
        // Sample Pet 3
        Map<String, Object> pet3 = new HashMap<>();
        pet3.put("id", 3L);
        pet3.put("name", "Charlie");
        pet3.put("image", "/pet3.png");
        pet3.put("breed", "Labrador");
        pet3.put("age", "3 Years");
        pet3.put("gender", "Male");
        pet3.put("fees", 450);
        pet3.put("about", "Energetic Labrador who loves playing fetch. Perfect for active families.");
        pet3.put("available", true);
        pet3.put("address", "{\"line1\": \"789 Dog Park Rd\", \"line2\": \"Happy Town\"}");
        pet3.put("slotsBooked", "{}");
        pets.add(pet3);
        
        return pets;
    }
}