package com.fooddelivery.service;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.fooddelivery.dto.FavouriteResponseDTO;
import com.fooddelivery.entity.Favourites;
import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.FavouriteAlreadyExistsException;
import com.fooddelivery.exception.FavouriteDoesNotExistException;
import com.fooddelivery.exception.MenuItemDoesNotExistException;
import com.fooddelivery.exception.UserNotFoundException;

import com.fooddelivery.repository.FavouritesRepository;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.UserRepository;

@Service
public class FavouritesService {

    private final FavouritesRepository favouritesRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    public FavouritesService(FavouritesRepository favouritesRepository, UserRepository userRepository,
            MenuItemRepository menuItemRepository) {
        this.favouritesRepository = favouritesRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public Long addFavourites(Long userId, Long menuItemIds) {
        System.out.println("FavouritesService_addFavourites().");

        User user = userRepository.getReferenceById(userId);
        MenuItem menuItem = menuItemRepository.findById(menuItemIds).orElse(null);

        if (user == null) {
            throw new UserNotFoundException("User does not exist.");
        }

        if (menuItem == null) {
            throw new MenuItemDoesNotExistException("Menu item does not exist.");
        }

        if (!favouritesRepository.existsByUserIdAndMenuItemsId(userId, menuItem.getId())) {
            System.out.println("FavouritesService_addFavourites_menuItem: " + menuItem);
            Favourites favourites = new Favourites();
            favourites.setMenuItems(menuItem);
            favourites.setUser(user);
            favouritesRepository.save(favourites);

        } else {
            throw new FavouriteAlreadyExistsException("Favourite already exists.");
        }

        return menuItemIds;

    }

    public Long removeFavourites(Long userId, Long menuItemIds) {
        System.out.println("FavouritesService_removeFavourites().");

        MenuItem menuItem = menuItemRepository.findById(menuItemIds).orElse(null);

        if (menuItem == null) {
            throw new MenuItemDoesNotExistException(
                    "Menu item does not exist. Unable to delete items that do not exist.");
        }

        if (!favouritesRepository.existsByUserIdAndMenuItemsId(userId, menuItem.getId())) {
            throw new FavouriteDoesNotExistException(
                    "Favourite does not exist. Unable to delete items that do not exist.");
        }

        favouritesRepository.deleteByUserIdAndMenuItemsId(userId, menuItem.getId());
        return menuItemIds;
    }

    public List<Long> getFavouriteMenuItemIds(Long userId) {
        System.out.println("FavouritesService_getFavouriteMenuItemIds().");

        User user = userRepository.getReferenceById(userId);
        if (user == null) {
            throw new UserNotFoundException("User does not exist.");
        }

        return favouritesRepository.findAll().stream()
                .filter(fav -> fav.getUser().getId().equals(userId))
                .map(fav -> fav.getMenuItems().getId())
                .peek(menuItemId -> System.out
                        .println("FavouritesService_getFavouriteMenuItemIds()_menuItemId: " + menuItemId))
                .toList();
    }

    public Stream<FavouriteResponseDTO> getFavouriteMenuItems(Long userId) {
        System.out.println("FavouritesService_getFavouriteMenuItems().");

        User user = userRepository.getReferenceById(userId);
        if (user == null) {
            throw new UserNotFoundException("User does not exist.");
        }

        return favouritesRepository.findAll().stream().filter(fav -> fav.getUser().getId().equals(userId))
                .map(fav -> new FavouriteResponseDTO(fav.getMenuItems().getId(), fav.getMenuItems().getFoodName(),
                        fav.getMenuItems().getFoodImage(), fav.getMenuItems().getPrice(),
                        fav.getMenuItems().getRestaurant().getRestaurantName()))
                .peek(favResponse -> System.out
                        .println("FavouritesService_getFavouriteMenuItems()_favResponse: " + favResponse))
                .toList().stream();

    }
}
