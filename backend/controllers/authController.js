import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar datos básicos
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Verificar si el usuario ya existe
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos.' });
        }

        // Buscar usuario
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const usuario = usuarios[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar Token
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET || 'secreto_super_seguro',
            { expiresIn: '2h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
