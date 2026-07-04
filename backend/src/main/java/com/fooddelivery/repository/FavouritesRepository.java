package com.fooddelivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.entity.Favourites;

import jakarta.transaction.Transactional;

public interface FavouritesRepository extends JpaRepository<Favourites, Long> {
    // Checks whether a user has already favourited a menu item. Used to prevent
    // duplicates.
    boolean existsByUserIdAndMenuItemsId(Long userId, Long menuItemId);

    // Deletes the favourite entry matching both userId and menuItemId.
    @Transactional
    void deleteByUserIdAndMenuItemsId(Long userId, Long menuItemId);
}
