# Inventory & Billing System

A full-stack application for managing inventory and billing in a retail shop, built with Spring Boot (backend) and React (frontend).

## Features

- **Inventory Management**: Add, view, and update products with real-time stock tracking.
- **Billing**: Generate sales and update stock automatically.
- **User Authentication**: Role-based access for admin and staff.
- **Dashboard**: Basic UI for managing products and sales.

## Tech Stack

- **Backend**: Spring Boot, JPA, H2 Database, Spring Security
- **Frontend**: React, Axios

## Getting Started

### Prerequisites

- Java 17
- Maven
- Node.js and npm

### Running the Application

1. **Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will run on http://localhost:8080

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:5173

### Default Credentials

- Admin: username `admin`, password `admin`
- Staff: username `staff`, password `staff`

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product
- `POST /api/sales` - Create a sale

## Database

Uses H2 in-memory database. Access console at http://localhost:8080/h2-console with JDBC URL `jdbc:h2:mem:testdb`