package com.cts.mazebank.controller;

import com.cts.mazebank.model.Admin;
import com.cts.mazebank.model.Customer;
import com.cts.mazebank.repository.AdminRepository;
import com.cts.mazebank.repository.CustomerRepository;
import com.cts.mazebank.security.JwtUtil;
import com.cts.mazebank.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller - handles login and registration.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Customer Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody Customer customer) {
        Customer saved = customerService.registerCustomer(customer);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("customerId", saved.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Customer Login
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(customer.getEmail(), customer.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("customerId", customer.getId());
        response.put("fullName", customer.getFullName());
        response.put("email", customer.getEmail());
        response.put("role", customer.getRole());
        return ResponseEntity.ok(response);
    }

    // Admin Login
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN");

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("adminId", admin.getId());
        response.put("fullName", admin.getFullName());
        response.put("role", "ADMIN");
        return ResponseEntity.ok(response);
    }
}
