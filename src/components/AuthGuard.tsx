import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          // Clear any stale session data
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          
          toast({
            title: "Session Expired",
            description: "Please sign in again.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        if (!session) {
          navigate("/login");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any stale session data
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        navigate("/login");
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // Ensure clean session state
        localStorage.removeItem('supabase.auth.token');
        navigate("/login");
      } else if (!session) {
        console.log('No active session');
        navigate("/login");
      }
    });

    // Initial auth check
    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}