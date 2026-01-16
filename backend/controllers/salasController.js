import db from '../db.js';

export const getAllSalas = async (req, res) => {
    try {
        const [salas] = await db.query('SELECT * FROM salas');
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSalaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [salas] = await db.query('SELECT * FROM salas WHERE id = ?', [id]);

        if (salas.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada' });
        }

        res.json(salas[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
