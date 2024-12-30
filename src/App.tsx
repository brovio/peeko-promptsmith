import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Models from "@/pages/Models";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Account from "@/pages/Account";
import WhatPrompting from "@/pages/WhatPrompting";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Wrapper component to handle conditional header rendering
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <AuthGuard>
        {!isLoginPage && <Header />}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/models" element={<Models />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/what-prompting" element={<WhatPrompting />} />
        </Routes>
      </AuthGuard>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;