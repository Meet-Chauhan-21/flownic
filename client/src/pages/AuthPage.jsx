import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthTabs from "../components/AuthTabs.jsx";
import SignInForm from "../components/SignInForm.jsx";
import SignUpForm from "../components/SignUpForm.jsx";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [message, setMessage] = useState("");
  const [subMessage, setSubMessage] = useState("");
  const navigate = useNavigate();

  const handleSignInSuccess = () => {
    navigate("/");
  };

  const handleSignUpSuccess = () => {
    setMessage("Verification email sent.");
    setSubMessage("Please verify your email.");
    setActiveTab("signup");
  };

  return (
    <div className="page auth">
      <div className="panel">
        <h1>Welcome back</h1>
        <p className="muted">Sign in or create your account.</p>
        <AuthTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "signin" ? (
          <SignInForm onSuccess={handleSignInSuccess} />
        ) : (
          <SignUpForm onSuccess={handleSignUpSuccess} />
        )}
        {message && (
          <div className="info center">
            <p>{message}</p>
            {subMessage && <p>{subMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
