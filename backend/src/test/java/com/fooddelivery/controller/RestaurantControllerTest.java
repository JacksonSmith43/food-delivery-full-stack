package com.fooddelivery.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fooddelivery.entity.Restaurants;
import com.fooddelivery.service.RestaurantsService;

// Der Ablauf:
// JUnit startet den Test
//         ↓
// Mockito sieht @Mock private RestaurantsService restaurantService
//         ↓
// Mockito generiert intern (unsichtbar für dich):
//     class $MockRestaurantsService extends RestaurantsService { ... }
//         ↓
// Diese generierte Klasse wird in restaurantService gespeichert
//         ↓
// @InjectMocks injiziert sie in den Controller
//         ↓
// Test läuft
//         ↓
// Test endet → generierte Klasse wird gelöscht
// Du schreibst nur:
// @Mock
// private RestaurantsService restaurantService;
// Alles andere — das Generieren, das Überschreiben der Methoden, die 
// HashMap — macht Mockito automatisch im Hintergrund. Deshalb heißt 
// die Bibliothek Mockito — sie erstellt Mocks für dich, ohne dass 
// du selbst eine Fake-Klasse schreiben musst.
// The class below will use the power of the Mockito library.
@ExtendWith(MockitoExtension.class)
public class RestaurantControllerTest {
    // Was Mockito intern aus @Mock private RestaurantsService restaurantService;
    // macht:
    // class MockRestaurantsService extends RestaurantsService {
    @Mock
    private RestaurantsService restaurantService;

    @InjectMocks
    RestaurantController restaurantController;

    // @Mock = Mockito erstellt eine Fake-Version der Klasse, deren
    // Methoden nichts tun und null zurückgeben — außer
    // du sagst mit when() was sie zurückgeben sollen.
    // Hat Mock eine eigene Datenbank / Tabelle?: Keine Datenbank — nur eine HashMap
    // im RAM.
    @Test
    @DisplayName("Controller_getRestaurantImages() should return a list of restaurants") 
    void testGetRestaurantImages() {
        // Given. Input.
        // Erstelle eine Beispiel-Liste, die der Mock zurückgeben soll.
        // Output: mockList = [Restaurants{}, Restaurants{}] (2 leere Objekte)
        // Herkunft: Test — du hast es selbst erstellt
        // Echte Daten? NEIN — leere Objekte, keine Datenbankwerte
        List<Restaurants> mockList = List.of(new Restaurants(), new Restaurants());

        // Wenn restaurantService.getRestaurantImages() aufgerufen wird, gib mockList
        // zurück.
        // mockList == response.getBody() — aber response selbst ist mehr (es enthält
        // auch den Status 200).
        // Output: kein Output, nur eine Regel wird registriert:
        // "wenn getRestaurantImages() aufgerufen wird → gib mockList zurück"
        // Herkunft: Test — Mockito-Konfiguration
        // Echte Daten? NEIN — nur eine Anweisung an den Mock
        // Mockito registriert intern eine Tabelle:
        // ┌─────────────────────────────────┬─────────────┐
        // │ Wenn dieser Aufruf kommt...     │ ...gib das  │
        // ├─────────────────────────────────┼─────────────┤
        // │ restaurantService               │             │
        // │ .getRestaurantImages()          │ mockList    │
        // └─────────────────────────────────┴─────────────┘
        // Schaut in der internen Tabelle nach:
        // "Gibt es einen when()-Eintrag für getRestaurantImages()?"
        // → JA → gibt mockList zurück
        // → NEIN → gibt null zurück
        when(restaurantService.getRestaurantImages()).thenReturn(mockList);

        // When. What is done.
        // Was passiert intern im Controller:
        // 1. restaurantService.getRestaurantImages() wird aufgerufen
        // → Mock greift ein → gibt mockList zurück
        // → restaurants = [Restaurants{}, Restaurants{}]
        // 2. return ResponseEntity.ok(restaurants)
        // → Status: 200, Body: [Restaurants{}, Restaurants{}]
        //
        // Output: response = ResponseEntity{ status=200, body=[Restaurants{},
        // Restaurants{}] }
        // Herkunft: Echter Controller-Code + Mock-Rückgabe
        // Echte Daten? NEIN — body ist mockList (deine 2 leeren Objekte)
        // response wird aus dem echten Controller-Code geholt, der intern den
        // Mock-Service verwendet:
        // restaurantController.getRestaurantImages()
        // ↓
        // Echter RestaurantController-Code läuft:
        // restaurants = restaurantService.getRestaurantImages()
        // ↓
        // Mock-Version von RestaurantsService
        // gibt mockList zurück
        // ↓
        // return ResponseEntity.ok(restaurants)
        // ↓
        // response = ResponseEntity{ status=200, body=mockList }
        // Der Controller selbst ist echt — nur sein restaurantService darin ist die
        // Mock-Version.
        // Echt oder Mock?
        // restaurantController echt
        // restaurantController.restaurantService Mock
        // response echt (erstellt vom echten Controller-Code)
        // response.getBody() Mock-Daten (kommt von mockList)
        ResponseEntity<List<Restaurants>> response = restaurantController.getRestaurantImages();

        // Then. Result.
        // HTTP Status 200?
        // Left: expected, right: actual.
        // Links (erwartet): HttpStatus.OK = 200 → aus dem Test
        // Rechts (actual): response.getStatusCode() = 200 → aus dem Controller
        // (ResponseEntity.ok())
        // Echte Daten? NEIN / JA — 200 kommt vom echten Controller-Code
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Enthält der Body die erwarteten Daten?
        // Links (erwartet): mockList = [Restaurants{}, Restaurants{}] → aus dem Test
        // Rechts (actual): response.getBody() = [Restaurants{}, Restaurants{}] → aus
        // dem Controller
        // Echte Daten? NEIN — beides ist mockList, dieselbe Referenz
        assertEquals(mockList, response.getBody());

        // Links (erwartet): 2 → aus dem Test (du hast 2 Objekte erstellt)
        // Rechts (actual): response.getBody().size() = 2 → aus dem Controller (body =
        // mockList)
        // Echte Daten? NEIN — 2 weil du 2 Objekte in mockList gesteckt hast
        assertEquals(2, response.getBody().size());

        // Wurde der Service genau einmal aufgerufen?
        // Mockito prüft: Wurde getRestaurantImages() genau 1x aufgerufen?
        // Output: kein Output wenn korrekt, Exception wenn falsch
        // Herkunft: Mockito zählt intern alle Aufrufe auf dem Mock mit
        // Echte Daten? NEIN — nur ein Zähler im Mock
        verify(restaurantService, times(1)).getRestaurantImages();
        //          ↑                            ↑
        // auf diesem Mock-Objekt wurde diese Methode 1x aufgerufen?
    }
}
