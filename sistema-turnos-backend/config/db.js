
// Carga el módulo mysql2 y dotenv para usar variables de entorno
const mysql = require('mysql2');
require('dotenv').config();

// Crea la conexión usando variables del archivo .env
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Se conecta a la base de datos y muestra si tuvo éxito o no
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
