# Proyecto Final — Back End Nivel Intermedio

Implementación de bases de datos relacionales en **MySQL**, conexión local desde **Node.js** mediante **`mysql2`** y consumo de APIs externas en formato JSON.

## Tecnologías utilizadas
- **Base de datos:** MySQL 8.0 (MySQL Workbench)
- **Back end:** Node.js (JavaScript)
- **Conector:** `mysql2`
- **APIs externas (URL abiertas):** [IPWHOIS.io](https://ipwhois.io/) (geolocalización) y [Open-Meteo](https://open-meteo.com/) (hora por coordenadas)

## Estructura del proyecto
- `Untitled.sql` / `Untitled-1.mysql-notebook`: Creación de la base de datos `Libros` (`Autores` y `Libros` en relación 1:N) y carga de 40 registros por tabla.
- `Untitled-2.mysql-notebook`: Creación de la base de datos `Registro` y tabla `horas`.
- `avance3_libros.js`: Conexión local a MySQL y consultas `SELECT` (listado general con `INNER JOIN` y búsqueda específica por `id_libro`).
- `avance4_registro.js`: Consumo secuencial de APIs de ubicación y hora con `fetch`, y almacenamiento en MySQL con `INSERT INTO`.
- `Proyecto_Final_Back_End_Intermedio.docx`: Documentación completa con diagramas, justificación técnica, capturas numeradas y conclusiones.

## Instalación y ejecución local
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AK2327-Byte/Proyecto-final-Backend-Intermedio.git
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar los scripts SQL en MySQL Workbench para crear las bases `Libros` y `Registro`.
4. Configurar tu contraseña local de MySQL en `avance3_libros.js` y `avance4_registro.js`.
5. Ejecutar los scripts desde la terminal:
   ```bash
   node avance3_libros.js
   node avance4_registro.js
   ```

## Buenas prácticas aplicadas
- **Protección de credenciales:** Exclusión de `node_modules/` mediante `.gitignore` y reemplazo de contraseñas reales antes de publicar.
- **Consultas seguras y eficientes:** Uso de consultas parametrizadas (`?`), `INNER JOIN` para evitar múltiples peticiones a la base de datos y cierre explícito de conexiones (`connection.end()`).
