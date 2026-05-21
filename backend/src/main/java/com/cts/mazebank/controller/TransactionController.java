package com.cts.mazebank.controller;

import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Transaction Controller - handles deposit, withdraw, and transfer operations.
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Deposit money into an account
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody Map<String, Object> request) {
        Long accountId = Long.valueOf(request.get("accountId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.deposit(accountId, amount), HttpStatus.CREATED);
    }

    // Withdraw money from an account
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody Map<String, Object> request) {
        Long accountId = Long.valueOf(request.get("accountId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.withdraw(accountId, amount), HttpStatus.CREATED);
    }

    // Transfer money between accounts
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestBody Map<String, Object> request) {
        Long fromAccountId = Long.valueOf(request.get("fromAccountId").toString());
        String toAccountNumber = request.get("toAccountNumber").toString();
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.transfer(fromAccountId, toAccountNumber, amount), HttpStatus.CREATED);
    }

    // Get transaction history for an account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId));
    }

    // Get all transactions for a customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Transaction>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByCustomerId(customerId));
    }
}
