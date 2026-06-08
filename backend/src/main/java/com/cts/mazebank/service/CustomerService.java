package com.cts.mazebank.service;

import com.cts.mazebank.model.Customer;
import com.cts.mazebank.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Customer registerCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already registered: " + customer.getEmail());
        }
        if (customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered: " + customer.getPhoneNumber());
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setRole("CUSTOMER");
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));
    }

    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer existing = getCustomerById(id);
        existing.setFullName(updatedCustomer.getFullName());
        existing.setPhoneNumber(updatedCustomer.getPhoneNumber());
        existing.setAddress(updatedCustomer.getAddress());
        return customerRepository.save(existing);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
