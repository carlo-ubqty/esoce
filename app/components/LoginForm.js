"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token); // Store token
      onLogin(); // Refresh UI
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <Form onSubmit={handleLogin}>
        {error && <Alert variant="danger">{error}</Alert>}
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
        <Button type="submit" variant="primary">Login</Button>
      </Form>
  );
}
