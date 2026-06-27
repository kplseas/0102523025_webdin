"use client";

import { useState } from "react";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login gagal");
        return;
      }

      saveAuth(result.token, result.user);
      window.location.href = "/";
    } catch (err) {
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <main className="container" style={{ maxWidth: 400, marginTop: 50 }}>
      <form onSubmit={handleLogin} className="card">
        <h2>Login Sistem</h2>
        {error && <div className="message error">{error}</div>}
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email pengguna"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 16 }}>
          Login
        </button>
      </form>
    </main>
  );
}
