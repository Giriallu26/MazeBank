# MazeBank - Banking Management System

A full-stack Banking Management System built with **Angular 19 + Spring Boot 4 + MySQL**.

---

## 📁 Project Structure

```
mazebank/
├── src/main/java/com/cts/mazebank/
│   ├── MazebankApplication.java
│   ├── config/
│   │   └── DataLoader.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── CustomerController.java
│   │   ├── AccountController.java
│   │   ├── TransactionController.java
│   │   └── AdminController.java
│   ├── model/
│   │   ├── Customer.java
│   │   ├── Account.java
│   │   ├── Transaction.java
│   │   └── Admin.java
│   ├── repository/
│   │   ├── CustomerRepository.java
│   │   ├── AccountRepository.java
│   │   ├── TransactionRepository.java
│   │   └── AdminRepository.java
│   ├── service/
│   │   ├── CustomerService.java
│   │   ├── AccountService.java
│   │   ├── TransactionService.java
│   │   └── impl/
│   │       ├── CustomerServiceImpl.java
│   │       ├── AccountServiceImpl.java
│   │       └── TransactionServiceImpl.java
│   ├── security/
│   │   ├── JwtUtil.java
│   │   ├── JwtFilter.java
│   │   └── SecurityConfig.java
│   └── exception/
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql
├── frontend/                     ← Angular Project
│   ├── src/app/
│   │   ├── components/navbar/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin-login/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   └── admin-dashboard/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── package.json
│   └── angular.json
└── pom.xml
```

---

## 🚀 Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+ & npm
- MySQL 8+
- Maven (or use the included `mvnw`)

### Step 1: Setup MySQL Database
```sql
CREATE DATABASE mazebank_db;
```
> The app will auto-create tables via JPA `ddl-auto=update`.

### Step 2: Configure Database Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

### Step 3: Run Spring Boot Backend
```bash
cd mazebank
./mvnw spring-boot:run
```
Backend starts at: **http://localhost:9090**

### Step 4: Run Angular Frontend
```bash
cd mazebank/frontend
npm install
ng serve
```
Frontend starts at: **http://localhost:4200**

---

## 🔐 Security Flow

1. User registers → password is BCrypt encrypted → saved to DB
2. User logs in → server validates credentials → generates JWT token
3. Token is sent in every request via `Authorization: Bearer <token>` header
4. `JwtFilter` intercepts requests, validates token, sets authentication context
5. Spring Security checks role-based access (`CUSTOMER` or `ADMIN`)

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

---

## 📡 API Endpoints

### Authentication (`/api/auth`) - PUBLIC
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new customer |
| POST | `/api/auth/login` | Customer login |
| POST | `/api/auth/admin/login` | Admin login |

### Customer (`/api/customers`) - AUTHENTICATED
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers/{id}` | Get customer by ID |
| GET | `/api/customers/email/{email}` | Get customer by email |
| PUT | `/api/customers/{id}` | Update customer profile |

### Account (`/api/accounts`) - AUTHENTICATED
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/customer/{customerId}` | Create new account |
| GET | `/api/accounts/{id}` | Get account by ID |
| GET | `/api/accounts/customer/{customerId}` | Get all customer accounts |
| GET | `/api/accounts/{id}/balance` | Get account balance |
| PUT | `/api/accounts/{id}/activate` | Activate account |
| PUT | `/api/accounts/{id}/deactivate` | Deactivate account |

### Transaction (`/api/transactions`) - AUTHENTICATED
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/deposit` | Deposit money |
| POST | `/api/transactions/withdraw` | Withdraw money |
| POST | `/api/transactions/transfer` | Transfer between accounts |
| GET | `/api/transactions/account/{accountId}` | Get account transactions |
| GET | `/api/transactions/customer/{customerId}` | Get customer transactions |

### Admin (`/api/admin`) - ADMIN ONLY
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard stats |
| GET | `/api/admin/customers` | Get all customers |
| GET | `/api/admin/accounts` | Get all accounts |
| GET | `/api/admin/transactions` | Get all transactions |

---

## 📋 Sample JSON Requests/Responses

### Register Customer
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
// Response: { "message": "Registration successful", "customerId": 1 }
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
// Response: { "token": "eyJhb...", "customerId": 1, "fullName": "John Doe", "email": "john@example.com", "role": "CUSTOMER" }
```

### Create Account
```json
POST /api/accounts/customer/1
{
  "accountType": "SAVINGS"
}
// Response: { "id": 1, "accountNumber": "MAZE12345678", "accountType": "SAVINGS", "balance": 0.0, "active": true }
```

### Deposit
```json
POST /api/transactions/deposit
{
  "accountId": 1,
  "amount": 5000.00
}
```

### Transfer
```json
POST /api/transactions/transfer
{
  "fromAccountId": 1,
  "toAccountNumber": "MAZE87654321",
  "amount": 1000.00
}
```

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Customer login |
| Register | `/register` | New customer signup |
| Admin Login | `/admin-login` | Admin access |
| Dashboard | `/dashboard` | Customer overview |
| Accounts | `/accounts` | Manage bank accounts |
| Transactions | `/transactions` | Deposit/Withdraw/Transfer |
| Profile | `/profile` | Update personal info |
| Admin Dashboard | `/admin` | System monitoring |

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Angular Material |
| Backend | Spring Boot 4, Spring Security, Spring Data JPA |
| Database | MySQL 8 |
| Auth | JWT (jjwt 0.12.6) |
| Build | Maven, npm |
