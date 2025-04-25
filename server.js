const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'gervispo33', // Cambiar en producción
    database: 'TurnosDB',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error conectando a la BD:", err);
        return;
    }
    console.log("¡Conexión exitosa a la BD!");
    connection.release();
});

// Crear un turno
app.post('/api/turnos', (req, res) => {
    const { nombre, fecha, horaInicio, horaFin, servicio } = req.body;

    if (!nombre || !fecha || !horaInicio || !horaFin || !servicio) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const sql = 'INSERT INTO Turno (NombreCompletoCliente, fecha, HoraInicio, HoraFin, ServicioSeleccionado) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [nombre, fecha, horaInicio, horaFin, servicio], (err, result) => {
        if (err) {
            console.error("Error al crear turno:", err);
            return res.status(500).json({ error: 'Error al guardar el turno' });
        }
        res.status(201).json({ mensaje: 'Turno reservado con éxito' });
    });
});

// Obtener todos los turnos
app.get('/api/turnos', (req, res) => {
    pool.query('SELECT * FROM Turno', (err, results) => {
        if (err) {
            console.error("Error al obtener turnos:", err);
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
            console.error("Error al eliminar turno:", err);
            return res.status(500).json({ error: 'Error al eliminar el turno' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        res.json({ mensaje: 'Turno eliminado correctamente' });
    });
});

// Editar fecha de un turno
app.put('/api/turnos/:id', (req, res) => {
    const { id } = req.params;
    const { nuevaFecha } = req.body;

    if (!nuevaFecha) {
        return res.status(400).json({ error: 'La nueva fecha es obligatoria' });
    }

    pool.query('UPDATE Turno SET fecha = ? WHERE TurnoID = ?', [nuevaFecha, id], (err, result) => {
        if (err) {
            console.error("Error al modificar turno:", err);
            return res.status(500).json({ error: 'Error al modificar el turno' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        res.json({ mensaje: 'Fecha del turno modificada correctamente' });
    });
});

// Levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
