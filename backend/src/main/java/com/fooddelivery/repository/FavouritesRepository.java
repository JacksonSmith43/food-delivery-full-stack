package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fooddelivery.entity.Favourites;

@Repository
public interface FavouritesRepository extends JpaRepository<Favourites, Long> {
    // Checks whether a user has already favourited a menu item. Used to prevent
    // duplicates.
    boolean existsByUserIdAndMenuItemsId(Long userId, Long menuItemId);
}
