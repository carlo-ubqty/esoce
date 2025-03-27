"use client";

import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPassword from "./ForgotPassword";

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userTypes, setUserTypes] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const res = await fetch("/api/user-types");
        const userData = await res.json();
        setUserTypes(userData);
      } catch (err) {
        console.error("Failed to fetch user types", err);
      }
    };
    fetchUserTypes();

    // Check for existing session
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setUser({ email: localStorage.getItem("userEmail") });
    }
  }, []);

  const handleLoginSuccess = (email) => {
    setUser({ email });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      // Ensure we only parse JSON if the response has content
      if (res.ok && res.headers.get("Content-Type")?.includes("application/json")) {
        await res.json();
      }

      // Clear session and update state
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("userEmail");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  if (user) {
    return (
      // Home content here!

      <div className="text-center">
        <h2>Welcome, {user.email}!</h2>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container p-4 border rounded shadow-sm">
      {!showForgotPassword ? (
        <>
          <h5 className="mb-3">{isLogin ? "Sign In" : "Create Account"}</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}


          {isLogin ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <RegisterForm userTypes={userTypes} onRegisterSuccess={() => setIsLogin(true)} />
          )}

          <div className="mt-3">
            <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
            </button>
            <button className="btn btn-link" onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </button>
          </div>
        </>
      ) : (
        <ForgotPassword onResetSuccess={() => setShowForgotPassword(false)} onCancel={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}
