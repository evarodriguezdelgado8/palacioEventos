// db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // si vas a usar .env para credenciales

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña de MySQL
  database: 'palacioeventos',
  port: 3306 // si usas el puerto por defecto de XAMPP
});

export default pool.promise();
