const mysql = require('mysql2');

// 1. API de ubicación (IPWHOIS.io)
const API_UBICACION = 'https://ipwho.is/';

async function ejecutarRegistro() {
  try {
    const resUbicacion = await fetch(API_UBICACION);
    const datosUbicacion = await resUbicacion.json();

    if (!datosUbicacion.success) {
      throw new Error('No se pudo obtener la ubicación: ' + datosUbicacion.message);
    }

    const latitud = datosUbicacion.latitude;
    const longitud = datosUbicacion.longitude;

    console.log('--- DATOS DE UBICACIÓN (JSON) ---');
    console.log(`Ciudad: ${datosUbicacion.city}, ${datosUbicacion.country}`);
    console.log(`Tus coordenadas son: ${latitud}, ${longitud}`);

    // 2. Enviar coordenadas para obtener la hora según la ubicación (Open-Meteo)
    const API_HORA = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m&timezone=auto`;
    const resHora = await fetch(API_HORA);
    const datosHora = await resHora.json();

    const zonaHoraria = datosHora.timezone || datosUbicacion.timezone?.id || 'Local';
    const horaObtenida =
      datosHora.current?.time ||
      datosUbicacion.timezone?.current_time ||
      new Date().toISOString();

    console.log('\n--- HORA OBTENIDA DE LA API ---');
    console.log(`Zona horaria: ${zonaHoraria}`);
    console.log(`Hora actual: ${horaObtenida}`);

    // 3. Conectar con la base de datos Registro en MySQL y guardar con INSERT INTO
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'TU_NUEVA_CONTRASEÑA',
      database: 'Registro'
    });

    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con Registro:', err.message);
        return;
      }
      console.log('\nConexión exitosa a la base de datos Registro.');

      const sql = 'INSERT INTO horas (latitud, longitud, hora) VALUES (?, ?, ?)';
      connection.query(sql, [latitud, longitud, horaObtenida], (error, results) => {
        if (error) {
          console.error('Error al insertar datos:', error.message);
          connection.end();
          return;
        }
        console.log('Registro guardado en MySQL. ID:', results.insertId);

        connection.query('SELECT * FROM horas', (errSel, rows) => {
          if (!errSel) {
            console.log('\n--- TABLA horas EN MYSQL ---');
            console.table(rows);
          }
          connection.end();
        });
      });
    });
  } catch (error) {
    console.error('Error en el proceso:', error.message);
  }
}

ejecutarRegistro();