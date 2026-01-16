import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function seedDatabase() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    };

    try {
        // 1. Connect without database to ensure we can create it
        const connection = await mysql.createConnection(config);
        console.log('🔌 Conectado a MySQL...');

        // 2. Read SQL file
        const sqlPath = path.resolve('../database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // 3. Execute SQL
        console.log('🚀 Ejecutando script de base de datos...');
        await connection.query(sql);

        console.log('✅ Base de datos y tablas creadas exitosamente.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        process.exit(1);
    }
}

seedDatabase();
