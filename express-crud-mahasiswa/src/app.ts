import express from "express";
import cors from "cors";
import { initDb } from "./db";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import produkRoutes from "./routes/produk.route";

const app = express();
const PORT = 3000;

// Initialize Database connection and create tables if they don't exist
initDb();

app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/produk", produkRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
