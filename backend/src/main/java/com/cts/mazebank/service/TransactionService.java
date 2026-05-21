package com.cts.mazebank.service;

import com.cts.mazebank.model.Transaction;
import java.util.List;

public interface TransactionService {
    Transaction deposit(Long accountId, Double amount);
    Transaction withdraw(Long accountId, Double amount);
    Transaction transfer(Long fromAccountId, String toAccountNumber, Double amount);
    List<Transaction> getTransactionsByAccountId(Long accountId);
    List<Transaction> getTransactionsByCustomerId(Long customerId);
    List<Transaction> getAllTransactions();
}
