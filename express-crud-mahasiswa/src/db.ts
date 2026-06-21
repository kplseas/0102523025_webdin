import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Password default Laragon biasanya kosong
  database: 'tugas_webdin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create mahasiswa table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim VARCHAR(20) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        prodi VARCHAR(100) NOT NULL,
        angkatan INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create produk table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS produk (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        harga INT NOT NULL,
        stok INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log("Database initialized & tables checked.");
  } catch (error) {
    console.error("Database connection failed:", error);
    // You might want to process exit here or handle it gracefully
  }
}

export default pool;
