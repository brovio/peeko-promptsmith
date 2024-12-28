import { useNavigate } from "react-router-dom";

interface LoginFormActionsProps {
  loading: boolean;
}

export function LoginFormActions({ loading }: LoginFormActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remember"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="remember" className="text-sm text-gray-900">
          Remember me
        </label>
      </div>
      <button
        type="button"
        className="text-sm text-blue-600 hover:text-blue-700"
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </button>
    </div>
  );
}