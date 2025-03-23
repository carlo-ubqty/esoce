"use client";

import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Store access token

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email, password } : { email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (isLogin) {
        setAccessToken(data.accessToken);
        setSuccess("Login successful!");
      } else {
        setSuccess("Registration successful! Check your email.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!accessToken) {
      setError("No user logged in!");
      return;
    }

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");

      setAccessToken(null);
      setSuccess("Logout successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="container mt-5">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {!accessToken ? (
            <form onSubmit={handleAuth}>
              {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                  </div>
              )}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
              </button>
            </form>
        ) : (
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
        )}
        {!accessToken && (
            <button className="btn btn-link mt-3" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
            </button>
        )}
      </div>
  );
}
