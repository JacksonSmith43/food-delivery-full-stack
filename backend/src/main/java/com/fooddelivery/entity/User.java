package com.fooddelivery.entity;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column
    @Email
    private String email;

    @Column
    @Size(min = 6, max = 30)
    private String password;

    @Size(min = 3, max = 20)
    private String phoneNumber;

    // mappedBy ensures that multiple addresses can be associated with one user.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> address;

    public User() {

    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String email) {
        this.email = email;
    }

    public User(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public User(Long id, String email, String password, String phoneNumber, List<Address> address) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", email=" + email + ", password=" + password + ", phoneNumber=" + phoneNumber
                + ", address=" + address + "]";
    }

}
