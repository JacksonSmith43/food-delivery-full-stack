package com.fooddelivery.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.entity.User;
import com.fooddelivery.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository authRepository;

    public boolean registration(String email, String password) {
        System.out.println("AuthService()_registration().");

        try {
            User existingUser = authRepository.getByEmail(email);
            System.out.println("AuthService()_registration(): existingUser: " + existingUser);

            if (existingUser != null) {
                System.out.println("AuthService()_registration(): Email already exists in the database.");
                return false;
            }

            User auth = new User(email, password);
            authRepository.save(auth);
            System.out.println("AuthService()_registration(): Registration successful.");

            return true;

        } catch (Exception e) {
            System.err.println("AuthService_registration()_Error: " + e.getMessage());
            return false;
        }
    }

    public boolean changeEmail(String currentEmail, String newEmail) {
        System.out.println("AuthService_changeEmail().");

        try {
            // Gets the current user (email, password, and id).
            User authUser = authRepository.getByEmail(currentEmail);

            if (authUser == null) {
                System.out.println("AuthService_changeEmail()_User does not exist.");
                return false;
            }

            User newUser = authRepository.getByEmail(newEmail);

            // Checks whether the new email has been used by another user. The user is
            // allowed to reuse the current email. Another user is not allowed to do that.
            if (newUser != null && !newUser.getId().equals(authUser.getId())) {
                System.out.println("AuthService_changeEmail()_This new email address already exists.");
                return false;
            }

            // Change the email address, even if it stays the same.
            authUser.setEmail(newEmail);
            authRepository.save(authUser);

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
            User user = authRepository.getByEmail(email);

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

        List<User> users = authRepository.findByEmail(email);
        if (users.isEmpty()) {
            return false;
        }
        return users.get(0).getPassword().equals(newPassword);
    }

    public boolean isValidCurrentPassword(String email, String currentPassword) {
        System.out.println("AuthService()_inValidCurrentPassword().");

        List<User> users = authRepository.findByEmail(email);
        if (users.isEmpty()) {
            return false;
        }
        return users.get(0).getPassword().equals(currentPassword);
    }

}
