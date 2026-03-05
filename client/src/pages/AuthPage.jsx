import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    setMessage("Mail sent!");
    setSubMessage("Please verify your email.");
    setActiveTab("signup");
  };

  const handleSignUpError = () => {
    setMessage("");
    setSubMessage("");
  };

  const handleTabChange = (tab) => {
    setMessage("");
    setSubMessage("");
    setActiveTab(tab);
  };

  return (
    <div className="page auth">
      <motion.div 
        className="panel"
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <h1>Welcome back</h1>
        <p className="muted">Sign in or create your account.</p>
        <AuthTabs activeTab={activeTab} onChange={handleTabChange} />
        <AnimatePresence mode="wait">
          {activeTab === "signin" ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SignInForm onSuccess={handleSignInSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SignUpForm onSuccess={handleSignUpSuccess} onError={handleSignUpError} />
            </motion.div>
          )}
        </AnimatePresence>
        {message && (
          <div className="info center">
            <p>{message}</p>
            {subMessage && <p>{subMessage}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
