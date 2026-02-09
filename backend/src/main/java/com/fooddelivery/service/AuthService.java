package com.fooddelivery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.Auth;
import com.fooddelivery.repository.AuthRepository;

@Service
public class AuthService {
    @Autowired
    private AuthRepository authRepository;

    public void registration(String email, String password) {
        System.out.println("AuthService()_registration().");

        try {
            Auth existingEmail = authRepository.getByEmail(email);

            if (existingEmail != null) {
                System.out.println("AuthService()_registration(): Email already exists in database.");
                return;
            }
            Auth auth = new Auth(email, password);
            authRepository.save(auth);
            System.out.println("AuthService()_registration(): Registration successful.");

        } catch (Exception e) {
            System.err.println("AuthService_registration()_Error: " + e.getMessage());
        }

    }
}
