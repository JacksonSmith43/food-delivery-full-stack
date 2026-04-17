package com.fooddelivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Favourites;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.User;
import com.fooddelivery.repository.FavouritesRepository;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class FavouritesService {
    @Autowired
    private FavouritesRepository favouritesRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public Long addFavourites(Long userId, Long menuItemIds) {
        System.out.println("FavouritesService_addFavourites().");

        User user = userRepository.getReferenceById(userId);
        MenuItem menuItem = menuItemRepository.findById(menuItemIds).orElse(null);

        if (!favouritesRepository.existsByUserIdAndMenuItemsId(userId, menuItem.getId())) {
            System.out.println("FavouritesService_addFavourites_menuItem: " + menuItem);
            Favourites favourites = new Favourites();
            favourites.setMenuItems(menuItem);
            favourites.setUser(user);
            favouritesRepository.save(favourites);
        }

        return menuItemIds;
    }

    public Long removeFavourites(Long userId, Long menuItemIds) {
        System.out.println("FavouritesService_removeFavourites().");

        MenuItem menuItem = menuItemRepository.findById(menuItemIds).orElse(null);

        if (favouritesRepository.existsByUserIdAndMenuItemsId(userId, menuItem.getId())) {
            System.out.println("FavouritesService_removeFavourites_menuItem: " + menuItem);
            favouritesRepository.deleteById(menuItemIds);
            menuItemRepository.deleteById(menuItemIds);
        }
        return menuItemIds;
    }
}
