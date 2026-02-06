CREATE DATABASE IF NOT EXISTS cv_generator;
USE cv_generator;

CREATE TABLE IF NOT EXISTS historial_cv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    telefono VARCHAR(50),
    titulo VARCHAR(100),
    linkedin VARCHAR(255),
    experiencia TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
