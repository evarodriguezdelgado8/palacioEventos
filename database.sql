-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS palacio_eventos;
USE palacio_eventos;

-- Desactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'user'
);

-- Tabla de Salas
CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255)
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    sala_id INT NOT NULL,
    fecha_evento DATE NOT NULL,
    tipo_evento VARCHAR(100),
    numero_asistentes INT NOT NULL,
    servicios_adicionales TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (sala_id) REFERENCES salas(id),
    -- Evitar duplicados de reserva para la misma sala y fecha
    UNIQUE KEY unique_reserva (sala_id, fecha_evento)
);

-- Limpiar tablas
TRUNCATE TABLE salas;
-- Opcional: TRUNCATE TABLE reservas; (Si queremos limpiar reservas también, descomentar)

-- Activar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Insertar datos iniciales de Salas con rutas actualizadas
INSERT INTO salas (nombre, capacidad, descripcion, imagen_url) VALUES 
('Sala Real', 100, 'Majestuosa sala con decoración clásica ideal para bodas y recepciones elegantes.', 'salaReal/salaReal1.webp'),
('Sala Modernista', 80, 'Espacio vanguardista con iluminación natural, perfecto para conferencias y exposiciones.', 'salaModernista/salaModernista1.webp'),
('Sala Escénica', 150, 'Escenario equipado y gran acústica, ideal para presentaciones, conciertos y teatro.', 'salaEscenica/salaEscenica1.jpg'),
('Sala Jardín', 200, 'Amplio espacio al aire libre rodeado de naturaleza, perfecto para cócteles y eventos nocturnos.', 'salaJardin/salaJardin1.jpg');
