"use client";
import { useState } from "react";

export default function ForgotPassword({ onResetSuccess, onCancel }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setStep(2);
      setMessage(data.message);
    } else {
      setMessage(data.error);
    }
  };

  const handleResetPassword = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      onResetSuccess(); // Redirect to login page
    } else {
      setMessage(data.error);
    }
  };

  return (
      <div className="p-4 border rounded shadow-sm">
        {step === 1 ? (
            <>
              <h5 className="mt-4 mb-3 border-bottom pb-2">Forgot Password</h5>
              <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleForgotPassword}>Send Code</button>
              <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </>
        ) : (
            <>
              <h3>Reset Password</h3>
              <input
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleResetPassword}>Reset Password</button>
              <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </>
        )}
        <p>{message}</p>
      </div>
  );
}
