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
    password: 'Diariosecreto1', //modificar
    database: 'TurnosDB', 
    port: 3306
});

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Diariosecreto1',
    database: 'TurnosDB',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error conectando a la BD:", err);
        return;
    }
    console.log("¡Conexión exitosa a la BD!");
    connection.release();
});

// Crear turno
app.post('/api/turnos', (req, res) => {
    const { nombre, fecha, horaInicio, horaFin, servicio } = req.body;
    const sql = 'INSERT INTO Turno (NombreCompletoCliente, fecha, HoraInicio, HoraFin, ServicioSeleccionado) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [nombre, fecha, horaInicio, horaFin, servicio], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al guardar el turno' });
        }
        res.status(201).json({ mensaje: 'Turno reservado con éxito' });
    });
});

// Obtener todos los turnos
app.get('/api/turnos', (req, res) => {
    pool.query('SELECT * FROM Turno', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener los turnos' });
        }
        res.json(results);
    });
});

// Eliminar un turno
app.delete('/api/turnos/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM Turno WHERE TurnoID = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar el turno' });
        }
        res.json({ mensaje: 'Turno eliminado correctamente' });
    });
});

// Editar fecha de un turno
app.put('/api/turnos/:id', (req, res) => {
    const { id } = req.params;
    const { nuevaFecha } = req.body;
    pool.query('UPDATE Turno SET fecha = ? WHERE TurnoID = ?', [nuevaFecha, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al modificar el turno' });
        }
        res.json({ mensaje: 'Fecha del turno modificada correctamente' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
