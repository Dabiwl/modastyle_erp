-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS modastyle_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE modastyle_erp;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    genero ENUM('Masculino', 'Femenino', 'Otro'),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntos_fidelidad INT DEFAULT 0,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
);

-- Insertar algunos datos de ejemplo
INSERT INTO clientes (nombre, email, telefono, direccion, fecha_nacimiento, genero, puntos_fidelidad) VALUES
('María González', 'maria@ejemplo.com', '555-123-4567', 'Av. Principal #123, Ciudad de México', '1985-06-15', 'Femenino', 150),
('Carlos López', 'carlos@ejemplo.com', '555-987-6543', 'Calle Secundaria #456, Guadalajara', '1990-03-22', 'Masculino', 75),
('Ana Martínez', 'ana@ejemplo.com', '555-456-7890', 'Plaza Central #789, Monterrey', '1988-11-08', 'Femenino', 200);