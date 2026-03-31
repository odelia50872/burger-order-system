# Mr. Burger – Simulated Full-Stack Food Ordering Platform 🍔

**Mr. Burger** is a modern, responsive web application that simulates a real-world food ordering experience. 
The core of this project is a **custom-built Fake HTTP Layer**, which mimics asynchronous server communication, network latency, and RESTful API behavior without a live backend.

---

## 🌐 Live Application
* **Frontend (Vercel):** [https://burger-order-system.vercel.app/](https://burger-order-system.vercel.app/)
* **Source Code:** `https://github.com/odelia50872/burger-order-system.git`

---

## 📸 Screenshots

### **1. Authentication & Landing**
<img width="737" height="836" alt="צילום מסך 2026-03-31 180745" src="https://github.com/user-attachments/assets/35508744-0d28-400b-a982-221701642bf8" />
*Secure login and registration flow with validation.*

### **2. The Menu (Home)**
<img width="1912" height="866" alt="צילום מסך 2026-03-31 180902" src="https://github.com/user-attachments/assets/666c7f7a-5d8c-460c-a9f6-7eed3b408e98" />
*Dynamic burger menu with category filtering and interactive cards.*

### **3. Order History & Favorites**
<img width="1909" height="867" alt="צילום מסך 2026-03-31 180918" src="https://github.com/user-attachments/assets/fa134eff-cfc2-463f-aed9-dd2c7ad2101b" />
<img width="1907" height="847" alt="צילום מסך 2026-03-31 180931" src="https://github.com/user-attachments/assets/8f041073-658a-4eeb-8eed-5757f55ee277" />

*Personalized user dashboard tracking previous purchases and favorite meals.*

### **4. Shopping Cart & Checkout**
<img width="1907" height="851" alt="צילום מסך 2026-03-31 180950" src="https://github.com/user-attachments/assets/fa003a20-16fa-4ca5-81db-f144f9812814" />
*Real-time price calculation and order processing simulation.*

---

## 🚀 Project Overview
Mr. Burger provides a complete user journey from hunger to order confirmation:
* **User Management:** Register, Login, and Profile editing (including password verification).
* **Discovery:** Browsing a rich menu of burgers with detailed descriptions and pricing.
* **Personalization:** Adding specific items to a "Favorites" list for quick access.
* **Cart Logic:** Adding/Removing items and managing quantities with live total updates.
* **Order Tracking:** Viewing a history of past orders with "Order Again" functionality.

---

## 🏗️ Technical Architecture & "Fake HTTP" Logic
The project demonstrates advanced frontend engineering by decoupling the UI from the data source:

* **Mock API Layer (`netWork.js`):** Implements a service that wraps data requests in **Promises**.
* **Latency Simulation:** Uses `setTimeout` to mimic the "waiting" time of a real server (e.g., 1.2s for an order to process).
* **State Management:** Centralized logic for handling user sessions, cart state, and UI notifications.
* **Persistence:** Uses `localStorage` to ensure your cart and profile survive page refreshes.

---

## ✨ Engineering Highlights
* **Async/Await Workflow:** All data operations are handled as if they were real network calls.
* **Modular JS:** Clean separation between UI Managers, Network Services, and State.
* **Notification System:** Real-time feedback for user actions (Add to cart, Success/Error).
* **Responsive UI:** Fully optimized for mobile and desktop viewing.
* **History Manager:** Custom implementation for navigating between different app sections.

---

## 📂 Repository Structure
```text
project/
├── index.html            # Main entry point (Production Root)
├── css/                  # Stylized components and layout
├── js/           
│   ├── netWork.js        # The "Fake" API core logic
│   ├── ordersServer.js   # Mock backend for order management
│   ├── main.js           # App initialization
│   └── ...               # Additional logic modules
├── json/                 # Mock database (data.json)
└── screenshots/          # App preview images
