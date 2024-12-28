import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "@/pages/Settings";
import Models from "@/pages/Models";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Account from "@/pages/Account";
import ForgotPassword from "@/pages/ForgotPassword";
import WhatPrompting from "@/pages/WhatPrompting";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
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

function App() {
  // Initialize theme from localStorage on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to light theme
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <Index />
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <Settings />
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/models"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <Models />
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <Profile />
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/account"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <Account />
                </>
              </AuthGuard>
            }
          />
          <Route
            path="/what-prompting"
            element={
              <AuthGuard>
                <>
                  <Header />
                  <WhatPrompting />
                </>
              </AuthGuard>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;