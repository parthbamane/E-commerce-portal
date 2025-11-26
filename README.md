🚀 Operations Portal – README

A complete internal operations dashboard built with React, TailwindCSS, React Router, and a JSON-Server mock backend.
The portal supports multiple user roles (Agent, Manager, Admin) and includes modules for:

• Merchant Onboarding
• Order Tracking
• Payment Reconciliation
• Support Ticket Management
• Admin Panel (User Role Management)
• Dashboard with Stats & Recent Orders

📌 Table of Contents
- Features
- Tech Stack
- Local Setup
- Available Login Accounts
- Mock Backend API (JSON-Server)
- API Endpoints
- Data Structure
- Role Access Rules
- Project Structure

⭐ FEATURES
------------------------------------
✅ Dashboard
• Summary cards  
• Last 3 recent orders  
• Quick-action shortcuts

✅ Merchants Module
• Add merchants (3-step wizard)  
• Approve / Reject  
• View list  

✅ Orders Module
• Search + Filter  
• View details  
• Status updates (Processing → Shipped → Delivered)

✅ Payment Reconciliation
• Admin/Manager only  
• Select + reconcile  
• Toast notifications  

✅ Support Tickets
• Create/search/filter  
• Status updates  
• Auto-assign to user  

✅ Notifications
• Dropdown  
• Outside click close  

✅ Admin Panel
• Role management (agent / manager / admin)

✅ Authentication + Role-based Access
• Login/logout  
• Protected routes  
• Sidebar changes based on role  


🛠 TECH STACK
------------------------------------
UI: React + TailwindCSS  
Routing: React Router  
Icons: Lucide Icons  
Backend: JSON Server  
State: React Hooks  
Auth: Custom AuthProvider  


🧑‍💻 LOCAL SETUP
------------------------------------

1️⃣ Clone the Project
------------------------------------
git clone <repo-url>
cd operations-portal


2️⃣ Install Dependencies
------------------------------------
npm install


3️⃣ Start Frontend + Backend Together
------------------------------------
npm run start:all


4️⃣ Or start manually:
------------------------------------
# Start JSON Server
npx json-server --watch db.json --port 4000

# Start Frontend
npm run dev


🔐 AVAILABLE LOGIN ACCOUNTS
------------------------------------
ROLE        USERNAME     PASSWORD
Admin       admin        pass
Manager     manager1     pass
Agent       agent1       pass


📡 MOCK BACKEND API (JSON-SERVER)
------------------------------------
Users:
  GET    /users
  POST   /users
  PATCH  /users/:id

Merchants:
  GET    /merchants
  POST   /merchants
  PATCH  /merchants/:id

Orders:
  GET    /orders
  PATCH  /orders/:id

Tickets:
  GET    /tickets
  POST   /tickets
  PATCH  /tickets/:id

Reconciliations:
  GET    /reconciliations
  PATCH  /reconciliations/:id


🗂 SAMPLE DATA STRUCTURE (db.json)
------------------------------------
{
  "users": [
    { "id": 1, "username": "admin", "role": "admin", "password": "pass" },
    { "id": 2, "username": "manager1", "role": "manager", "password": "pass" },
    { "id": 3, "username": "agent1", "role": "agent", "password": "pass" }
  ],

  "merchants": [
    {
      "id": 1,
      "businessName": "ABC Retail",
      "businessType": "retail",
      "status": "pending"
    }
  ],

  "orders": [
    {
      "id": "ORD-1001",
      "customer": "John Doe",
      "status": "processing",
      "amount": 120.5,
      "created_at": "2025-01-18"
    }
  ],

  "tickets": [
    {
      "id": 1,
      "subject": "Payment failed",
      "customer": "Alice",
      "priority": "High",
      "status": "open",
      "assigned_to": 3
    }
  ],

  "reconciliations": [
    {
      "id": 1,
      "transaction_id": "TXN-001",
      "amount": 85,
      "status": "pending",
      "reconciled": false
    }
  ]
}


🛡 ROLE ACCESS RULES
------------------------------------
FEATURE                Agent   Manager   Admin
Dashboard               ✔️       ✔️        ✔️
Merchants               ✔️       ✔️        ✔️
Orders                  ✔️       ✔️        ✔️
Tickets                 ✔️       ✔️        ✔️
Payments                ❌       ✔️        ✔️
Admin Panel             ❌       ❌        ✔️


📦 PROJECT STRUCTURE
------------------------------------
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
