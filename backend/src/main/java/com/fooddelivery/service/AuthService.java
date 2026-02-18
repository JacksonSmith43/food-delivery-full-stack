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

    public boolean changeEmail(String currentEmail, String newEmail) {
        System.out.println("AuthService_changeEmail().");

        try {
            // Gets the current user.
            Auth currentUser = authRepository.getByEmail(currentEmail);

            if (currentUser == null) {
                System.out.println("AuthService_changeEmail()_currentEmail does not exist.");
                return false;
            }

            Auth newUser = authRepository.getByEmail(newEmail);

            // Checks whether the new email has been used by another user. The user is
            // allowed to reuse the current email. Another user is not allowed to do that.
            if (newUser != null && !newUser.getId().equals(currentUser.getId())) {
                System.out.println("AuthService_changeEmail()_This new email address already exists.");
                return false;
            }

            // Change the email address, even if it stays the same.
            currentUser.setEmail(newEmail);
            authRepository.save(currentUser);

            System.out.println("AuthService()_changeEmail(): Email address changed successfully.");
            return true;

        } catch (Exception e) {
            System.err.println("AuthService_changeEmail()_Error: " + e.getMessage());
            return false;
        }
    }

    public boolean changePassword(String passwordCurrent, String newPassword) {
        System.out.println("AuthService_changePassword().");

        try {
            Auth currentUser = authRepository.getByPassword(passwordCurrent);

            currentUser.setPassword(newPassword);
            authRepository.save(currentUser);

            System.out.println("AuthService_changePassword()_The new password replaced the old one. New Password: "
                    + currentUser.getPassword());
            return true;

        } catch (Exception e) {
            System.err.println("AuthService_changePassword()_Error: " + e.getMessage());
            return false;
        }
    }

}
