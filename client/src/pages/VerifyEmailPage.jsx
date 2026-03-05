import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService.js";
import { CheckCircle } from "lucide-react";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Missing verification token.");
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        const message = err?.response?.data?.message || "Verification failed.";
        setError(message);
        setStatus("error");
      }
    };

    verify();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="page center">
        <div className="card">
          <p>Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="page center">
        <div className="card">
          <h2>Verification failed</h2>
          <p className="error">{error}</p>
          <button 
            className="primary" 
            type="button" 
            onClick={() => navigate("/auth", { replace: true })}
            style={{ marginTop: "16px" }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="page center">
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <CheckCircle 
              size={64} 
              color="var(--primary)" 
              style={{ animation: "bounce 0.6s ease-in-out" }}
            />
          </div>
          <h2 style={{ margin: "0 0 8px" }}>Email Verified Successfully 🎉</h2>
          <p className="muted" style={{ margin: "0 0 16px" }}>
            Thank you for confirming your email address.
          </p>
          <p className="muted" style={{ margin: "0 0 24px" }}>
            Your account is now active and ready to use.
          </p>
          <button 
            className="primary" 
            type="button" 
            onClick={() => navigate("/", { replace: true })}
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage;
