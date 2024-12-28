import LoginForm from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}