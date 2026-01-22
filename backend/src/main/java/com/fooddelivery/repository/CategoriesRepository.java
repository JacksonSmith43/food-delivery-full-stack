package com.fooddelivery.repository;

import com.fooddelivery.entity.Categories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    Optional<Categories> findByCategorie(String categorie);
}
