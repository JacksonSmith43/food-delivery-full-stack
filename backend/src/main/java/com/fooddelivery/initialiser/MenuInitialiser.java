package com.fooddelivery.initialiser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.repository.MenuItemRepository;
import com.fooddelivery.repository.RestaurantRepository;

import jakarta.annotation.PostConstruct;

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
                        MenuItem chiliCheezeBurgerMenü = new MenuItem("Chili Cheeze Burger Menü",
                                        "Chili Cheeze + Farm Fries",
                                        12.36, "chiliCheezeBurgerMenü.webp");
                        MenuItem swingBurgerMenü = new MenuItem("Swing Burger Menü", "Swing Burger + Farm Fries", 11.28,
                                        "swingBurgerMenü.webp");
                        MenuItem sixerNuggets = new MenuItem("6er Nuggets", "Chick'n Nuggets (plant based)", 6.20,
                                        "sixerNuggets.webp");
                        MenuItem avocadoChicknPlanty = new MenuItem("Avocado Chick'n Planty",
                                        "Chipotle Sauce, Salat, Chick'n Patty (plant based), Tomate, Zwiebeln, Guacamole im Planty Bun",
                                        8.95, "avocadoChicknPlanty.webp");

                        // Pizza.
                        MenuItem salamiPizza = new MenuItem("Salami Pizza", "Rindersalami", 11.90, "salamiPizza.webp");
                        MenuItem funghiPizza = new MenuItem("Funghi Pizza", "Frische Champignons ", 10.90,
                                        "funghiPizza.webp");
                        MenuItem alTonnoPizza = new MenuItem("Al Tonno Pizza", "Thunfisch, Zwiebel, Oliven", 13.90,
                                        "alTonnoPizza.webp");

                        // Indian.
                        MenuItem butterChicken = new MenuItem("Butter Chicken",
                                        "Gegrillte Hühnerstücke mit Butter und Tomatensauce", 14.90,
                                        "butterChicken.webp");
                        MenuItem chickenTikkaMasalaPikant = new MenuItem("Chicken Tikka Masala (Pikant)",
                                        "Gegrillte Hühnerstücke, in würzigem Curry", 14.90,
                                        "chickenTikkaMasalaPikant.webp");
                        MenuItem linsensuppeVegan = new MenuItem("Linsensuppe (Vegan)",
                                        "Eine wärmende Mahlzeit für kalte Tage. Die Linsensuppe von Großmutters Rezept ist eine kräftige und gesunde Suppe mit viel Gemüse und würzigem Speck.",
                                        4.50, "linsensuppeVegan.png");
                        MenuItem vegetarischesBiryaniVegan = new MenuItem("Vegetarisches Biryani (Vegan)",
                                        "Basmatireis mit gemischten Gemüsesorten", 13.90,
                                        "vegetarischesBiryaniVegan.webp");

                        // Italian.
                        MenuItem pastaAlfredo = new MenuItem("Pasta Alfredo",
                                        "Obers, DOP (Grana Padano) Käse und Knoblauch.",
                                        10.71, "pastaAlfredo.webp");
                        MenuItem pastaCarbonara = new MenuItem("Pasta Carbonara",
                                        "Obers, Rind Speck, Zwiebel und Eigelb.", 13.41,
                                        "pastaCarbonara.webp");
                        MenuItem pinsaVegana = new MenuItem("Pinsa Vegana", "Thunfisch, Zwiebel, Oliven", 10.90,
                                        "pinsaVegana.webp");

                        // Chinese.
                        MenuItem nudelnMitKnusprigemHuhn = new MenuItem("Nudeln mit knusprigem Huhn",
                                        "Nudeln mit knusprigem Huhn",
                                        11.50, "nudelnMitKnusprigemHuhn.webp");
                        MenuItem nudelnMitGemüse = new MenuItem("Nudeln mit Gemüse", "Nudeln mit Gemüse", 9.50,
                                        "nudelnMitGemüse.webp");
                        MenuItem reisMitKnusprigerEnteCola = new MenuItem("Reis mit knuspriger Ente & Cola 0,33l",
                                        "Der perfekte Sattmacher. Unser Reis ist vielseitig verwendbar, leicht verdaulich und reich an Kohlenhydraten. Ideal als Beilage oder Basis für Gerichte.",
                                        13.50, "reisMitKnusprigerEnteCola.webp");
                        MenuItem avocadosalat = new MenuItem("Avocadosalat", "Avocadosalat", 7.20, "avocadosalat.webp");

                        // Burgers.
                        MenuItem doubleCheeseburgerMenü = new MenuItem("Double Cheeseburger Menü",
                                        "Double Cheesburger mit einem Drink und Fries", 14.32,
                                        "doubleCheeseburgerMenü.webp");
                        MenuItem doubleBaconJam = new MenuItem("Double Bacon Jam",
                                        "Mit Senf Mayo, Essiggurken, Beef Bacon Jam und Zwiebel.", 11.90,
                                        "doubleBaconJam.webp");
                        MenuItem halloumiBurger = new MenuItem("Halloumi Burger",
                                        "Mit Kräuterpesto, Essiggurken, Aioli und Salatmix.", 11.90,
                                        "halloumiBurger.webp");

                        // Thai.
                        MenuItem phadThaiNationalgericht = new MenuItem("Phad Thai (Nationalgericht)",
                                        "Gebratene Reisnudeln mit Ei, Thaibärlauch & Erdnuss", 12.80,
                                        "phadThaiNationalgericht.webp");
                        MenuItem somTam = new MenuItem("Som Tam", "Papaya Salat mit Erdnuss", 7.50, "somTam.webp");
                        MenuItem geangKhiaoWan = new MenuItem("Geang Khiao Wan",
                                        "Grünes Thai Curry mit Fisolen, Bambussprossen, Kokosmilch dazu Reis", 13.80,
                                        "geangKhiaoWan.webp");

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
