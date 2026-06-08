package com.cts.mazebank.repository;

import com.cts.mazebank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    List<Transaction> findByAccountCustomerIdOrderByTransactionDateDesc(Long customerId);

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:transactionType IS NULL OR t.transactionType = :transactionType) AND " +
           "(:accountNumber IS NULL OR t.account.accountNumber = :accountNumber) AND " +
           "(:startDate IS NULL OR t.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findFilteredTransactions(
            @Param("transactionType") String transactionType,
            @Param("accountNumber") String accountNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
