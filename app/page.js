"use client";

import {useState, useEffect} from "react";
import {Container, Button, Form} from "react-bootstrap";
import ForgotPassword from "@/app/components/auth/ForgotPassword";


export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Store access token
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setUser({email: localStorage.getItem("userEmail")});
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(isLogin ? {email, password} : {email, password, name}),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (isLogin) {
        setAccessToken(data.accessToken);
        setSuccess("Login successful!");
        localStorage.setItem("sessionToken", data.sessionToken);
        localStorage.setItem("userEmail", email);
        setUser({email});
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
    await fetch("/api/auth/logout", {method: "POST"});
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  if (!user) {
    return (
        <div className="auth-buffer">
          <div className="auth-container">
            {!showForgotPassword ? (

                <div className="p-4 border rounded shadow-sm">
                  <h5 className="mt-4 mb-3 border-bottom pb-2">{isLogin ? "Sign In" : "Create Account"}</h5>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  {!accessToken ? (
                      <form onSubmit={handleAuth}>
                        {/*{!isLogin && (*/}
                        {/*    <div className="mb-3">*/}
                        {/*      <label className="form-label">Full Name</label>*/}
                        {/*      <input*/}
                        {/*          type="text"*/}
                        {/*          className="form-control"*/}
                        {/*          value={name}*/}
                        {/*          onChange={(e) => setName(e.target.value)}*/}
                        {/*          required*/}
                        {/*      />*/}
                        {/*    </div>*/}
                        {/*)}*/}
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
                        <button type="submit" className="btn btn-primary auth-submit-button" disabled={loading}>
                          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Sign In" : "Create Account"}
                        </button>
                      </form>
                  ) : (
                      <button className="btn btn-danger mt-3" onClick={handleLogout}>
                        Logout
                      </button>
                  )}
                  {!accessToken && (
                      <div>
                        <button className="btn btn-link mt-3 auth-misc-link" onClick={() => setIsLogin(!isLogin)}>
                          {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
                        </button>
                        <button className="btn btn-link mt-3 auth-misc-link" onClick={() => setShowForgotPassword(true)}>
                          Forgot Password?
                        </button>
                      </div>

                  )}
                </div>
            ) : (
                <ForgotPassword
                    onResetSuccess={() => setShowForgotPassword(false)}
                    onCancel={() => setShowForgotPassword(false)}
                />
            )}

          </div>
        </div>


    );
  }

  // Home Contents
  return (
      <Container className="mt-5">
        <h2>Welcome, {user.email}!</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
  );
}
