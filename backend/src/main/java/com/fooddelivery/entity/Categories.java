package com.fooddelivery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "categorie")
    private String categorie;

    @Column(name = "categorie_image")
    private String categorieImage;

    public Categories() {

    }

    public Categories(String categorie, String categorieImage) {
        this.categorie = categorie;
        this.categorieImage = categorieImage;
    }

    public Categories(Long id, String categorie, String categorieImage) {
        this.id = id;
        this.categorie = categorie;
        this.categorieImage = categorieImage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getCategorieImage() {
        return categorieImage;
    }

    public void setCategorieImage(String categorieImage) {
        this.categorieImage = categorieImage;
    }

    @Override
    public String toString() {
        return "Category [id=" + id + ", categorie=" + categorie + ", categorieImage=" + categorieImage + "]";
    }
}
