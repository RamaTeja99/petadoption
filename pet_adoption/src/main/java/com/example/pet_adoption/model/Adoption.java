package com.example.pet_adoption.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "adoptions")
public class Adoption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonBackReference
    private Pet pet;
    
    @NotBlank(message = "Slot date is required")
    @Column(name = "slot_date", nullable = false)
    private String slotDate;
    
    @NotBlank(message = "Slot time is required")
    @Column(name = "slot_time", nullable = false)
    private String slotTime;
    
    @Column(columnDefinition = "JSON", nullable = false)
    private String userData;
    
    @Column(columnDefinition = "JSON", nullable = false)
    private String petData;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Column(nullable = false)
    private Double amount;
    
    @Column(name = "created_date")
    private LocalDateTime date;
    
    @Column(nullable = false)
    private Boolean cancelled = false;
    
    @Column(nullable = false)
    private Boolean payment = false;
    
    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false;
    
    public Adoption() {
        this.date = LocalDateTime.now();
    }
    
    public Adoption(User user, Pet pet, String slotDate, String slotTime, 
                   String userData, String petData, Double amount) {
        this();
        this.user = user;
        this.pet = pet;
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.userData = userData;
        this.petData = petData;
        this.amount = amount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Pet getPet() {
        return pet;
    }
    
    public void setPet(Pet pet) {
        this.pet = pet;
    }
    
    public String getSlotDate() {
        return slotDate;
    }
    
    public void setSlotDate(String slotDate) {
        this.slotDate = slotDate;
    }
    
    public String getSlotTime() {
        return slotTime;
    }
    
    public void setSlotTime(String slotTime) {
        this.slotTime = slotTime;
    }
    
    public String getUserData() {
        return userData;
    }
    
    public void setUserData(String userData) {
        this.userData = userData;
    }
    
    public String getPetData() {
        return petData;
    }
    
    public void setPetData(String petData) {
        this.petData = petData;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public LocalDateTime getDate() {
        return date;
    }
    
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    
    public Boolean getCancelled() {
        return cancelled;
    }
    
    public void setCancelled(Boolean cancelled) {
        this.cancelled = cancelled;
    }
    
    public Boolean getPayment() {
        return payment;
    }
    
    public void setPayment(Boolean payment) {
        this.payment = payment;
    }
    
    public Boolean getIsCompleted() {
        return isCompleted;
    }
    
    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}