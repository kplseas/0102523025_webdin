import { Router } from 'express';
import pool from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// GET all produk
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM produk ORDER BY id DESC');
    res.json({ message: 'Data produk berhasil diambil', data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// POST create produk
router.post('/', async (req, res) => {
  const { nama, harga, stok } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO produk (nama, harga, stok) VALUES (?, ?, ?)',
      [nama, harga, stok]
    );
    res.status(201).json({ message: 'Data produk berhasil ditambahkan', data: { id: result.insertId, nama, harga, stok } });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menambah data', error });
  }
});

// PUT update produk
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, harga, stok } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE produk SET nama = ?, harga = ?, stok = ? WHERE id = ?',
      [nama, harga, stok, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Data produk berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate data', error });
  }
});

// DELETE produk
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM produk WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Data produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data', error });
  }
});

export default router;
