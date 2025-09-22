package com.example.pet_adoption.repository;

import com.example.pet_adoption.model.Pet;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PetRepository extends JpaRepository<Pet, Long> {
	 List<Pet> findByAvailableTrue();
	    
	    @Query("SELECT p FROM Pet p WHERE JSON_EXTRACT(p.shelter, '$.email') = :email")
	    Optional<Pet> findByShelterEmail(@Param("email") String email);
	    
	    @Query("SELECT p FROM Pet p WHERE JSON_EXTRACT(p.shelter, '$.email') = :email")
	    List<Pet> findAllByShelterEmail(@Param("email") String email);

}
