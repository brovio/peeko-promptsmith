import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingModal } from "./LoadingModal";
import { useToast } from "@/hooks/use-toast";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const initializeAuth = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again",
            variant: "destructive",
          });
          throw error;
        }
        
        if (mounted) {
          const isAuthed = !!session?.user;
          console.log('Initial session check:', isAuthed ? 'Authenticated' : 'No session');
          
          setIsAuthenticated(isAuthed);
          setIsLoading(false);

          if (!isAuthed && !PUBLIC_ROUTES.includes(location.pathname)) {
            console.log('No auth, redirecting to login');
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error during session check:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setIsLoading(false);
        if (location.pathname === '/login') {
          navigate('/', { replace: true });
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        setIsLoading(false);
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } else if (event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      } else if (event === 'USER_UPDATED') {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

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
    navigate('/', { replace: true });
    return null;
  }

  // Handle private routes when not authenticated
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
    navigate('/login', { replace: true });
    return null;
  }

  return <>{children}</>;
}