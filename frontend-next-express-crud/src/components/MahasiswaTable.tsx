"use client";

import { Mahasiswa, BACKEND_URL } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({ mahasiswa, onEdit, onDelete }: Props) {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setRole(user.role);
    }
  }, []);

  const canEdit = role === "admin" || role === "operator";
  const canDelete = role === "admin";

  if (mahasiswa.length === 0) {
    return <p>Belum ada data mahasiswa.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Foto</th>
            <th>NIM</th>
            <th>Nama</th>
            <th>Prodi</th>
            <th>Angkatan</th>
            {(canEdit || canDelete) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {mahasiswa.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={
                    item.foto
                      ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}`
                      : "https://via.placeholder.com/48?text=No+Photo"
                  }
                  alt={item.nama}
                  width={48}
                  height={48}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </td>
              <td>{item.nim}</td>
              <td>{item.nama}</td>
              <td>{item.nama_prodi}</td>
              <td>{item.angkatan}</td>
              {(canEdit || canDelete) && (
                <td>
                  <div className="actions">
                    {canEdit && (
                      <button className="btn-secondary" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button className="btn-danger" onClick={() => onDelete(item.id)}>
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
