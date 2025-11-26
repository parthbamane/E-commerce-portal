# 🚀 Operations Portal 

A complete internal operations dashboard built with React, TailwindCSS, React Router, and a JSON-Server mock backend.
The portal supports multiple user roles (Agent, Manager, Admin) and includes modules for:

- Merchant Onboarding
- Order Tracking
- Payment Reconciliation
- Support Ticket Management
- Admin Panel (User Role Management)
- Dashboard with Stats & Recent Orders

# 📌 Table of Contents

- Features
- Tech Stack
- Local Setup
- Available Login Accounts
- Mock Backend API (JSON-Server)
- API Endpoints
- Data Structure
- Role Access Rules
- Project Structure

# ⭐ Features

## ✅ Dashboard
- Displays summary cards
- Shows the last 3 recent orders
- Quick-action shortcuts

## ✅ Merchants Module
- Add merchants using a 3-step onboarding wizard
- Approve/Reject merchants
- View merchants list

## ✅ Orders Module
- Search and filter orders
- View order details
- Update order status (Processing → Shipped → Delivered)

## ✅ Payment Reconciliation
- Admin/Manager only
- Select unreconciled items and reconcile them
- Status badges, selectable rows, and toast notifications

## ✅ Support Tickets
- Create, filter, search tickets
- Update ticket status (Open → In progress → Resolved)
- Auto-assign to logged-in user

## ✅ Notifications
- Dropdown with unread count badge
- Closes on outside click
- Placeholder real-time entries

## ✅ Admin Panel
- Only for Admin users
- Role management (agent, manager, admin)

## ✅ Authentication + Role-based Access
- Login/logout
- Navigation changes based on role
- Route protection

# 🛠 Tech Stack

| Area      | Technology        |
|-----------|-------------------|
| UI        | React, TailwindCSS |
| Routing   | React Router      |
| Icons     | Lucide Icons      |
| Backend   | JSON Server       |
| Auth      | Custom AuthProvider |
| State     | React Hooks       |

# 🧑‍💻 Local Setup

Follow these steps:

## 1️⃣ Clone the Project
git clone <repo-url>
cd operations-portal

## 2️⃣ Install Dependencies
npm install

## 3️⃣ Start Mock Backend (JSON Server)

Mock API runs on port 4000:

npx json-server --watch db.json --port 4000

You should see:
http://localhost:4000/users
http://localhost:4000/orders


## 4️⃣ Run Frontend
npm run dev

Frontend runs at:
http://localhost:5173

# 🔐 Available Login Accounts

Use these credentials:

| Role    | Username  | Password |
|---------|-----------|----------|
| Admin   | admin     | pass     |
| Manager | manager1  | pass     |
| Agent   | agent1    | pass     |

You can modify these in db.json → users[]

# 📡 Mock Backend API (JSON-Server)

Your backend is powered by JSON Server, which provides automatic REST APIs from db.json.

# API Endpoints

## 📌 Users
GET    /users  
POST   /users  
PATCH  /users/:id  

## 📌 Merchants
GET    /merchants  
POST   /merchants  
PATCH  /merchants/:id  

## 📌 Orders
GET    /orders  
PATCH  /orders/:id  

## 📌 Tickets
GET    /tickets  
POST   /tickets  
PATCH  /tickets/:id  

## 📌 Reconciliations
GET    /reconciliations  
PATCH  /reconciliations/:id  

# 🗂 Data Structure (db.json)

# 🛡 Role Access Rules

| Feature                | Agent | Manager | Admin |
|------------------------|-------|---------|-------|
| Dashboard              | ✅    | ✅      | ✅    |
| Merchants              | ✅    | ✅      | ✅    |
| Orders                 | ✅    | ✅      | ✅    |
| Tickets                | ✅    | ✅      | ✅    |
| Payments (Reconciliation) | ❌ | ✅      | ✅    |
| Admin Panel            | ❌    | ❌      | ✅    |

# 📦 Project Structure

src/
 ├── components/
 │   ├── Layout.jsx
 │   ├── ProtectedRoute.jsx
 │
 ├── pages/
 │   ├── Login.jsx
 │   ├── Dashboard.jsx
 │   ├── MerchantOnboarding.jsx
 │   ├── OrderTracking.jsx
 │   ├── Reconciliation.jsx
 │   ├── Tickets.jsx
 │   ├── AdminPanel.jsx
 │
 ├── providers/
 │   ├── AuthProvider.jsx
 │
 ├── App.jsx
 ├── main.jsx

