import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Formato de token inválido.' });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

export default verificarToken;
