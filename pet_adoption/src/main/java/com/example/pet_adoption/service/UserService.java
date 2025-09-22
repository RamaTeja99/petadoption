package com.example.pet_adoption.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.pet_adoption.dto.UserRegistrationDto;
import com.example.pet_adoption.model.Adoption;
import com.example.pet_adoption.model.Pet;
import com.example.pet_adoption.model.User;
import com.example.pet_adoption.repository.AdoptionRepository;
import com.example.pet_adoption.repository.PetRepository;
import com.example.pet_adoption.repository.UserRepository;
import com.example.pet_adoption.util.FileUploadUtil;
import com.example.pet_adoption.util.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private AdoptionRepository adoptionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private FileUploadUtil fileUploadUtil;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public Map<String, Object> registerUser(UserRegistrationDto registrationDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (userRepository.existsByEmail(registrationDto.getEmail())) {
                response.put("success", false);
                response.put("message", "User already exists with this email");
                return response;
            }
            
            User user = new User();
            user.setName(registrationDto.getName());
            user.setEmail(registrationDto.getEmail());
            user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
            user.setImage("default-user.png");
            User savedUser = userRepository.save(user);
            String token = jwtUtil.generateToken(savedUser.getId().toString());
            
            response.put("success", true);
            response.put("token", token);
            response.put("message", "User registered successfully");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User does not exist");
                return response;
            }
            
            User user = userOptional.get();
            
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getId().toString());
                response.put("success", true);
                response.put("token", token);
                response.put("message", "Login successful");
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
    
    public Map<String, Object> getUserProfile(Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }
            
            User user = userOptional.get();
            response.put("success", true);
            response.put("userData", user);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> updateUserProfile(Long userId, String name, String phone, 
                                                 String address, String dob, String gender, 
                                                 MultipartFile imageFile) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }
            
            User user = userOptional.get();
            user.setName(name);
            user.setPhone(phone);
            user.setAddress(address);
            user.setDob(dob);
            user.setGender(gender);
            
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileUploadUtil.saveFile(imageFile);
                user.setImage(imageUrl);
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Profile Updated");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> bookAdoption(Long userId, Long petId, String slotDate, String slotTime) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            Optional<Pet> petOptional = petRepository.findById(petId);
            
            if (userOptional.isEmpty() || petOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User or Pet not found");
                return response;
            }
            
            User user = userOptional.get();
            Pet pet = petOptional.get();
            
            if (!pet.getAvailable()) {
                response.put("success", false);
                response.put("message", "Pet Not Available for Adoption");
                return response;
            }
            
            // Check slot availability
            JsonNode slotsBookedNode = objectMapper.readTree(pet.getSlotsBooked());
            Map<String, Object> slotsBooked = objectMapper.convertValue(slotsBookedNode, Map.class);
            
            if (slotsBooked.containsKey(slotDate)) {
                List<String> dateSlots = (List<String>) slotsBooked.get(slotDate);
                if (dateSlots.contains(slotTime)) {
                    response.put("success", false);
                    response.put("message", "Slot Not Available");
                    return response;
                }
                dateSlots.add(slotTime);
            } else {
                List<String> dateSlots = List.of(slotTime);
                slotsBooked.put(slotDate, dateSlots);
            }
            
            // Create adoption
            String userData = objectMapper.writeValueAsString(user);
            String petData = objectMapper.writeValueAsString(pet);
            
            Adoption adoption = new Adoption(user, pet, slotDate, slotTime, userData, petData, pet.getFees());
            adoptionRepository.save(adoption);
            
            // Update pet slots
            pet.setSlotsBooked(objectMapper.writeValueAsString(slotsBooked));
            petRepository.save(pet);
            
            response.put("success", true);
            response.put("message", "Adoption Visit Booked");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> cancelAdoption(Long userId, Long adoptionId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Adoption> adoptionOptional = adoptionRepository.findById(adoptionId);
            
            if (adoptionOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Adoption not found");
                return response;
            }
            
            Adoption adoption = adoptionOptional.get();
            
            if (!adoption.getUser().getId().equals(userId)) {
                response.put("success", false);
                response.put("message", "Unauthorized action");
                return response;
            }
            
            adoption.setCancelled(true);
            adoptionRepository.save(adoption);
            
            // Release pet slot
            Pet pet = adoption.getPet();
            JsonNode slotsBookedNode = objectMapper.readTree(pet.getSlotsBooked());
            Map<String, Object> slotsBooked = objectMapper.convertValue(slotsBookedNode, Map.class);
            
            if (slotsBooked.containsKey(adoption.getSlotDate())) {
                List<String> dateSlots = (List<String>) slotsBooked.get(adoption.getSlotDate());
                dateSlots.remove(adoption.getSlotTime());
                slotsBooked.put(adoption.getSlotDate(), dateSlots);
                pet.setSlotsBooked(objectMapper.writeValueAsString(slotsBooked));
                petRepository.save(pet);
            }
            
            response.put("success", true);
            response.put("message", "Adoption Visit Cancelled");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> listUserAdoptions(Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Adoption> adoptions = adoptionRepository.findByUserId(userId);
            
            response.put("success", true);
            response.put("adoptions", adoptions);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        
        return response;
    }
}