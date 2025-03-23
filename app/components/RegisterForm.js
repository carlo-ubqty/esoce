"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <Form onSubmit={handleRegister}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Registration successful! Please check your email to verify your account.</Alert>}
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
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Register</Button>
      </Form>
  );
}
