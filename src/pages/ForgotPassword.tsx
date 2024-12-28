import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password? 🔑"
      subtitle="Enter your email to reset your password"
      headerTitle="Reset Password"
      headerDescription="We'll send you instructions to reset your password"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}