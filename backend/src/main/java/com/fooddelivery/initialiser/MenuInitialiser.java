package com.fooddelivery.initialiser;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.entity.MenuItem.DietaryLabels;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;

import jakarta.annotation.PostConstruct;

@Profile("!test") // This prevents the test profile from using this initialiser data. 
@Component
// MenuInitialiser knows where restaurantInitialiser is, because Spring
// automatically creates Bean names based off of class names, with the first
// letter being lower case.
@DependsOn("restaurantInitialiser") // @DependsOn() is an alternative to Order().
public class MenuInitialiser {
        @Autowired
        private MenuItemRepository menuItemRepository;

        @Autowired
        RestaurantRepository restaurantRepository;

        @PostConstruct
        public void init() {
                System.out.println("MenuInitialiser: @PostConstruct called!");
                System.out.println("MenuInitialiser: MenuItem count = " + menuItemRepository.count());

                if (menuItemRepository.count() == 0) {
                        System.out.println("MenuInitialiser: Starting initialization...");
                        System.out.println("Restaurant count: " + restaurantRepository.count());

                        // Creates MenuItems.
                        // Vegan.
                        MenuItem chiliCheezeBurgerMenü = new MenuItem(
                                        "Chili Cheeze Burger Menü",
                                        "Chili Cheeze + Farm Fries",
                                        new BigDecimal("12.36"),
                                        "chiliCheezeBurgerMenü.webp",
                                        DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN);
                        MenuItem swingBurgerMenü = new MenuItem("Swing Burger Menü", "Swing Burger + Farm Fries",
                                        new BigDecimal("11.28"),
                                        "swingBurgerMenü.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN);
                        MenuItem sixerNuggets = new MenuItem("6er Nuggets", "Chick'n Nuggets (plant based)",
                                        new BigDecimal("6.20"),
                                        "sixerNuggets.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN);
                        MenuItem avocadoChicknPlanty = new MenuItem("Avocado Chick'n Planty",
                                        "Chipotle Sauce, Salat, Chick'n Patty (plant based), Tomate, Zwiebeln, Guacamole im Planty Bun",
                                        new BigDecimal("8.95"), "avocadoChicknPlanty.webp", DietaryLabels.VEGAN,
                                        DietaryLabels.VEGETARIAN);

                        // Pizza.
                        MenuItem salamiPizza = new MenuItem("Salami Pizza", "Rindersalami", new BigDecimal("11.90"),
                                        "salamiPizza.webp", DietaryLabels.HALAL);
                        MenuItem funghiPizza = new MenuItem("Funghi Pizza", "Frische Champignons ",
                                        new BigDecimal("10.90"),
                                        "funghiPizza.webp", DietaryLabels.VEGETARIAN);
                        MenuItem alTonnoPizza = new MenuItem("Al Tonno Pizza", "Thunfisch, Zwiebel, Oliven",
                                        new BigDecimal("13.90"),
                                        "alTonnoPizza.webp", DietaryLabels.HALAL);

                        // Indian.
                        MenuItem butterChicken = new MenuItem("Butter Chicken",
                                        "Gegrillte Hühnerstücke mit Butter und Tomatensauce", new BigDecimal("14.90"),
                                        "butterChicken.webp", DietaryLabels.HALAL, DietaryLabels.GLUTEN_FREE);
                        MenuItem chickenTikkaMasalaPikant = new MenuItem("Chicken Tikka Masala (Pikant)",
                                        "Gegrillte Hühnerstücke, in würzigem Curry", new BigDecimal("14.90"),
                                        "chickenTikkaMasalaPikant.webp", DietaryLabels.HALAL,
                                        DietaryLabels.GLUTEN_FREE);
                        MenuItem linsensuppeVegan = new MenuItem("Linsensuppe (Vegan)",
                                        "Eine wärmende Mahlzeit für kalte Tage. Die Linsensuppe von Großmutters Rezept ist eine kräftige und gesunde Suppe mit viel Gemüse und würzigem Speck.",
                                        new BigDecimal("4.50"), "linsensuppeVegan.png", DietaryLabels.VEGAN,
                                        DietaryLabels.VEGETARIAN, DietaryLabels.GLUTEN_FREE);
                        MenuItem vegetarischesBiryaniVegan = new MenuItem("Vegetarisches Biryani (Vegan)",
                                        "Basmatireis mit gemischten Gemüsesorten", new BigDecimal("13.90"),
                                        "vegetarischesBiryaniVegan.webp", DietaryLabels.VEGAN,
                                        DietaryLabels.VEGETARIAN, DietaryLabels.GLUTEN_FREE);

                        // Italian.
                        MenuItem pastaAlfredo = new MenuItem("Pasta Alfredo",
                                        "Obers, DOP (Grana Padano) Käse und Knoblauch.",
                                        new BigDecimal("10.71"), "pastaAlfredo.webp", DietaryLabels.VEGETARIAN);
                        MenuItem pastaCarbonara = new MenuItem("Pasta Carbonara",
                                        "Obers, Rind Speck, Zwiebel und Eigelb.", new BigDecimal("13.41"),
                                        "pastaCarbonara.webp", DietaryLabels.HALAL);
                        MenuItem pinsaVegana = new MenuItem("Pinsa Vegana", "Thunfisch, Zwiebel, Oliven",
                                        new BigDecimal("10.90"),
                                        "pinsaVegana.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN);

                        // Chinese.
                        MenuItem nudelnMitKnusprigemHuhn = new MenuItem("Nudeln mit knusprigem Huhn",
                                        "Nudeln mit knusprigem Huhn",
                                        new BigDecimal("11.50"), "nudelnMitKnusprigemHuhn.webp",
                                        DietaryLabels.GLUTEN_FREE);
                        MenuItem nudelnMitGemüse = new MenuItem("Nudeln mit Gemüse", "Nudeln mit Gemüse",
                                        new BigDecimal("9.50"),
                                        "nudelnMitGemüse.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN);
                        MenuItem reisMitKnusprigerEnteCola = new MenuItem("Reis mit knuspriger Ente & Cola 0,33l",
                                        "Der perfekte Sattmacher. Unser Reis ist vielseitig verwendbar, leicht verdaulich und reich an Kohlenhydraten. Ideal als Beilage oder Basis für Gerichte.",
                                        new BigDecimal("13.50"), "reisMitKnusprigerEnteCola.webp",
                                        DietaryLabels.GLUTEN_FREE);
                        MenuItem avocadosalat = new MenuItem("Avocadosalat", "Avocadosalat", new BigDecimal("7.20"),
                                        "avocadosalat.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN,
                                        DietaryLabels.GLUTEN_FREE);

                        // Burgers.
                        MenuItem doubleCheeseburgerMenü = new MenuItem("Double Cheeseburger Menü",
                                        "Double Cheesburger mit einem Drink und Fries", new BigDecimal("14.32"),
                                        "doubleCheeseburgerMenü.webp", DietaryLabels.HEARTATTACK_WAITING_TO_HAPPEN);
                        MenuItem doubleBaconJam = new MenuItem("Double Bacon Jam",
                                        "Mit Senf Mayo, Essiggurken, Beef Bacon Jam und Zwiebel.",
                                        new BigDecimal("11.90"),
                                        "doubleBaconJam.webp", DietaryLabels.HEARTATTACK_WAITING_TO_HAPPEN);
                        MenuItem halloumiBurger = new MenuItem("Halloumi Burger",
                                        "Mit Kräuterpesto, Essiggurken, Aioli und Salatmix.", new BigDecimal("11.90"),
                                        "halloumiBurger.webp", DietaryLabels.VEGETARIAN, DietaryLabels.NUT_FREE);

                        // Thai.
                        MenuItem phadThaiNationalgericht = new MenuItem("Phad Thai (Nationalgericht)",
                                        "Gebratene Reisnudeln mit Ei, Thaibärlauch & Erdnuss", new BigDecimal("12.80"),
                                        "phadThaiNationalgericht.webp", DietaryLabels.GLUTEN_FREE);
                        MenuItem somTam = new MenuItem("Som Tam", "Papaya Salat mit Erdnuss", new BigDecimal("7.50"),
                                        "somTam.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN,
                                        DietaryLabels.GLUTEN_FREE);
                        MenuItem geangKhiaoWan = new MenuItem("Geang Khiao Wan",
                                        "Grünes Thai Curry mit Fisolen, Bambussprossen, Kokosmilch dazu Reis",
                                        new BigDecimal("13.80"),
                                        "geangKhiaoWan.webp", DietaryLabels.VEGAN, DietaryLabels.VEGETARIAN,
                                        DietaryLabels.GLUTEN_FREE);

                        // Get restaurants from the database.
                        Restaurants fantasticFeast = restaurantRepository
                                        .findByRestaurantName("Fantastic Feast and Where to Eat Them").orElse(null);
                        Restaurants lastResort = restaurantRepository.findByRestaurantName("Last Resort Diner")
                                        .orElse(null);
                        Restaurants getFat = restaurantRepository.findByRestaurantName("Get Fat Soon").orElse(null);
                        Restaurants fryingNemo = restaurantRepository.findByRestaurantName("Frying Nemo").orElse(null);
                        Restaurants pizzaToGo = restaurantRepository.findByRestaurantName("Pizza To Go").orElse(null);
                        Restaurants thaiTanic = restaurantRepository.findByRestaurantName("ThaiTanic Kitchen")
                                        .orElse(null);
                        Restaurants pitaPan = restaurantRepository.findByRestaurantName("Pita Pan").orElse(null);
                        Restaurants jackGriller = restaurantRepository.findByRestaurantName("Jack The Griller")
                                        .orElse(null);
                        Restaurants fatFace = restaurantRepository.findByRestaurantName("Fat Face").orElse(null);
                        Restaurants lordWings = restaurantRepository.findByRestaurantName("Lord Of The Wings")
                                        .orElse(null);
                        Restaurants misoHungry = restaurantRepository.findByRestaurantName("Miso Hungry").orElse(null);

                        // Assigns restaurants to menu items.
                        chiliCheezeBurgerMenü.setRestaurant(misoHungry);
                        swingBurgerMenü.setRestaurant(misoHungry);
                        sixerNuggets.setRestaurant(misoHungry);
                        avocadoChicknPlanty.setRestaurant(misoHungry);

                        salamiPizza.setRestaurant(pizzaToGo);
                        funghiPizza.setRestaurant(pizzaToGo);
                        alTonnoPizza.setRestaurant(pizzaToGo);

                        butterChicken.setRestaurant(fantasticFeast);
                        chickenTikkaMasalaPikant.setRestaurant(getFat);
                        linsensuppeVegan.setRestaurant(fatFace);
                        vegetarischesBiryaniVegan.setRestaurant(fatFace);

                        pastaAlfredo.setRestaurant(pizzaToGo);
                        pastaCarbonara.setRestaurant(pizzaToGo);
                        pinsaVegana.setRestaurant(pizzaToGo);

                        nudelnMitKnusprigemHuhn.setRestaurant(fantasticFeast);
                        nudelnMitGemüse.setRestaurant(getFat);
                        reisMitKnusprigerEnteCola.setRestaurant(fatFace);
                        avocadosalat.setRestaurant(fatFace);

                        doubleCheeseburgerMenü.setRestaurant(getFat);
                        doubleBaconJam.setRestaurant(lastResort);
                        // TODO: Add new menus.
                        doubleCheeseburgerMenü.setRestaurant(getFat);
                        doubleCheeseburgerMenü.setRestaurant(fatFace);
                        doubleCheeseburgerMenü.setRestaurant(lordWings);
                        halloumiBurger.setRestaurant(jackGriller);

                        phadThaiNationalgericht.setRestaurant(fryingNemo);
                        somTam.setRestaurant(thaiTanic);
                        geangKhiaoWan.setRestaurant(pitaPan);

                        // Saves menu items to the database.
                        menuItemRepository.save(chiliCheezeBurgerMenü);
                        menuItemRepository.save(swingBurgerMenü);
                        menuItemRepository.save(sixerNuggets);
                        menuItemRepository.save(avocadoChicknPlanty);

                        menuItemRepository.save(salamiPizza);
                        menuItemRepository.save(funghiPizza);
                        menuItemRepository.save(alTonnoPizza);

                        menuItemRepository.save(butterChicken);
                        menuItemRepository.save(chickenTikkaMasalaPikant);
                        menuItemRepository.save(linsensuppeVegan);
                        menuItemRepository.save(vegetarischesBiryaniVegan);

                        menuItemRepository.save(pastaAlfredo);
                        menuItemRepository.save(pastaCarbonara);
                        menuItemRepository.save(pinsaVegana);

                        menuItemRepository.save(nudelnMitKnusprigemHuhn);
                        menuItemRepository.save(nudelnMitGemüse);
                        menuItemRepository.save(reisMitKnusprigerEnteCola);
                        menuItemRepository.save(avocadosalat);

                        menuItemRepository.save(doubleCheeseburgerMenü);
                        menuItemRepository.save(doubleBaconJam);
                        menuItemRepository.save(halloumiBurger);

                        menuItemRepository.save(phadThaiNationalgericht);
                        menuItemRepository.save(somTam);
                        menuItemRepository.save(geangKhiaoWan);
                }
        }
}
