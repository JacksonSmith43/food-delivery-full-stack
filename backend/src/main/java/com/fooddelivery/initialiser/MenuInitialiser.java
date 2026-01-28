package com.fooddelivery.initialiser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fooddelivery.entity.MenuItem;
import com.fooddelivery.repository.MenuItemRepository;

import jakarta.annotation.PostConstruct;

@Component
public class MenuInitialiser {
        @Autowired
        private MenuItemRepository menuItemRepository;

        @PostConstruct
        public void init() {
                if (menuItemRepository.count() == 0) {
                        // Vegan.
                        MenuItem chiliCheezeBurgerMenü = new MenuItem("Chili Cheeze Burger Menü",
                                        "Chili Cheeze + Farm Fries",
                                        12.36, "chiliCheezeBurgerMenü.png");
                        MenuItem swingBurgerMenü = new MenuItem("Swing Burger Menü", "Swing Burger + Farm Fries", 11.28,
                                        "swingBurgerMenü.png");
                        MenuItem sixerNuggets = new MenuItem("6er Nuggets", "Chick'n Nuggets (plant based)", 6.20,
                                        "sixerNuggets.png");
                        MenuItem avocadoChicknPlanty = new MenuItem("Avocado Chick'n Planty",
                                        "Chipotle Sauce, Salat, Chick'n Patty (plant based), Tomate, Zwiebeln, Guacamole im Planty Bun",
                                        8.95, "avocadoChicknPlanty.png");

                        // Pizza.
                        MenuItem salamiPizza = new MenuItem("Salami Pizza", "Rindersalami", 11.90, "salamiPizza.png");
                        MenuItem funghiPizza = new MenuItem("Funghi Pizza", "Frische Champignons ", 10.90,
                                        "funghiPizza.png");
                        MenuItem alTonnoPizza = new MenuItem("Al Tonno Pizza", "Thunfisch, Zwiebel, Oliven", 13.90,
                                        "alTonnoPizza.png");

                        // Indian.
                        MenuItem butterChicken = new MenuItem("Butter Chicken",
                                        "Gegrillte Hühnerstücke mit Butter und Tomatensauce", 14.90,
                                        "butterChicken.png");
                        MenuItem chickenTikkaMasalaPikant = new MenuItem("Chicken Tikka Masala (Pikant)",
                                        "Gegrillte Hühnerstücke, in würzigem Curry", 14.90,
                                        "chickenTikkaMasalaPikant.png");
                        MenuItem linsensuppeVegan = new MenuItem("Linsensuppe (Vegan)",
                                        "Eine wärmende Mahlzeit für kalte Tage. Die Linsensuppe von Großmutters Rezept ist eine kräftige und gesunde Suppe mit viel Gemüse und würzigem Speck.",
                                        4.50, "linsensuppeVegan.png");
                        MenuItem vegetarischesBiryaniVegan = new MenuItem("Vegetarisches Biryani (Vegan)",
                                        "Basmatireis mit gemischten Gemüsesorten", 13.90,
                                        "vegetarischesBiryaniVegan.png");

                        // Italian.
                        MenuItem pastaAlfredo = new MenuItem("Pasta Alfredo",
                                        "Obers, DOP (Grana Padano) Käse und Knoblauch.",
                                        10.71, "pastaAlfredo.png");
                        MenuItem pastaCarbonara = new MenuItem("Pasta Carbonara",
                                        "Obers, Rind Speck, Zwiebel und Eigelb.", 13.41,
                                        "pastaCarbonara.png");
                        MenuItem pinsaVegana = new MenuItem("Pinsa Vegana", "Thunfisch, Zwiebel, Oliven", 10.90,
                                        "pinsaVegana.png");

                        // Chinese.
                        MenuItem nudelnMitKnusprigemHuhn = new MenuItem("Nudeln mit knusprigem Huhn",
                                        "Nudeln mit knusprigem Huhn",
                                        11.50, "nudelnMitKnusprigemHuhn.png");
                        MenuItem nudelnMitGemüse = new MenuItem("Nudeln mit Gemüse", "Nudeln mit Gemüse", 9.50,
                                        "nudelnMitGemüse.png");
                        MenuItem reisMitKnusprigerEnteCola = new MenuItem("Reis mit knuspriger Ente & Cola 0,33l",
                                        "Der perfekte Sattmacher. Unser Reis ist vielseitig verwendbar, leicht verdaulich und reich an Kohlenhydraten. Ideal als Beilage oder Basis für Gerichte.",
                                        13.50, "reisMitKnusprigerEnteCola.png");
                        MenuItem avocadosalat = new MenuItem("Avocadosalat", "Avocadosalat", 7.20, "avocadosalat.png");

                        // Burgers.
                        MenuItem doubleCheeseburgerMenü = new MenuItem("Double Cheeseburger Menü",
                                        "Double Cheesburger mit einem Drink und Fries", 14.32,
                                        "doubleCheeseburgerMenü.png");
                        MenuItem doubleBaconJam = new MenuItem("Double Bacon Jam",
                                        "Mit Senf Mayo, Essiggurken, Beef Bacon Jam und Zwiebel.", 11.90,
                                        "doubleBaconJam.png");
                        MenuItem halloumiBurger = new MenuItem("Halloumi Burger",
                                        "Mit Kräuterpesto, Essiggurken, Aioli und Salatmix.", 11.90,
                                        "halloumiBurger.png");

                        // Thai.
                        MenuItem phadThaiNationalgericht = new MenuItem("Phad Thai (Nationalgericht)",
                                        "Gebratene Reisnudeln mit Ei, Thaibärlauch & Erdnuss", 12.80,
                                        "phadThaiNationalgericht.png");
                        MenuItem somTam = new MenuItem("Som Tam", "Papaya Salat mit Erdnuss", 7.50, "somTam.png");
                        MenuItem geangKhiaoWan = new MenuItem("Geang Khiao Wan",
                                        "Grünes Thai Curry mit Fisolen, Bambussprossen, Kokosmilch dazu Reis", 13.80,
                                        "geangKhiaoWan.png");

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
