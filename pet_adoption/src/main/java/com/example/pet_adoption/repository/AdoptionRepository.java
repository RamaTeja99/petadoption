package com.example.pet_adoption.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.pet_adoption.model.Adoption;
import com.example.pet_adoption.model.Pet;
import com.example.pet_adoption.model.User;

import java.util.List;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, Long> {
    List<Adoption> findByUser(User user);
    List<Adoption> findByPet(Pet pet);
    List<Adoption> findByPetId(Long petId);
    List<Adoption> findByUserId(Long userId);
}