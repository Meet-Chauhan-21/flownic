import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "../services/authService.js";

const SignUpForm = ({ onSuccess, onError }) => {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Enter a valid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")
    }),
    onSubmit: async (values) => {
      setServerError("");
      setIsLoading(true);
      setSignupSuccess(false);

      try {
        await signUp(values);
        setSignupSuccess(true);
        onSuccess();
        // Reset form after success
        formik.resetForm();
      } catch (err) {
        const message = err?.response?.data?.message || "Sign up failed.";
        setServerError(message);
        setSignupSuccess(false);
        if (onError) {
          onError();
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <form 
      className="card" 
      onSubmit={formik.handleSubmit} 
      noValidate
      style={{
        pointerEvents: isLoading ? "none" : "auto",
        opacity: isLoading ? 0.6 : 1,
        transition: "opacity 0.3s ease"
      }}
    >
      {!signupSuccess ? (
        <>
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error">{formik.errors.username}</p>
            )}
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </label>
          <label className="field">
            <span>Password</span>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </label>
          {serverError && <p className="error">{serverError}</p>}
          <button 
            className="primary" 
            type="submit" 
            disabled={isLoading}
            style={{ position: "relative" }}
          >
            {isLoading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span 
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }}
                />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <p style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600", color: "var(--primary)" }}>
            ✓ Account created!
          </p>
          <p style={{ margin: "0", color: "var(--muted)" }}>
            Mail sent! Please verify your email.
          </p>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
