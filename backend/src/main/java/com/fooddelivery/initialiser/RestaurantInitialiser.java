package com.fooddelivery.initialiser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.Categories;
import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.CategoriesRepository;
import com.fooddelivery.repository.RestaurantRepository;

import jakarta.annotation.PostConstruct;

@Component
@Order(2)
public class RestaurantInitialiser {
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private CategoriesRepository categoriesRepository;

    @PostConstruct
    public void init() {
        if (restaurantRepository.count() == 0) {
            Restaurants fantasticFeast = new Restaurants("Fantastic Feast and Where to Eat Them",
                    "fantastic-feast-and-where-to-eat-them.png", "23");
            Restaurants lastResort = new Restaurants("Last Resort Diner", "last-resort-diner.png", "10");
            Restaurants getFat = new Restaurants("Get Fat Soon", "get-fat-soon.png", "23");
            Restaurants fryingNemo = new Restaurants("Frying Nemo", "frying-nemo.png", "20");
            Restaurants pizzaToGo = new Restaurants("Pizza To Go", "pizza-to-go.png", "12");
            Restaurants thaiTanic = new Restaurants("ThaiTanic Kitchen", "thaitanic-kitchen.png", "14");
            Restaurants pitaPan = new Restaurants("Pita Pan", "pita-pan.png", "11");
            Restaurants jackGriller = new Restaurants("Jack The Griller", "jack-the-griller.png", "22");
            Restaurants fatFace = new Restaurants("Fat Face", "fat-face.png", "20");
            Restaurants lordWings = new Restaurants("Lord Of The Wings", "lord-of-the-wings.png", "1");
            Restaurants misoHungry = new Restaurants("Miso Hungry", "miso-hungry.png", "20");

            // This retrieves the "Pizza" category out of the database.
            Categories pizza = categoriesRepository.findByCategorie("Pizza").orElse(null);
            Categories burger = categoriesRepository.findByCategorie("Burger").orElse(null);
            Categories thai = categoriesRepository.findByCategorie("Thai").orElse(null);
            Categories chinese = categoriesRepository.findByCategorie("Chinese").orElse(null);
            Categories indian = categoriesRepository.findByCategorie("Indian").orElse(null);
            Categories italian = categoriesRepository.findByCategorie("Italian").orElse(null);
            Categories vegan = categoriesRepository.findByCategorie("Vegan").orElse(null);

            if (pizza != null) {
                getFat.getCategories().add(pizza); // This adds the category to the restaurant.
                pizzaToGo.getCategories().add(pizza);
            }

            if (burger != null) {
                getFat.getCategories().add(burger);
                lastResort.getCategories().add(burger);
                getFat.getCategories().add(burger);
                fatFace.getCategories().add(burger);
                lordWings.getCategories().add(burger);
                jackGriller.getCategories().add(burger);
            }

            if (thai != null) {
                fryingNemo.getCategories().add(thai);
                thaiTanic.getCategories().add(thai);
                pitaPan.getCategories().add(thai);
            }

            if (chinese != null) {
                fantasticFeast.getCategories().add(chinese);
                fryingNemo.getCategories().add(chinese);
                pitaPan.getCategories().add(chinese);
                jackGriller.getCategories().add(chinese);
            }

            if (indian != null) {
                fantasticFeast.getCategories().add(indian);
                getFat.getCategories().add(indian);
                fatFace.getCategories().add(indian);
            }

            if (vegan != null) {
                misoHungry.getCategories().add(vegan);
            }

            if (italian != null) {
                pizzaToGo.getCategories().add(italian);
            }

            restaurantRepository.save(fantasticFeast);
            restaurantRepository.save(lastResort);
            restaurantRepository.save(getFat);
            restaurantRepository.save(fryingNemo);
            restaurantRepository.save(pizzaToGo);
            restaurantRepository.save(thaiTanic);
            restaurantRepository.save(pitaPan);
            restaurantRepository.save(jackGriller);
            restaurantRepository.save(fatFace);
            restaurantRepository.save(lordWings);
            restaurantRepository.save(misoHungry);
        }
    }

}
