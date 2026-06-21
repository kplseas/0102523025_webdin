"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  Mahasiswa,
  MahasiswaInput,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  
  // States for search and loading/error
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMahasiswa();
      setMahasiswa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, []);

  const handleSubmit = async (payload: MahasiswaInput) => {
    try {
      setMessage("");
      setError("");
      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, payload);
        setMessage("Data mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(payload);
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

  // Tugas 3: Fitur pencarian data menggunakan filter()
  const filteredMahasiswa = useMemo(() => {
    if (!searchQuery) return mahasiswa;
    return mahasiswa.filter((mhs) =>
      mhs.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mahasiswa, searchQuery]);

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>
        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {/* Tugas 4: Pesan Error dan Loading UI yang jelas */}
      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Daftar Mahasiswa</h2>
          
          <input
            type="text"
            placeholder="Cari nama mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: 250 }}
          />
        </div>

        {loading ? (
          <p>Memuat data dari server...</p>
        ) : (
          <MahasiswaTable
            mahasiswa={filteredMahasiswa}
            onEdit={setSelectedMahasiswa}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}
