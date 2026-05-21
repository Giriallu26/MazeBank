package com.cts.mazebank.service.impl;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.repository.AccountRepository;
import com.cts.mazebank.repository.TransactionRepository;
import com.cts.mazebank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    @Transactional
    public Transaction deposit(Long accountId, Double amount) {
        if (amount <= 0) {
            throw new RuntimeException("Deposit amount must be greater than zero");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Update account balance
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setTransactionType("DEPOSIT");
        transaction.setAmount(amount);
        transaction.setDescription("Deposit of $" + amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction withdraw(Long accountId, Double amount) {
        if (amount <= 0) {
            throw new RuntimeException("Withdrawal amount must be greater than zero");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Check for sufficient balance
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance. Available: $" + account.getBalance());
        }

        // Update account balance
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setAmount(amount);
        transaction.setDescription("Withdrawal of $" + amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction transfer(Long fromAccountId, String toAccountNumber, Double amount) {
        if (amount <= 0) {
            throw new RuntimeException("Transfer amount must be greater than zero");
        }

        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Destination account not found: " + toAccountNumber));

        if (!fromAccount.getActive()) {
            throw new RuntimeException("Source account is deactivated");
        }
        if (!toAccount.getActive()) {
            throw new RuntimeException("Destination account is deactivated");
        }

        // Prevent self-transfer
        if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber())) {
            throw new RuntimeException("Self-transfer is not allowed");
        }

        // Check for sufficient balance
        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance. Available: $" + fromAccount.getBalance());
        }

        // Debit from source account
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        accountRepository.save(fromAccount);

        // Credit to destination account
        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(toAccount);

        LocalDateTime now = LocalDateTime.now();

        // Create transaction record for sender (TRANSFER)
        Transaction transaction = new Transaction();
        transaction.setTransactionType("TRANSFER");
        transaction.setAmount(amount);
        transaction.setDescription("Transfer to " + toAccountNumber);
        transaction.setTargetAccountNumber(toAccountNumber);
        transaction.setTransactionDate(now);
        transaction.setAccount(fromAccount);
        transactionRepository.save(transaction);

        // Create transaction record for recipient (CREDIT)
        Transaction creditTransaction = new Transaction();
        creditTransaction.setTransactionType("CREDIT");
        creditTransaction.setAmount(amount);
        creditTransaction.setDescription("Credit from " + fromAccount.getAccountNumber());
        creditTransaction.setTargetAccountNumber(fromAccount.getAccountNumber());
        creditTransaction.setTransactionDate(now);
        creditTransaction.setAccount(toAccount);
        transactionRepository.save(creditTransaction);

        return transaction;
    }

    @Override
    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }

    @Override
    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByAccountCustomerIdOrderByTransactionDateDesc(customerId);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
