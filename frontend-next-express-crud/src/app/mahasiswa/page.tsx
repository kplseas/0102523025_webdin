"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";
import { getUser, logout } from "@/lib/auth";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) setRole(user.role);
    
    // Load prodi for dropdowns
    getProdi().then(setProdiList).catch(() => {});
  }, []);

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit
      });
      setMahasiswa(result.data || []);
      setTotalPage(result.meta?.totalPage || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, [page]); // trigger load on page change

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setMessage("");
      setError("");
      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("Data mahasiswa berhasil ditambahkan");
      }
      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;
    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("Data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  const canCreate = role === "admin" || role === "operator";

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
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

      {canCreate && (
        <MahasiswaForm
          prodiList={prodiList}
          selectedMahasiswa={selectedMahasiswa}
          onSubmit={handleSubmit}
          onCancelEdit={() => setSelectedMahasiswa(null)}
        />
      )}

      <section className="card" style={{ marginTop: 20 }}>
        <h2>Daftar Mahasiswa</h2>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NIM atau nama"
          />
          <select 
            value={prodiId} 
            onChange={(e) => setProdiId(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          >
            <option value="">Semua Prodi</option>
            {prodiList.map((item) => (
              <option key={item.id} value={item.id}>{item.nama_prodi}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={handleSearch}>Cari / Filter</button>
        </div>

        {loading ? (
          <p>Memuat data dari server...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Halaman {page} dari {totalPage}</span>
              <button className="btn-secondary" disabled={page >= totalPage} onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
