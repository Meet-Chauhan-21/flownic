import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "../services/authService.js";

const SignUpForm = ({ onSuccess, onError }) => {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    onSubmit: (values, { setSubmitting }) => {
      setServerError("");
      let successShown = false;

      const showTimer = setTimeout(() => {
        successShown = true;
        onSuccess();
        setSubmitting(false);
      }, 1000);

      signUp(values)
        .catch((err) => {
          clearTimeout(showTimer);
          if (!successShown) {
            setSubmitting(false);
          }
          const message = err?.response?.data?.message || "Sign up failed.";
          setServerError(message);
          if (onError) {
            onError();
          }
        });
    }
  });

  return (
    <form className="card" onSubmit={formik.handleSubmit} noValidate>
      <label className="field">
        <span>Username</span>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
        {formik.isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;
