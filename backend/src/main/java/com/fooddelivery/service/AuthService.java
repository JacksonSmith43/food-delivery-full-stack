package com.fooddelivery.service;

import java.util.List;

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
            Auth existingUser = authRepository.getByEmail(email);
            System.out.println("AuthService()_registration(): existingUser: " + existingUser);

            if (existingUser != null) {
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
            // Gets the current user (email, password, and id).
            Auth currentUser = authRepository.getByEmail(currentEmail);

            if (currentUser == null) {
                System.out.println("AuthService_changeEmail()_User does not exist.");
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

    public boolean changePassword(String email, String passwordCurrent, String newPassword) {
        System.out.println("AuthService_changePassword().");

        try {
            // Gets the user that has that email address (in an object along with password
            // and id) and not only gets the email address.
            Auth user = authRepository.getByEmail(email);

            if (user == null) {
                System.out.println("AuthService_changePassword()_User not found.");
                return false;
            }

            if (!user.getPassword().equals(passwordCurrent)) {
                System.out.println("AuthService_changePassword()_Current password is incorrect.");
                return false;
            }

            if (user.getPassword().equals(newPassword)) {
                System.out.println("AuthService_changePassword()_New password must be different.");
                return false;
            }

            user.setPassword(newPassword);
            authRepository.save(user);

            System.out.println("AuthService_changePassword()_The new password replaced the old one. New Password: "
                    + user.getPassword());
            return true;

        } catch (Exception e) {
            System.err.println("AuthService_changePassword()_Error: " + e.getMessage());
            return false;
        }
    }

    public boolean emailExists(String email) {
        System.out.println("AuthService()_emailExists().");
        return !authRepository.findByEmail(email).isEmpty();
    }

    public boolean isSameAsCurrentPassword(String email, String newPassword) {
        System.out.println("AuthService()_isSameAsCurrentPassword().");

        List<Auth> users = authRepository.findByEmail(email);
        if (users.isEmpty()) {
            return false;
        }
        return users.get(0).getPassword().equals(newPassword);
    }

    public boolean isValidCurrentPassword(String email, String currentPassword) {
        System.out.println("AuthService()_inValidCurrentPassword().");

        List<Auth> users = authRepository.findByEmail(email);
        if (users.isEmpty()) {
            return false;
        }
        return users.get(0).getPassword().equals(currentPassword);
    }

}
