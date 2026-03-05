# 🛒 Inventory & Billing System (Retail Shop App)

## 📌 Project Overview

The **Inventory & Billing System** is a full-stack retail management application developed using **Spring Boot** for the backend and **ReactJS** for the frontend.

This system helps retail shop owners automate inventory tracking, billing, and sales reporting. It eliminates manual invoice preparation and reduces errors while improving efficiency in daily shop operations.

The application provides a centralized platform where shop staff can manage products, generate invoices, track stock levels, and analyze sales performance in real time.

---

# 🚩 Problem Statement

Retail shops often face several operational problems such as:

* Inaccurate stock tracking
* Manual invoice preparation
* Slow billing process
* Lack of real-time sales insights

These issues may result in financial losses, product shortages, human errors, and inefficient shop management.

A centralized automated system is required to manage inventory efficiently, generate bills instantly, maintain sales records, and notify shop owners about low stock items.

---

# 🎯 Objectives

The main objectives of the system are:

* Automate the **billing and inventory management** process
* Maintain **real-time stock levels**
* Generate **professional PDF invoices instantly**
* Provide an **admin dashboard with analytics and reports**
* Notify the shop owner when stock levels are low
* Ensure **secure role-based access** for admin and staff

---

# 🏗️ System Architecture

Frontend → ReactJS
Backend → Spring Boot REST APIs
Database → PostgreSQL

### Backend

Developed using **Java Spring Boot**.
It manages:

* REST API services
* Authentication and authorization
* Business logic
* Database communication

### Frontend

Developed using **ReactJS** to provide a responsive and user-friendly interface for shop staff and administrators.

### Database

The system uses **PostgreSQL** to store and manage:

* Product information
* Inventory records
* Billing transactions
* User accounts
* Sales data

The system processes operations such as adding products, updating stock, generating bills, and producing PDF invoices while maintaining accurate stock levels after every sale. 

---

# 🧩 Modules

## 1️⃣ Billing Module

* Generate customer bills
* Create **PDF invoices**
* Automatically update inventory after each sale

## 2️⃣ Inventory Management

* Add new products
* Update stock levels
* Track available inventory

## 3️⃣ User Management

* Role-based authentication
* Admin and staff login system

## 4️⃣ Admin Dashboard

* Sales analytics
* Revenue reports
* Low-stock alerts

---

# 🖥️ Hardware & Software Requirements

## Hardware

* Standard PC or Laptop
* Minimum **4–8 GB RAM**

## Software

* **Backend:** Java, Spring Boot, Spring Data JPA
* **Frontend:** ReactJS
* **Database:** PostgreSQL
* **Tools:** IntelliJ IDEA, VS Code, Postman
* **Libraries:** JasperReports / OpenPDF for invoice generation 

---

# 📂 Project Structure

## Backend (Spring Boot)

src
├── controller
├── service
├── repository
├── model
└── config

## Frontend (React)

src
├── components
├── pages
├── services
└── utils

---

# 🚀 Features

* Real-time inventory tracking
* Automated billing system
* Instant PDF invoice generation
* Admin dashboard with analytics
* Role-based authentication system
* Low stock alerts

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

git clone https://github.com/kirti-21536/Stockify.git

---

## 2️⃣ Backend Setup (Spring Boot)

cd backend
mvn spring-boot:run

---

## 3️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

---

# 🔮 Future Enhancements

* Barcode scanner integration
* GST-compliant invoice formats
* Mobile application using Flutter
* Cloud deployment on AWS
* Multi-branch retail shop support 

---

# 👥 Project Team / Contributors

* Kirti Chaudhary
* Kratika Agrawal
* Deepika Sisodia
* Mohini Bharti

---

