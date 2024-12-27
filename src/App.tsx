import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "@/pages/Settings";
import Models from "@/pages/Models";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
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
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;