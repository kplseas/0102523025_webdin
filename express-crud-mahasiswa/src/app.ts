import express from "express";
import cors from "cors";
import path from "path";
import { initDb } from "./config/database";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import prodiRoutes from "./routes/prodi.route";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
const PORT = 3000;

initDb();

app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Agar file di folder uploads bisa diakses oleh frontend
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
