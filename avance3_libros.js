const mysql = require('mysql2');

// 1. Establecer conexión con la base de datos Libros
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'TU_NUEVA_CONTRASEÑA',
  database: 'Libros'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos Libros.');

  // 2. Obtener todos los registros (SELECT)
  const queryTodos = `
    SELECT l.id_libro, l.titulo, l.paginas, l.fecha_publicacion, l.editorial,
           a.nombre AS autor_nombre, a.apellidos AS autor_apellidos
    FROM Libros l
    INNER JOIN Autores a ON l.id_autor = a.id_autor
  `;

  connection.query(queryTodos, (error, results) => {
    if (error) {
      console.error('Error en consulta general:', error.message);
      connection.end();
      return;
    }

    console.log(`\n--- TODOS LOS REGISTROS (${results.length} libros) ---`);
    console.table(results);

    // 3. Obtener un registro en específico (SELECT FROM ... WHERE)
    const idBuscado = 1;
    const queryEspecifico = 'SELECT * FROM Libros WHERE id_libro = ?';

    connection.query(queryEspecifico, [idBuscado], (errorEsp, resultEsp) => {
      if (errorEsp) {
        console.error('Error en consulta específica:', errorEsp.message);
      } else {
        console.log(`\n--- REGISTRO ESPECÍFICO (id_libro = ${idBuscado}) ---`);
        console.table(resultEsp);
      }

      connection.end();
    });
  });
});