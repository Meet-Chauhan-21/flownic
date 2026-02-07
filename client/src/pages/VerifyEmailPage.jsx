import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService.js";

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
        navigate("/verified", { replace: true });
      } catch (err) {
        const message = err?.response?.data?.message || "Verification failed.";
        setError(message);
        setStatus("error");
      }
    };

    verify();
  }, [navigate, searchParams]);

  if (status === "verifying") {
    return <div className="page center">Verifying your email...</div>;
  }

  if (status === "error") {
    return (
      <div className="page center">
        <div className="card">
          <h2>Verification failed</h2>
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmailPage;
