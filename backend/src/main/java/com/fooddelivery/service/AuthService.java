package com.fooddelivery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fooddelivery.entity.User;
import com.fooddelivery.exception.EmailAlreadyExistsException;
import com.fooddelivery.exception.EmailDoesNotExistException;
import com.fooddelivery.exception.EmailIsEmptyException;
import com.fooddelivery.exception.IncorrectCurrentPasswordException;
import com.fooddelivery.exception.SameAsCurrentPasswordException;
import com.fooddelivery.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void registration(String email, String password) {
        System.out.println("AuthService()_registration().");

        User existingUser = userRepository.getByEmail(email);
        System.out.println("AuthService()_registration(): existingUser: " + existingUser);

        if (existingUser != null) {
            System.out.println("AuthService()_registration(): Email already exists in the database.");
            throw new EmailAlreadyExistsException(
                    "AuthService()_registration(): Email already exists in the database.");
        }

        User auth = new User(email, password);
        userRepository.save(auth);
        System.out.println("AuthService()_registration(): Registration successful.");
    }

    public void changeEmail(String currentEmail, String newEmail) {
        System.out.println("AuthService_changeEmail().");

        if (!emailExists(newEmail)) {
            throw new EmailIsEmptyException("Entered email is empty.");
        }

        // Gets the current user (email, password, and id).
        User authUser = userRepository.getByEmail(currentEmail);

        if (authUser == null) {
            System.out.println("AuthService_changeEmail()_User does not exist.");
            throw new EmailDoesNotExistException("User does not exist.");
        }

        User newUser = userRepository.getByEmail(newEmail);

        // Checks whether the new email has been used by another user. The user is
        // allowed to reuse the current email. Another user is not allowed to do that.
        if (newUser != null && !newUser.getId().equals(authUser.getId())) {
            System.out.println("AuthService_changeEmail()_This new email address already exists.");
            throw new EmailAlreadyExistsException("This new email address already exists.");
        }

        // Change the email address, even if it stays the same.
        authUser.setEmail(newEmail);
        userRepository.save(authUser);

        System.out.println("AuthService()_changeEmail(): Email address changed successfully.");
    }

    public void changePassword(String email, String passwordCurrent, String newPassword) {
        System.out.println("AuthService_changePassword().");

        // Gets the user that has that email address (in an object along with password
        // and id) and not only gets the email address.
        User user = userRepository.getByEmail(email);

        if (email == null) {
            System.out.println("AuthService_changePassword()_User not found.");
            throw new EmailDoesNotExistException("User not found.");
        }

        if (!user.getPassword().equals(passwordCurrent)) {
            System.out.println("AuthService_changePassword()_Current password is incorrect.");
            throw new IncorrectCurrentPasswordException("Current password is incorrect.");
        }

        if (user.getPassword().equals(newPassword)) {
            System.out.println("AuthService_changePassword()_New password must be different.");
            throw new SameAsCurrentPasswordException("New password must be different.");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public boolean emailExists(String email) {
        System.out.println("AuthService()_emailExists().");
        return !userRepository.findByEmail(email).isEmpty();
    }

    public void checksCurrentPasswordIsValid(String email, String currentPassword) {
        System.out.println("checksCurrentPassword().");

        List<User> users = userRepository.findByEmail(email);

        if (!users.get(0).getPassword().equals(currentPassword)) {
            throw new IncorrectCurrentPasswordException("Incorrect password.");
        }
    }

    public void comparesNewPasswordWithCurrentPassword(String currentPassword, String newPassword) {
        System.out.println("comparesNewPasswordWithCurrentPassword().");

        if (currentPassword.equals(newPassword)) {
            throw new SameAsCurrentPasswordException("The new password has to be different than the current one.");
        }
    }

    public User getUserByEmail(String email) {
        System.out.println("AuthService_getUserByEmail().");

        User user = userRepository.getByEmail(email);

        if (user == null) {
            throw new EmailDoesNotExistException("User does not exist.");
        }

        return user;
    }

}
