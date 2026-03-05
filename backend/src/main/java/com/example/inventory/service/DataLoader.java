package com.example.inventory.service;

import com.example.inventory.model.User;
import com.example.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.findByUsername("admin") == null) {
            User admin = new User("admin", passwordEncoder.encode("admin"), "ADMIN");
            userRepository.save(admin);
        }
        if (userRepository.findByUsername("staff") == null) {
            User staff = new User("staff", passwordEncoder.encode("staff"), "STAFF");
            userRepository.save(staff);
        }
    }
}
