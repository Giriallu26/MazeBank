package com.cts.mazebank.config;

import com.cts.mazebank.model.Admin;
import com.cts.mazebank.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Loads default admin user on application startup if not exists.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!adminRepository.existsByUsername("admin")) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole("ADMIN");
            adminRepository.save(admin);
            System.out.println("✅ Default admin created - username: admin, password: admin123");
        }
    }
}
