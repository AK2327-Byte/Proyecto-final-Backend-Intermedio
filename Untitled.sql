CREATE DATABASE IF NOT EXISTS Libros
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Libros;

CREATE TABLE Autores (
  id_autor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL
);

CREATE TABLE Libros (
  id_libro INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  paginas INT NOT NULL,
  fecha_publicacion DATE NOT NULL,
  editorial VARCHAR(150) NOT NULL,
  id_autor INT NOT NULL,
  CONSTRAINT fk_libros_autores
    FOREIGN KEY (id_autor) REFERENCES Autores(id_autor)
);