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

    // 1. Create prodi table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prodi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_prodi VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default prodi if table is empty
    const [prodiRows]: any = await connection.query("SELECT COUNT(*) as count FROM prodi");
    if (prodiRows[0].count === 0) {
      await connection.query(`
        INSERT INTO prodi (nama_prodi) VALUES
        ('Informatika'),
        ('Sistem Informasi'),
        ('Teknik Elektro'),
        ('Manajemen'),
        ('Akuntansi')
      `);
      console.log("Seeded default prodi.");
    }

    // 2. Drop lama mahasiswa, dan buat mahasiswa dengan foreign key dan foto
    // Kita gunakan try-catch jika tabel belum ada atau constraint belum ada
    try {
      // Hapus tabel mahasiswa versi lama jika tidak memiliki constraint fk_mahasiswa_prodi
      // Namun untuk amannya, karena kita mau menimpa, kita drop saja jika ada
      // Perhatikan: Menghapus tabel akan menghilangkan data mahasiswa sebelumnya
      await connection.query('DROP TABLE IF EXISTS mahasiswa');
    } catch (e) {
      console.log(e);
    }

    await connection.query(`
      CREATE TABLE mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim VARCHAR(20) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        prodi_id INT NOT NULL,
        angkatan INT NOT NULL,
        foto VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_mahasiswa_prodi
          FOREIGN KEY (prodi_id) REFERENCES prodi(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      )
    `);

    // 3. Create users table for authentication
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 4. Create produk table (tugas sebelumnya)
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
    console.log("Database initialized & tables checked (termasuk relasi prodi, users, produk).");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

export default pool;
