package com.cts.mazebank.service;

import com.cts.mazebank.model.Account;
import java.util.List;

public interface AccountService {
    Account createAccount(Long customerId, Account account);
    Account getAccountById(Long id);
    Account getAccountByNumber(String accountNumber);
    List<Account> getAccountsByCustomerId(Long customerId);
    List<Account> getAllAccounts();
    Account activateAccount(Long id);
    Account deactivateAccount(Long id);
    Double getBalance(Long accountId);
}
