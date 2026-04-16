package com.fooddelivery.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.service.FavouritesService;

@Controller
@RestController()
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:4200")
public class FavouritesController {
    @Autowired
    private FavouritesService favouritesService;

    @PostMapping("favourites/addToFavourites/{userId}")
    public void addFavourites(@PathVariable Long userId, @RequestBody List<Long> menuItemsIds) {
        System.out.println("FavouritesController_addFavourites().");
        System.out.println("FavouritesController_addFavourites()_menuItemsIds: " + menuItemsIds);

        favouritesService.addFavourites(userId, menuItemsIds);
    }
}
