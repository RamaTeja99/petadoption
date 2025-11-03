package com.example.pet_adoption.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pets")
public class Pet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Pet name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Breed is required")
    @Column(nullable = false)
    private String breed;
    
    @NotBlank(message = "Age is required")
    @Column(nullable = false)
    private String age;
    
    @NotBlank(message = "Gender is required")
    @Column(nullable = false)
    private String gender;
    
    @NotBlank(message = "About information is required")
    @Column(columnDefinition = "TEXT")
    private String about;
    
    @Column(nullable = false)
    private Boolean available = true;
    
    @NotNull(message = "Adoption fees is required")
    @Positive(message = "Adoption fees must be positive")
    @Column(nullable = false)
    private Double fees;
    
    @Column(columnDefinition = "JSON")
    private String slotsBooked = "{}";
    
    @Column(columnDefinition = "JSON", nullable = false)
    private String address;
    
    @Column(name = "created_date")
    private LocalDateTime date;
    
    private String image;
    
    @Column(columnDefinition = "JSON", nullable = false)
    private String shelter;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    @JsonManagedReference 
    private List<Adoption> adoptions;
    
    public Pet() {
        this.date = LocalDateTime.now();
    }
    
    public Pet(String name, String breed, String age, String gender, String about, 
               Double fees, String address, String shelter, String image) {
        this();
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.about = about;
        this.fees = fees;
        this.address = address;
        this.shelter = shelter;
        this.image = image;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getBreed() {
        return breed;
    }
    
    public void setBreed(String breed) {
        this.breed = breed;
    }
    
    public String getAge() {
        return age;
    }
    
    public void setAge(String age) {
        this.age = age;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getAbout() {
        return about;
    }
    
    public void setAbout(String about) {
        this.about = about;
    }
    
    public Boolean getAvailable() {
        return available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }
    
    public Double getFees() {
        return fees;
    }
    
    public void setFees(Double fees) {
        this.fees = fees;
    }
    
    public String getSlotsBooked() {
        return slotsBooked;
    }
    
    public void setSlotsBooked(String slotsBooked) {
        this.slotsBooked = slotsBooked;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public String getImage() {
        return image;
    }
    
    public void setImage(String image) {
        this.image = image;
    }
    
    public String getShelter() {
        return shelter;
    }
    
    public void setShelter(String shelter) {
        this.shelter = shelter;
    }
    
    public List<Adoption> getAdoptions() {
        return adoptions;
    }
    
    public void setAdoptions(List<Adoption> adoptions) {
        this.adoptions = adoptions;
    }
}