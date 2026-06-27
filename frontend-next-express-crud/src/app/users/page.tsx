"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordByAdmin,
  User,
  UserInput,
} from "@/lib/api";
import { getUser, logout } from "@/lib/auth";

const initialForm: UserInput = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserInput>(initialForm);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checkAdmin = () => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      alert("Akses ditolak. Halaman ini khusus Admin.");
      window.location.href = "/";
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setMessage("");
      setError("");
      
      if (selectedUser) {
        // Update user
        await updateUser(selectedUser.id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        setMessage("User berhasil diperbarui");
      } else {
        // Create user
        if (!form.password) {
          throw new Error("Password wajib diisi untuk pengguna baru");
        }
        await createUser(form);
        setMessage("User berhasil ditambahkan");
      }
      
      setForm(initialForm);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Password dikosongkan saat edit
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmed) return;
    try {
      setMessage("");
      setError("");
      await deleteUser(id);
      setMessage("User berhasil dihapus");
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user");
    }
  };

  const handleResetPassword = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin reset password user ini?");
    if (!confirmed) return;
    try {
      setMessage("");
      setError("");
      const result = await resetPasswordByAdmin(id);
      alert(`Password Sementara: ${result.temporaryPassword}\n\nMohon catat password ini, karena hanya akan ditampilkan sekali!`);
      setMessage("Password berhasil di-reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal reset password");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>Kelola Data Akun (User)</h1>
          <p>Halaman ini khusus untuk Role Admin.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/">
            <button className="btn-secondary">Beranda</button>
          </Link>
          <button className="btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <h2>{selectedUser ? "Edit User" : "Tambah User Baru"}</h2>
        <div className="grid">
          <div className="form-group">
            <label>Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              required
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          {/* Sembunyikan field password saat edit karena reset password ada tombol khususnya */}
          {!selectedUser && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!selectedUser}
              />
            </div>
          )}
        </div>
        <div className="actions" style={{ marginTop: "16px" }}>
          <button type="submit" className="btn-primary" disabled={formLoading}>
            {formLoading ? "Menyimpan..." : selectedUser ? "Update User" : "Simpan User"}
          </button>
          {selectedUser && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSelectedUser(null);
                setForm(initialForm);
              }}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Daftar Pengguna Sistem</h2>
        {loading ? (
          <p>Memuat data user...</p>
        ) : users.length === 0 ? (
          <p>Belum ada data user.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        fontSize: "12px",
                        backgroundColor: user.role === 'admin' ? '#e0e7ff' : user.role === 'operator' ? '#dcfce7' : '#f3f4f6'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn-secondary" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(user.id)}>Hapus</button>
                        <button className="btn-primary" style={{ backgroundColor: "#f59e0b" }} onClick={() => handleResetPassword(user.id)}>
                          Reset Pwd
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
