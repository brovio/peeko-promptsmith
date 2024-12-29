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
    let mounted = true;

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
            setIsAuthenticated(false);
            setIsLoading(false);
            if (!PUBLIC_ROUTES.includes(location.pathname)) {
              navigate('/login');
            }
            return;
          }

          console.log('Initial session check:', session?.user?.id ? 'Authenticated' : 'No session');
          setIsAuthenticated(!!session);
          setIsLoading(false);

          if (!session && !PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error during session check:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setIsLoading(false);
        if (location.pathname === '/login') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAuthenticated(false);
        setIsLoading(false);
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (isLoading) {
    return <LoadingModal 
      open={isLoading} 
      currentModel="Authenticating..." 
      attemptCount={1}
      title="Checking authentication..."
      description="Please wait while we verify your session."
    />;
  }

  // Handle public routes when authenticated
  if (isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
    navigate('/');
    return null;
  }

  // Handle private routes when not authenticated
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
}