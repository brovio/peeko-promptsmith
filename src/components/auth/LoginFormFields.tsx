import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export function LoginFormFields({ 
  email, 
  setEmail, 
  password, 
  setPassword 
}: LoginFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
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
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-11 text-base"
        />
      </div>
    </>
  );
}