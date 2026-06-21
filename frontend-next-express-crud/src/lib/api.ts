export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// --- MAHASISWA TYPES & API ---
export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  created_at?: string;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
};

// --- PRODUK TYPES & API ---
export type Produk = {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  created_at?: string;
};

export type ProdukInput = {
  nama: string;
  harga: number;
  stok: number;
};

type ApiResponse<T> = {
  message: string;
  data?: T;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }
  return result;
}

// --- MAHASISWA API FUNCTIONS ---
export async function getMahasiswa(): Promise<Mahasiswa[]> {
  try {
    const response = await fetch(`${API_URL}/mahasiswa`, {
      cache: "no-store",
    });
    const result = await handleResponse<Mahasiswa[]>(response);
    return result.data || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Gagal terhubung ke server backend");
  }
}

export async function createMahasiswa(
  payload: MahasiswaInput
): Promise<Mahasiswa> {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await handleResponse<Mahasiswa>(response);
  return result.data as Mahasiswa;
}

export async function updateMahasiswa(
  id: number,
  payload: MahasiswaInput
): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteMahasiswa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}


// --- PRODUK API FUNCTIONS ---
export async function getProduk(): Promise<Produk[]> {
  try {
    const response = await fetch(`${API_URL}/produk`, {
      cache: "no-store",
    });
    const result = await handleResponse<Produk[]>(response);
    return result.data || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Gagal terhubung ke server backend");
  }
}

export async function createProduk(
  payload: ProdukInput
): Promise<Produk> {
  const response = await fetch(`${API_URL}/produk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await handleResponse<Produk>(response);
  return result.data as Produk;
}

export async function updateProduk(
  id: number,
  payload: ProdukInput
): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteProduk(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}
