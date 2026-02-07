import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import VerifiedPage from "./pages/VerifiedPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verified" element={<VerifiedPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;
