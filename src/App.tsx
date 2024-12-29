import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Header";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Models from "@/pages/Models";
import Testing from "@/pages/Testing";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Account from "@/pages/Account";
import WhatPrompting from "@/pages/WhatPrompting";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <AuthGuard>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/models" element={<Models />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/what-prompting" element={<WhatPrompting />} />
          </Routes>
        </AuthGuard>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;