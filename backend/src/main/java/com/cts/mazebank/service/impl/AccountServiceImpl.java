package com.cts.mazebank.service.impl;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.model.Customer;
import com.cts.mazebank.repository.AccountRepository;
import com.cts.mazebank.repository.CustomerRepository;
import com.cts.mazebank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Account createAccount(Long customerId, Account account) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        // Only one account per customer
        if (accountRepository.existsByCustomerId(customerId)) {
            throw new RuntimeException("Customer already has an account. Only one Savings account is allowed per customer.");
        }

        // Validate Aadhar number
        if (account.getAadharNumber() == null || account.getAadharNumber().isBlank()) {
            throw new RuntimeException("Aadhar number is required to create an account");
        }
        // Validate PAN number
        if (account.getPanNumber() == null || account.getPanNumber().isBlank()) {
            throw new RuntimeException("PAN number is required to create an account");
        }

        // Force account type to SAVINGS
        account.setAccountType("SAVINGS");
        account.setAccountNumber(generateAccountNumber());
        account.setCustomer(customer);
        account.setBalance(0.0);
        account.setActive(true);
        return accountRepository.save(account);
    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    @Override
    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    @Override
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public Account activateAccount(Long id) {
        Account account = getAccountById(id);
        account.setActive(true);
        return accountRepository.save(account);
    }

    @Override
    public Account deactivateAccount(Long id) {
        Account account = getAccountById(id);
        account.setActive(false);
        return accountRepository.save(account);
    }

    @Override
    public Double getBalance(Long accountId) {
        Account account = getAccountById(accountId);
        return account.getBalance();
    }

    // Generate a random 10-digit account number
    private String generateAccountNumber() {
        String accNum;
        do {
            accNum = "MAZE" + String.format("%08d", (int)(Math.random() * 100000000));
        } while (accountRepository.existsByAccountNumber(accNum));
        return accNum;
    }
}
