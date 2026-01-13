import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor Express funcionando correctamente");
});

// Ruta usando MySQL
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor en ejecución: http://localhost:${PORT}`);
});
