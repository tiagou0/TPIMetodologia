const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//db config
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '-', //modificar
    database: 'sistema_turnos', 
    port: 3306
});

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gervispo33',
    database: 'sistema_turnos',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connection.connect((err) => {
    if(err){
        console.error("Error conectando a la bd: ", err);
        return;
    }
    console.log("Coneccion exitosa a la BD!")
});


app.get('/clientes', (req, res) => {
    const query = `
      SELECT cliente.cliente_id, nombre, apellido, email, telefono
      FROM cliente
      LEFT JOIN telefono ON cliente.cliente_id = telefono.cliente_id
      ORDER BY cliente.cliente_id
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error('Error al consultar clientes:', err);
        res.status(500).json({ error: 'Error al obtener datos de clientes' });
      } else {
        res.json(results);
      }
    });
  });


  app.post('/registrar', (req, res) => {
    const { nombre, apellido, email, contraseña, telefono } = req.body;
  
    if (!nombre || !apellido || !email || !contraseña || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
  
    const queryCliente = 'INSERT INTO cliente (nombre, apellido, email, contraseña) VALUES (?, ?, ?, ?)';
    const queryTelefono = 'INSERT INTO telefono (cliente_id, telefono) VALUES (?, ?)';
  
    pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });
  
      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return res.status(500).json({ error: 'Error al iniciar la transacción' });
        }
  
        connection.query(queryCliente, [nombre, apellido, email, contraseña], (err, result) => {
          if (err) {
            connection.rollback(() => connection.release());
            return res.status(500).json({ error: 'Error al registrar cliente' });
          }
  
          const clienteId = result.insertId;
  
          connection.query(queryTelefono, [clienteId, telefono], (err) => {
            if (err) {
              connection.rollback(() => connection.release());
              return res.status(500).json({ error: 'Error al registrar teléfono' });
            }
  
            connection.commit((err) => {
              if (err) {
                connection.rollback(() => connection.release());
                return res.status(500).json({ error: 'Error al confirmar transacción' });
              }
  
              connection.release();
              res.json({ mensaje: 'Cliente registrado correctamente' });
            });
          });
        });
      });
    });
  });
  

  
  
  
  // Arrancar el servidor
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
  });

