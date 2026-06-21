import { Router } from 'express';
import pool from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = Router();

// GET all mahasiswa
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM mahasiswa ORDER BY id DESC');
    res.json({ message: 'Data mahasiswa berhasil diambil', data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
});

// POST create mahasiswa
router.post('/', async (req, res) => {
  const { nim, nama, prodi, angkatan } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)',
      [nim, nama, prodi, angkatan]
    );
    res.status(201).json({ message: 'Data mahasiswa berhasil ditambahkan', data: { id: result.insertId, nim, nama, prodi, angkatan } });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menambah data', error });
  }
});

// PUT update mahasiswa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nim, nama, prodi, angkatan } = req.body;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?',
      [nim, nama, prodi, angkatan, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    }
    res.json({ message: 'Data mahasiswa berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate data', error });
  }
});

// DELETE mahasiswa
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM mahasiswa WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    }
    res.json({ message: 'Data mahasiswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data', error });
  }
});

export default router;
