package com.cts.mazebank.controller;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Account Controller - manage bank account operations.
 */
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Create a new bank account for a customer
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<Account> createAccount(@PathVariable Long customerId, @RequestBody Account account) {
        return new ResponseEntity<>(accountService.createAccount(customerId, account), HttpStatus.CREATED);
    }

    // Get account by ID
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    // Get all accounts for a customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getAccountsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(accountService.getAccountsByCustomerId(customerId));
    }

    // Get account balance
    @GetMapping("/{id}/balance")
    public ResponseEntity<Double> getBalance(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getBalance(id));
    }

    // Activate an account
    @PutMapping("/{id}/activate")
    public ResponseEntity<Account> activateAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.activateAccount(id));
    }

    // Deactivate an account
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Account> deactivateAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.deactivateAccount(id));
    }

}
