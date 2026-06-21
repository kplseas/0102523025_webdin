"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProdukForm from "@/components/ProdukForm";
import ProdukTable from "@/components/ProdukTable";
import {
  createProduk,
  deleteProduk,
  getProduk,
  Produk,
  ProdukInput,
  updateProduk,
} from "@/lib/api";

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  
  // States for search and loading/error
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProduk();
      setProduk(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduk();
  }, []);

  const handleSubmit = async (payload: ProdukInput) => {
    try {
      setMessage("");
      setError("");
      if (selectedProduk) {
        await updateProduk(selectedProduk.id, payload);
        setMessage("Data produk berhasil diperbarui");
      } else {
        await createProduk(payload);
        setMessage("Data produk berhasil ditambahkan");
      }
      setSelectedProduk(null);
      await loadProduk();
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
      await deleteProduk(id);
      setMessage("Data produk berhasil dihapus");
      await loadProduk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  // Tugas 3: Fitur pencarian data menggunakan filter()
  const filteredProduk = useMemo(() => {
    if (!searchQuery) return produk;
    return produk.filter((p) =>
      p.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [produk, searchQuery]);

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Produk</h1>
          <p>Frontend Next.js yang terhubung ke backend Express.js.</p>
        </div>
        <Link href="/">
          <button className="btn-secondary">Kembali</button>
        </Link>
      </div>

      {/* Tugas 4: Pesan Error dan Loading UI yang jelas */}
      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <ProdukForm
        selectedProduk={selectedProduk}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedProduk(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Daftar Produk</h2>
          
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: 250 }}
          />
        </div>

        {loading ? (
          <p>Memuat data dari server...</p>
        ) : (
          <ProdukTable
            produk={filteredProduk}
            onEdit={setSelectedProduk}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
}
