"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUser, logout } from "@/lib/auth";

export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      window.location.href = "/login";
    } else {
      setRole(user.role);
    }
  }, []);

  return (
    <main className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Dashboard Sistem Akademik</h1>
          <button className="btn-danger" onClick={logout}>Logout</button>
        </div>
        <p>
          Selamat datang di aplikasi manajemen akademik yang telah dilengkapi fitur
          Autentikasi, Role User, dan Relasi Tabel.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          <Link href="/mahasiswa">
            <button className="btn-primary">Kelola Data Mahasiswa</button>
          </Link>
          {role === "admin" && (
            <Link href="/users">
              <button className="btn-primary" style={{ backgroundColor: "#6366f1" }}>Kelola Data Akun (Admin)</button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
