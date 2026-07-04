package com.fooddelivery.controller;

import java.util.List;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.dto.FavouriteResponseDTO;
import com.fooddelivery.service.FavouritesService;

@Controller
@RestController()
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:4200")
public class FavouritesController {
    private final FavouritesService favouritesService;

    FavouritesController(FavouritesService favouritesService) {
        this.favouritesService = favouritesService;
    }

    @PostMapping("favourites/addToFavourites/{userId}")
    public ResponseEntity<Long> addFavourites(@PathVariable Long userId, @RequestBody Long menuItemId) {
        System.out.println("FavouritesController_addFavourites().");
        System.out.println("FavouritesController_addFavourites()_menuItemId: " + menuItemId);

        Long favouriteItems = favouritesService.addFavourites(userId, menuItemId);
        return ResponseEntity.ok(favouriteItems);
    }

    @PostMapping("favourites/removeFromFavourites/{userId}")
    public ResponseEntity<Long> removeFavourites(@PathVariable Long userId, @RequestBody Long menuItemsIds) {
        System.out.println("FavouritesController_removeFavourites().");
        System.out.println("FavouritesController_removeFavourites()_menuItemsIds: " + menuItemsIds);

        Long favouriteItems = favouritesService.removeFavourites(userId, menuItemsIds);
        return ResponseEntity.ok(favouriteItems);
    }

    @GetMapping("favourites/{userId}")
    public ResponseEntity<List<Long>> getFavouriteMenuItemIds(@PathVariable Long userId) {
        System.out.println("FavouritesController_getFavouriteMenuItemIds().");

        List<Long> menuIds = this.favouritesService.getFavouriteMenuItemIds(userId);
        System.out.println("FavouritesController_getFavouriteMenuItemIds()_menuIds: " + menuIds);

        return ResponseEntity.ok(menuIds);
    }

    @GetMapping("allFavourites/{userId}")
    public ResponseEntity<Stream<FavouriteResponseDTO>> getFavouriteMenuItems(@PathVariable Long userId) {
        System.out.println("FavouritesController_getFavouriteMenuItems().");

        Stream<FavouriteResponseDTO> menuName = this.favouritesService.getFavouriteMenuItems(userId);

        return ResponseEntity.ok(menuName);
    }
}
