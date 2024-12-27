import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ApiKeyManager } from "@/components/settings/ApiKeyManager";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication and ensure profile exists
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

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: session.user.id }]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error",
            description: "Failed to create user profile",
            variant: "destructive",
          });
          return;
        }
      }
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
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <ApiKeyManager 
          onApiKeyValidated={handleApiKeyValidated}
          onApiKeyDeleted={handleApiKeyDeleted}
        />
      </div>
    </div>
  );
}