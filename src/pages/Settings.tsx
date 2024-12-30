import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ApiKeyManager } from "@/components/settings/ApiKeyManager";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { RoleManagement } from "@/components/settings/RoleManagement";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Session exists' : 'No session');
      
      if (sessionError) {
        console.error('Error checking auth state:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        return;
      }

      if (!session) {
        console.log('No session found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Checking profile for user:', session.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      console.log('Profile data:', profile);
      console.log('Is Superadmin:', profile?.is_superadmin);
      setIsSuperAdmin(profile?.is_superadmin || false);
    };
    
    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <section className="pb-8 border-b border-primary/20">
          <ApiKeyManager 
            onApiKeyValidated={setApiKey}
            onApiKeyDeleted={() => setApiKey("")}
          />
        </section>

        {isSuperAdmin && (
          <section className="py-8 border-b border-primary/20">
            <h2 className="text-2xl font-semibold mb-6">Role Management</h2>
            <RoleManagement />
          </section>
        )}

        <section className="pt-4">
          <ThemeSettings />
        </section>
      </div>
    </div>
  );
}