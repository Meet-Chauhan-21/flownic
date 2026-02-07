import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const VerifiedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Email Verified Successfully 🎉
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-1">
          Thank you for confirming your email address.
        </p>
        <p className="text-gray-600 mb-6">
          Your account is now active and ready to use.
        </p>

        {/* Action */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="primary w-full"
        >
          Continue to Home
        </button>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-4">
          You can safely close this page now.
        </p>
      </div>
    </div>
  );
};

export default VerifiedPage;
