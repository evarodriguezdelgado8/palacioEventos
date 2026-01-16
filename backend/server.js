import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import salasRoutes from './routes/salasRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/salas', salasRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('🚀 Servidor Palacio Eventos funcionando correctamente');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
