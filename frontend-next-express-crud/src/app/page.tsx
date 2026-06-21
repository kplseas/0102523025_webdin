import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Frontend Next.js untuk Express CRUD API</h1>
        <p>
          Aplikasi ini adalah contoh frontend Next.js yang mengakses backend
          Express.js melalui REST API.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <Link href="/mahasiswa">
            <button className="btn-primary">Buka Data Mahasiswa</button>
          </Link>
          <Link href="/produk">
            <button className="btn-primary" style={{ backgroundColor: "#10b981" }}>Buka Data Produk</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
