"use client";

import { useState } from "react";
import Sidebar from "../dashboards/Sidebar";

export default function SidebarWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* toggle button when sidebar hidden */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md shadow-md text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <main
        className={`${sidebarOpen ? "ml-64" : "ml-0"} flex-1 transition-all duration-300`}
      >
        {children}
      </main>
    </div>
  );
} 