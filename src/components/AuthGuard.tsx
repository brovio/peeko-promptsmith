import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingModal } from "./LoadingModal";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingModal 
      open={isLoading} 
      currentModel="Authenticating..." 
      attemptCount={1}
      title="Checking authentication..."
      description="Please wait while we verify your session."
    />;
  }

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
    navigate('/login');
    return null;
  }

  if (isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
    navigate('/');
    return null;
  }

  return <>{children}</>;
}