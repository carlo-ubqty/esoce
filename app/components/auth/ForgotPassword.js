"use client";
import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

export default function ForgotPassword({ onResetSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset code");

      setMessage(data.message);
      setVariant("success");
      setStep(2);
    } catch (error) {
      setMessage(error.message);
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setMessage(data.message);
      setVariant("success");
      setTimeout(onResetSuccess, 2000); // Redirect after success
    } catch (error) {
      setMessage(error.message);
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <h4 className="mb-3 border-bottom pb-2">{step === 1 ? "Forgot Password" : "Reset Password"}</h4>

        {message && <Alert variant={variant}>{message}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === 2}
            />
          </Form.Group>

          {step === 2 && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
            </>
          )}

          <div className="d-flex justify-content-between">
            {step === 1 ? (
              <Button variant="primary" onClick={handleForgotPassword} disabled={loading} style={{ backgroundColor: "#198754"}}>
                {loading ? "Sending..." : "Send Code"}
              </Button>
              ) : (
              <Button variant="primary" onClick={handleResetPassword} disabled={loading} style={{ backgroundColor: "#198754"}}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            )}

            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
