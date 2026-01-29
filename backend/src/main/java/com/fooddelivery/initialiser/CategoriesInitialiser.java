package com.fooddelivery.initialiser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.Categories;
import com.fooddelivery.repository.CategoriesRepository;

import jakarta.annotation.PostConstruct;

@Component
public class CategoriesInitialiser {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @PostConstruct
    public void init() {
        System.out.println("CategoriesInitialiser: @PostConstruct called!");
        System.out.println("CategoriesInitialiser: Categories count = " + categoriesRepository.count());
        if (categoriesRepository.count() == 0) { // It should only be filled, if the database is empty.
            Categories pizza = new Categories("Pizza", "pizza.png");
            Categories burger = new Categories("Burger", "burger.png");
            Categories chinese = new Categories("Chinese", "chinese.png");
            Categories thai = new Categories("Thai", "thai.png");
            Categories italian = new Categories("Italian", "italian.png");
            Categories indian = new Categories("Indian", "indian.png");
            Categories vegan = new Categories("Vegan", "vegan.png");

            categoriesRepository.save(pizza);
            categoriesRepository.save(burger);
            categoriesRepository.save(chinese);
            categoriesRepository.save(thai);
            categoriesRepository.save(italian);
            categoriesRepository.save(indian);
            categoriesRepository.save(vegan);

        }
    }
}
