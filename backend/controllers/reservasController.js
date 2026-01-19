import db from '../db.js';

export const crearReserva = async (req, res) => {
    try {
        const { sala_id, fecha_evento, tipo_evento, numero_asistentes, servicios_adicionales } = req.body;
        const usuario_id = req.usuario.id; // Del token

        // Validar campos
        if (!sala_id || !fecha_evento || !numero_asistentes) {
            return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }

        // 1. Verificar Aforo
        const [sala] = await db.query('SELECT capacidad FROM salas WHERE id = ?', [sala_id]);
        if (sala.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada.' });
        }

        if (numero_asistentes > sala[0].capacidad) {
            return res.status(400).json({ error: `Aforo excedido. La capacidad máxima es de ${sala[0].capacidad} personas.` });
        }

        // 2. Verificar Disponibilidad
        const [ocupacion] = await db.query(
            'SELECT id FROM reservas WHERE sala_id = ? AND fecha_evento = ?',
            [sala_id, fecha_evento]
        );

        if (ocupacion.length > 0) {
            return res.status(409).json({ error: 'La fecha seleccionada no está disponible para esta sala.' });
        }

        // Insertar Reserva
        await db.query(
            'INSERT INTO reservas (usuario_id, sala_id, fecha_evento, tipo_evento, numero_asistentes, servicios_adicionales) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, sala_id, fecha_evento, tipo_evento, numero_asistentes, servicios_adicionales]
        );

        res.status(201).json({ message: 'Reserva creada exitosamente.' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya existe una reserva para esta sala en la fecha indicada.' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getDisponibilidad = async (req, res) => {
    try {
        const { sala_id } = req.params;
        const [fechas] = await db.query('SELECT fecha_evento FROM reservas WHERE sala_id = ?', [sala_id]);

        // Retornar array de strings de fechas ocupadas
        // Retornar array de strings de fechas ocupadas
        const fechasOcupadas = fechas.map(f => {
            const d = new Date(f.fecha_evento);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        });
        res.json(fechasOcupadas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMisReservas = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const [reservas] = await db.query(
            `SELECT r.*, s.nombre as nombre_sala 
       FROM reservas r 
       JOIN salas s ON r.sala_id = s.id 
       WHERE r.usuario_id = ? 
       ORDER BY r.fecha_evento DESC`,
            [usuario_id]
        );

        // Formatear fechas manualmente para evitar UTC shift
        const reservasFormatted = reservas.map(r => {
            const d = new Date(r.fecha_evento);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return {
                ...r,
                fecha_evento: `${year}-${month}-${day}`
            };
        });

        res.json(reservasFormatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
