# 🚗 Fleet Management System

A robust full-stack solution for enterprise vehicle fleet tracking, maintenance scheduling, and driver assignment. Built with **.NET 8 (C#)** and **React (JavaScript)** following Clean Architecture principles.

---

### 🌐 Live Demo

- **Web App:** https://fleet-management-dominique.up.railway.app

---

### 🛠️ Tech Stack & Architecture

- **Back-End:** C# | .NET 8 | ASP.NET Core Web API | EF Core | FluentValidation | xUnit
- **Front-End:** React | JavaScript | Tailwind CSS | Axios | React Query
- **Database & DevOps:** PostgreSQL | Docker & Docker Compose | Railway (deploy)

---

### 🚀 Key Features

- [x] Full vehicle lifecycle CRUD with dynamic status monitoring (Active, In Maintenance, Inactive).
- [x] Scheduled maintenance alerts based on mileage and date intervals.
- [x] Driver-to-vehicle assignment tracking with conflict prevention logic.
- [x] Centralized error handling and standardized JSON responses.

---

### 💻 Running Locally with Docker

Prerequisites: [Docker Desktop](https://www.docker.com/) installed.

```bash
# Clone the repository
git clone https://github.com/DominiqueValter/sistema-gestao-frota.git
cd sistema-gestao-frota

# Run the complete stack (API + Database + Front-End)
docker-compose up -d --build
```
