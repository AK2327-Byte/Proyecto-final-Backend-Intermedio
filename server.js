const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbLibros = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'TU_NUEVA_CONTRASEÑA',
  database: 'Libros'
});

const dbRegistro = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'TU_NUEVA_CONTRASEÑA',
  database: 'Registro'
});

// Documentación Swagger (OpenAPI 3.0)
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Distribuidora de Libros y Registro',
    version: '1.0.0',
    description: 'API REST en Node.js + Express conectada a MySQL local (Libros y Registro).'
  },
  paths: {
    '/api/libros': {
      get: {
        summary: 'Listar todos los libros con su autor',
        responses: {
          200: { description: 'Lista de los 40 libros obtenida correctamente' }
        }
      }
    },
    '/api/libros/{id}': {
      get: {
        summary: 'Obtener un libro específico por ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }
        ],
        responses: {
          200: { description: 'Detalle del libro encontrado' }
        }
      }
    },
    '/api/ubicacion-hora': {
      get: {
        summary: 'Consultar ubicación y hora en APIs externas y guardar en MySQL',
        responses: {
          200: { description: 'Coordenadas y hora obtenidas y guardadas en Registro.horas' }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 1. Obtener todos los libros con su autor
app.get('/api/libros', (req, res) => {
  const sql = `
    SELECT l.id_libro, l.titulo, l.paginas, l.fecha_publicacion, l.editorial,
           a.nombre AS autor_nombre, a.apellidos AS autor_apellidos
    FROM Libros l
    INNER JOIN Autores a ON l.id_autor = a.id_autor
    ORDER BY l.id_libro ASC
  `;
  dbLibros.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Obtener un libro por ID
app.get('/api/libros/:id', (req, res) => {
  dbLibros.query('SELECT * FROM Libros WHERE id_libro = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Obtener ubicación + hora de APIs y guardar en Registro.horas
app.get('/api/ubicacion-hora', async (req, res) => {
  try {
    const rUbi = await fetch('https://ipwho.is/');
    const dUbi = await rUbi.json();
    const { latitude: lat, longitude: lon, city, country } = dUbi;

    const rHora = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`);
    const dHora = await rHora.json();
    const hora = dHora.current?.time || new Date().toISOString();

    dbRegistro.query('INSERT INTO horas (latitud, longitud, hora) VALUES (?, ?, ?)', [lat, lon, hora]);
    res.json({ city, country, lat, lon, hora });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Front end: http://localhost:${PORT}`);
  console.log(`Swagger:   http://localhost:${PORT}/api-docs`);
});