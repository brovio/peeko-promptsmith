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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        toast({
          title: "Authentication required",
          description: "Please log in to access settings",
          variant: "destructive",
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_superadmin')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Log the superadmin check for debugging
      console.log('Is Superadmin:', profile?.is_superadmin);
      setIsSuperAdmin(profile?.is_superadmin || false);
    };
    checkAuth();
  }, [navigate, toast]);

  const handleApiKeyValidated = (key: string) => {
    setApiKey(key);
  };

  const handleApiKeyDeleted = () => {
    setApiKey("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-8">
        <section className="pb-8 border-b border-primary/20">
          <ApiKeyManager 
            onApiKeyValidated={handleApiKeyValidated}
            onApiKeyDeleted={handleApiKeyDeleted}
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