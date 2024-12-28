import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-11 text-base"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}