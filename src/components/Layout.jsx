import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";


import {
  LayoutDashboard,
  Package,
  Store,
  DollarSign,
  Headphones,
  Bell,
  Menu,
  ArrowRightSquare,
  UserCog ,
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);


  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);


  useEffect(() => {
    const closeNotif = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", closeNotif);
    return () => document.removeEventListener("mousedown", closeNotif);
  }, []);

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-900 text-white border-r border-gray-800 flex flex-col shrink-0">

          <nav className="flex-1 px-6 py-10 mt-6 space-y-10">
            <p className="text-sm font-semibold text-gray-400 mb-4">Main Menu</p>

            <div className="space-y-4">
              <SidebarLink to="/" label="Dashboard" icon={LayoutDashboard} />
              <SidebarLink to="/merchants" label="Merchants" icon={Store} />
              <SidebarLink to="/orders" label="Orders" icon={Package} />

              {/* Payments: admin + manager */}
              {(user?.role === "admin" || user?.role === "manager") && (
                <SidebarLink to="/reconciliation" label="Payments" icon={DollarSign} />
              )}

              {/* Admin Panel: ONLY admin */}
              {user?.role === "admin" && (
                <SidebarLink to="/admin" label="Admin Panel" icon={UserCog} />
              )}

              <SidebarLink to="/tickets" label="Support" icon={Headphones} />
            </div>


          </nav>

          {/* Bottom User Section */}
          <div className="px-6 py-6 border-t border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0]}
            </div>

            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <span className="text-xs bg-blue-600 px-3 py-0.5 rounded">{user?.role}</span>
            </div>
          </div>

        </aside>
      )}

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER  */}
        <header className="w-full bg-gray-900 text-white border-b border-gray-800 px-8 py-6 flex items-center justify-between shrink-0">

          {/* Left: Sidebar toggle */}
          <div className="flex items-center gap-4">
            <Menu
              className="w-6 h-6 cursor-pointer text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <span className="text-xl font-semibold">Operations Portal</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/*NOTIFICATIONS  */}
            <div ref={notifRef} className="relative">
              <div className="relative cursor-pointer" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </div>

              {notifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-900">Notifications</p>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y">
                    <NotifItem
                      text="New refund ticket created"
                      time="2 minutes ago"
                    />
                    <NotifItem
                      text="Payment reconciliation completed"
                      time="10 minutes ago"
                    />
                    <NotifItem
                      text="Merchant documents uploaded"
                      time="1 hour ago"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* USER MENU  */}
            <div
              ref={menuRef}
              className="relative flex items-center gap-3 cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold">
                {user?.name?.[0]}
              </div>

              <p className="font-medium">{user?.name}</p>

              {userMenuOpen && (
                <div className="absolute right-0 mt-14 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <div className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-gray-500 text-sm">{user?.email || `${user?.name}@company.com`}</p>
                  </div>

                  <button
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-100 text-gray-800 text-left"
                    onClick={() => {
                      logout();
                      nav("/login");
                    }}
                  >
                    <ArrowRightSquare className="w-5 h-5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </header>

        {/* MAIN CONTENT   */}
        <main className="flex-1 overflow-y-auto p-10 bg-white">
          <div className="max-w-6xl w-full mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}

{/*  Notification Item Component  */ }
function NotifItem({ text, time }) {
  return (
    <div className="p-4 hover:bg-gray-50 cursor-pointer">
      <p className="text-sm font-medium text-gray-800">{text}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  );
}

{/*  Sidebar Link Component */ }
function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-3 rounded-md text-lg font-medium
        transition-all
        ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}
      `
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
}
