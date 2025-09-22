package com.example.pet_adoption.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.pet_adoption.model.Adoption;
import com.example.pet_adoption.model.Pet;
import com.example.pet_adoption.repository.AdoptionRepository;
import com.example.pet_adoption.repository.PetRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

@Service
public class PetService {
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionRepository adoptionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public Map<String, Object> loginShelter(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Pet> petOptional = petRepository.findByShelterEmail(email);
            
            if (petOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }
            
            Pet pet = petOptional.get();
            JsonNode shelterNode = objectMapper.readTree(pet.getShelter());
            String hashedPassword = shelterNode.get("password").asText();
            
            if (passwordEncoder.matches(password, hashedPassword)) {
                String token = "shelter-token-" + pet.getId() + "-" + System.currentTimeMillis();
                response.put("success", true);
                response.put("token", token);
                response.put("petId", pet.getId());
                response.put("message", "Shelter login successful");
            } else {
                response.put("success", false);
                response.put("message", "Invalid credentials");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> getShelterAdoptions(Long petId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Adoption> adoptions = adoptionRepository.findByPetId(petId);
            
            response.put("success", true);
            response.put("adoptions", adoptions);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> cancelAdoption(Long petId, Long adoptionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Adoption> adoptionOptional = adoptionRepository.findById(adoptionId);
            
            if (adoptionOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Adoption Visit Not Found");
                return response;
            }
            
            Adoption adoption = adoptionOptional.get();
            
            if (!adoption.getPet().getId().equals(petId)) {
                response.put("success", false);
                response.put("message", "Adoption Visit Not Found");
                return response;
            }
            
            adoption.setCancelled(true);
            adoptionRepository.save(adoption);
            
            response.put("success", true);
            response.put("message", "Adoption Visit Cancelled");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> completeAdoption(Long petId, Long adoptionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Adoption> adoptionOptional = adoptionRepository.findById(adoptionId);
            
            if (adoptionOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Adoption Not Found");
                return response;
            }
            
            Adoption adoption = adoptionOptional.get();
            
            if (!adoption.getPet().getId().equals(petId)) {
                response.put("success", false);
                response.put("message", "Adoption Not Found");
                return response;
            }
            
            adoption.setIsCompleted(true);
            adoptionRepository.save(adoption);
            
            // Mark pet as unavailable after successful adoption
            Pet pet = adoption.getPet();
            pet.setAvailable(false);
            petRepository.save(pet);
            
            response.put("success", true);
            response.put("message", "Adoption Completed");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> getAllPets() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Pet> pets = petRepository.findAll();
            
            response.put("success", true);
            response.put("pets", pets);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> changeAvailability(Long petId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Pet> petOptional = petRepository.findById(petId);
            
            if (petOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Pet not found");
                return response;
            }
            
            Pet pet = petOptional.get();
            pet.setAvailable(!pet.getAvailable());
            petRepository.save(pet);
            
            response.put("success", true);
            response.put("message", "Availability Changed");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> getPetProfile(Long petId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Pet> petOptional = petRepository.findById(petId);
            
            if (petOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Pet not found");
                return response;
            }
            
            Pet pet = petOptional.get();
            response.put("success", true);
            response.put("profileData", pet);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> updatePetProfile(Long petId, Double fees, String address, 
                                               Boolean available, String about) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Pet> petOptional = petRepository.findById(petId);
            
            if (petOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Pet not found");
                return response;
            }
            
            Pet pet = petOptional.get();
            if (fees != null) pet.setFees(fees);
            if (address != null) pet.setAddress(address);
            if (available != null) pet.setAvailable(available);
            if (about != null) pet.setAbout(about);
            
            petRepository.save(pet);
            
            response.put("success", true);
            response.put("message", "Pet Profile Updated");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> getShelterDashboard(Long petId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Adoption> adoptions = adoptionRepository.findByPetId(petId);
            
            double earnings = 0;
            for (Adoption adoption : adoptions) {
                if (adoption.getIsCompleted() || adoption.getPayment()) {
                    earnings += adoption.getAmount();
                }
            }
            
            Set<Long> visitors = new HashSet<>();
            for (Adoption adoption : adoptions) {
                visitors.add(adoption.getUser().getId());
            }
            
            Map<String, Object> dashData = new HashMap<>();
            dashData.put("earnings", earnings);
            dashData.put("adoptions", adoptions.size());
            dashData.put("visitors", visitors.size());
            dashData.put("latestAdoptions", adoptions);
            
            response.put("success", true);
            response.put("dashData", dashData);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
}
