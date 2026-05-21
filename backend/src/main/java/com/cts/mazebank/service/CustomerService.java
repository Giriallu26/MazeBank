package com.cts.mazebank.service;

import com.cts.mazebank.model.Customer;
import java.util.List;

public interface CustomerService {
    Customer registerCustomer(Customer customer);
    Customer getCustomerById(Long id);
    Customer getCustomerByEmail(String email);
    Customer updateCustomer(Long id, Customer customer);
    List<Customer> getAllCustomers();
}
