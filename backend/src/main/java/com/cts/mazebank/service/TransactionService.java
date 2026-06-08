package com.cts.mazebank.service;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.repository.AccountRepository;
import com.cts.mazebank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public Transaction deposit(Long accountId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Deposit amount must be greater than zero");
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getActive()) throw new RuntimeException("Account is deactivated");

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("DEPOSIT");
        transaction.setAmount(amount);
        transaction.setDescription("Deposit of ₹" + amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAccount(account);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(Long accountId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Withdrawal amount must be greater than zero");
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getActive()) throw new RuntimeException("Account is deactivated");
        if (account.getBalance() < amount)
            throw new RuntimeException("Insufficient balance. Available: ₹" + account.getBalance());

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setAmount(amount);
        transaction.setDescription("Withdrawal of ₹" + amount);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAccount(account);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(Long fromAccountId, String toAccountNumber, Double amount) {
        if (amount <= 0) throw new RuntimeException("Transfer amount must be greater than zero");

        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Destination account not found: " + toAccountNumber));

        if (!fromAccount.getActive()) throw new RuntimeException("Source account is deactivated");
        if (!toAccount.getActive()) throw new RuntimeException("Destination account is deactivated");
        if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber()))
            throw new RuntimeException("Self-transfer is not allowed");
        if (fromAccount.getBalance() < amount)
            throw new RuntimeException("Insufficient balance. Available: ₹" + fromAccount.getBalance());

        fromAccount.setBalance(fromAccount.getBalance() - amount);
        accountRepository.save(fromAccount);
        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(toAccount);

        LocalDateTime now = LocalDateTime.now();

        Transaction transaction = new Transaction();
        transaction.setTransactionType("TRANSFER");
        transaction.setAmount(amount);
        transaction.setDescription("Transfer of ₹" + amount + " to " + toAccountNumber);
        transaction.setTargetAccountNumber(toAccountNumber);
        transaction.setTransactionDate(now);
        transaction.setAccount(fromAccount);
        transactionRepository.save(transaction);

        Transaction creditTransaction = new Transaction();
        creditTransaction.setTransactionType("CREDIT");
        creditTransaction.setAmount(amount);
        creditTransaction.setDescription("Credit of ₹" + amount + " from " + fromAccount.getAccountNumber());
        creditTransaction.setTargetAccountNumber(fromAccount.getAccountNumber());
        creditTransaction.setTransactionDate(now);
        creditTransaction.setAccount(toAccount);
        transactionRepository.save(creditTransaction);

        return transaction;
    }

    public List<Transaction> getFilteredTransactions(String transactionType, String accountNumber, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findFilteredTransactions(transactionType, accountNumber, startDate, endDate);
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }

    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByAccountCustomerIdOrderByTransactionDateDesc(customerId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
