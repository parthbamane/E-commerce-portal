# 🚀 Operations Portal – README

A complete internal operations dashboard built with React, TailwindCSS, React Router, and a JSON-Server mock backend.
The portal supports multiple user roles (Agent, Manager, Admin) and includes modules for:

- Merchant Onboarding
- Order Tracking
- Payment Reconciliation
- Support Ticket Management
- Admin Panel (User Role Management)
- Dashboard with Stats & Recent Orders

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

# 1️⃣ Clone the Project
git clone https://github.com/parthbamane/E-commerce-portal.git

cd operations-portal

# 2️⃣ Install Dependencies
npm install

# 3️⃣ Start Frontend + JSON Server Together
npm run start:all

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

# 📦 Mock Backend API (JSON-Server)
# 📦 Mock Backend API (JSON-Server)

# Users (/users)
# - Authentication + role-based access
# - Fields: id, username, password, role (agent/manager/admin), name
# - Supports login + role changes
GET /users
GET /users/:id
PATCH /users/:id
POST /users

# Merchants (/merchants)
# - Merchant onboarding + verification
# - Fields: businessName, type, documents, status (active/pending/suspended)
GET /merchants
GET /merchants/:id
POST /merchants
PATCH /merchants/:id

# Orders (/orders)
# - Customer orders + items + payment details
# - Fields: amount, items[], status (processing/shipped/delivered/etc)
GET /orders
GET /orders/:id
PATCH /orders/:id

# Reconciliation (/reconciliations)
# - Payment gateway vs internal data matching
# - Fields: transaction_id, amount, status (balanced/mismatch/etc), reconciled
GET /reconciliations
PATCH /reconciliations/:id

# Tickets (/tickets)
# - Support ticketing system
# - Fields: subject, priority, category, status, assigned_to
GET /tickets
POST /tickets
PATCH /tickets/:id


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

