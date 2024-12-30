import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

export function LoginPreview() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Email</span>
          </div>
          <Input type="email" placeholder="Enter your email" className="w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Password</span>
          </div>
          <Input type="password" placeholder="••••••••" className="w-full" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  );
}