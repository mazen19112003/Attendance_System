import React, { useState } from "react";
import { login } from "../api";

export default function LoginPage({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("من فضلك ادخل اليوزر نيم والباسورد");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(username.trim(), password);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="brand-dot" />
          <span>لوحة الإدارة</span>
        </div>

        <p className="login-subtitle">سجل دخول عشان تكمل</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-row">
          <label htmlFor="username">اليوزر نيم</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">الباسورد</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
