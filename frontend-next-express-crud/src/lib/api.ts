import { getToken } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

// --- TYPES ---
export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: string;
};

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

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at?: string;
};

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "operator" | "viewer";
};

type ApiResponse<T> = {
  message: string;
  data?: T;
  meta?: any;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let result;
  try {
    result = await response.json();
  } catch (err) {
    result = {};
  }
  
  if (response.status === 401) {
    // Jika token tidak valid / belum login
    if (typeof window !== "undefined" && window.location.pathname !== '/login') {
       window.location.href = '/login';
    }
  }

  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mengakses API");
  }
  return result;
}

// Menambahkan token di setiap request
function getHeaders(isFormData = false) {
  const token = getToken();
  const headers: any = {
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}


// --- PRODI API ---
export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`, { cache: "no-store" });
  const result = await handleResponse<Prodi[]>(response);
  return result.data || [];
}

// --- MAHASISWA API ---
export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`, {
    headers: getHeaders(),
  });
  const result = await handleResponse<Mahasiswa[]>(response);
  return result;
}

export async function createMahasiswa(formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });
  const result = await handleResponse<Mahasiswa>(response);
  return result.data;
}

export async function updateMahasiswa(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: formData,
  });
  await handleResponse(response);
}

export async function deleteMahasiswa(id: number) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  await handleResponse(response);
}


// --- PRODUK API ---
export async function getProduk(): Promise<Produk[]> {
  const response = await fetch(`${API_URL}/produk`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  const result = await handleResponse<Produk[]>(response);
  return result.data || [];
}

export async function createProduk(payload: ProdukInput): Promise<Produk> {
  const response = await fetch(`${API_URL}/produk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await handleResponse<Produk>(response);
  return result.data as Produk;
}

export async function updateProduk(id: number, payload: ProdukInput): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteProduk(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  await handleResponse(response);
}


// --- USERS API (Admin Only) ---
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  const result = await handleResponse<User[]>(response);
  return result.data || [];
}

export async function createUser(payload: UserInput) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function updateUser(id: number, payload: UserInput) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  await handleResponse(response);
}

export async function deleteUser(id: number) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  await handleResponse(response);
}

export async function resetPasswordByAdmin(id: number): Promise<{ message: string; temporaryPassword?: string; note?: string }> {
  const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Terjadi kesalahan saat mereset password");
  }
  return result;
}
