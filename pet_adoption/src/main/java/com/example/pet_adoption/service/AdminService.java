package com.example.pet_adoption.service;


import com.example.pet_adoption.model.Adoption;
import com.example.pet_adoption.model.Pet;
import com.example.pet_adoption.model.User;
import com.example.pet_adoption.repository.AdoptionRepository;
import com.example.pet_adoption.repository.PetRepository;
import com.example.pet_adoption.repository.UserRepository;
import com.example.pet_adoption.util.FileUploadUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionRepository adoptionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private FileUploadUtil fileUploadUtil;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${admin.email}")
    private String adminEmail;
    
    @Value("${admin.password}")
    private String adminPassword;
    
    public Map<String, Object> loginAdmin(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (email.equals(adminEmail) && password.equals(adminPassword)) {
                String token = "admin-token-" + System.currentTimeMillis();
                response.put("success", true);
                response.put("token", token);
                response.put("message", "Admin login successful");
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
    
    public Map<String, Object> getAllAdoptions() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Adoption> adoptions = adoptionRepository.findAll();
            
            response.put("success", true);
            response.put("adoptions", adoptions);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> cancelAdoption(Long adoptionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Adoption> adoptionOptional = adoptionRepository.findById(adoptionId);
            
            if (adoptionOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Adoption not found");
                return response;
            }
            
            Adoption adoption = adoptionOptional.get();
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
    
    public Map<String, Object> addPet(String name, String breed, String age, String gender, 
                                     String about, Double fees, String address, String shelter, 
                                     MultipartFile imageFile) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (name == null || breed == null || age == null || gender == null || 
                about == null || fees == null || address == null || shelter == null) {
                response.put("success", false);
                response.put("message", "Missing Details");
                return response;
            }
            
            // Parse and validate shelter data
            Map<String, Object> shelterData = objectMapper.readValue(shelter, Map.class);
            String shelterEmail = (String) shelterData.get("email");
            String shelterPassword = (String) shelterData.get("password");
            
            if (shelterEmail == null || !shelterEmail.contains("@")) {
                response.put("success", false);
                response.put("message", "Please enter a valid shelter email");
                return response;
            }
            
            if (shelterPassword != null && shelterPassword.length() < 8) {
                response.put("success", false);
                response.put("message", "Please enter a strong password for shelter");
                return response;
            }
            
            // Hash shelter password if provided
            if (shelterPassword != null) {
                shelterData.put("password", passwordEncoder.encode(shelterPassword));
            }
            
            // Upload image
            String imageUrl = "";
            if (imageFile != null && !imageFile.isEmpty()) {
                imageUrl = fileUploadUtil.saveFile(imageFile);
            }
            
            Pet pet = new Pet();
            pet.setName(name);
            pet.setBreed(breed);
            pet.setAge(age);
            pet.setGender(gender);
            pet.setAbout(about);
            pet.setFees(fees);
            pet.setAddress(address);
            pet.setShelter(objectMapper.writeValueAsString(shelterData));
            pet.setImage(imageUrl);
            
            petRepository.save(pet);
            
            response.put("success", true);
            response.put("message", "Pet Added for Adoption");
            
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
    
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Pet> pets = petRepository.findAll();
            List<User> users = userRepository.findAll();
            List<Adoption> adoptions = adoptionRepository.findAll();
            
            Map<String, Object> dashData = new HashMap<>();
            dashData.put("pets", pets.size());
            dashData.put("adoptions", adoptions.size());
            dashData.put("users", users.size());
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