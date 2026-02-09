package com.fooddelivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Auth;
import com.fooddelivery.repository.AuthRepository;

@Service
public class AuthService {
    @Autowired
    private AuthRepository authRepository;

    public void registration(String registrationForm) {
        System.out.println("AuthService()_registration().");

        // split(",")[0] takes the first part of the string before the comma, which is
        // "email: and then split(":")[1] takes the second part of that string after the
        // colon, which is the actual email value.
        String email = registrationForm.split(",")[0].split(":")[1];
        String password = registrationForm.split(",")[1].split(":")[1].replace("}", "");
        Auth databaseEmail = authRepository.getByEmail(email);

        if (databaseEmail != null) {
            System.out.println("AuthService()_registration(): Email already exists in database.");
            return;
        }
        Auth auth = new Auth(email, password);
        authRepository.save(auth);
        System.out.println("AuthService()_registration(): Registration successful.");

    }
}
