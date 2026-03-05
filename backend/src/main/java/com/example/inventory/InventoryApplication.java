package com.example.inventory;

import com.example.inventory.model.Product;
import com.example.inventory.model.User;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class InventoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin") == null) {
                userRepository.save(new User("admin", passwordEncoder.encode("admin"), "ADMIN"));
                userRepository.save(new User("staff", passwordEncoder.encode("staff"), "STAFF"));
            }

            if (productRepository.count() == 0) {
                productRepository.save(new Product("Modern Laptop", "High performance workstation", 1299.99, 15,
                        "Electronics", "TechPro", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"));
                productRepository.save(new Product("Ergonomic Chair", "Premium office seating", 299.50, 8, "Furniture",
                        "ComfortCo", "https://images.unsplash.com/photo-1505797149-43b00fe3c5d7"));
                productRepository.save(new Product("Mechanical Keyboard", "RGB Gaming keyboard", 89.99, 25,
                        "Electronics", "GameTech", "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"));
                productRepository.save(new Product("Monitor 4K", "Ultra HD display", 450.00, 5, "Electronics",
                        "VisionInc", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"));
            }
        };
    }
}