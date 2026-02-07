import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "../services/authService.js";

const SignInForm = ({ onSuccess }) => {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Enter a valid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      try {
        await signIn(values);
        onSuccess();
      } catch (err) {
        const message = err?.response?.data?.message || "Sign in failed.";
        setServerError(message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form className="card" onSubmit={formik.handleSubmit} noValidate>
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="error">{formik.errors.password}</p>
        )}
      </label>
      {serverError && <p className="error">{serverError}</p>}
      <button className="primary" type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
