"use client";
import { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setUser({ email: localStorage.getItem("userEmail") });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("sessionToken", data.sessionToken);
      localStorage.setItem("userEmail", email);
      setUser({ email });
    } else {
      alert(data.message);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  if (!user) {
    return (
        <Container className="mt-5">
          <h2>Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Container>
    );
  }

  return (
      <Container className="mt-5">
        <h2>Welcome, {user.email}!</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
  );
}
