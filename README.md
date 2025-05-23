# 🧾 Employee Net Collection Dashboard

This full-stack application provides an admin interface to track employee collections and deposits, compute outstanding balances, and generate detailed reports.

## 📐 Features

### 🔐 Authentication
- Admin login via username and password
- JWT-based token authentication

### 👥 Employee Management
- Pre-seeded employees (e.g., Alice, Bob, Charlie, etc.)
- Insert MM collection & deposit data for employees

### 📊 Dashboards

#### 1. Outstanding Report
- Net MM Collection per employee (Total Collected - Total Deposited)
- Most recent transaction date
- Difference between collected and deposited amounts

#### 2. Employee Payment Report
- Detailed day-wise breakdown:
  - Collection date & amount
  - Deposit date & amount
  - Difference per date
  - Outstanding after each deposit, with X→X rule logic

---

## 🛠️ Tech Stack


### Backend
- Swagger + OpenAPI
- Node.js  + Restify
- Sequelize ORM
- MySQL (or SQLite for quick testing)

---

## 📦 API Reference

All API endpoints require a JWT token after login.

### POST `/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
