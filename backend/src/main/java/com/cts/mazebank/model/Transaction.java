package com.cts.mazebank.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_type", nullable = false)
    private String transactionType; // DEPOSIT, WITHDRAWAL, TRANSFER

    @Column(nullable = false)
    private Double amount;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate = LocalDateTime.now();

    private String description;

    // For transfers: the target account number
    @Column(name = "target_account_number")
    private String targetAccountNumber;

    // Many transactions belong to one account
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
}
