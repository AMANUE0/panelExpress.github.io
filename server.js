// Importar dependencias
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

// Inicializar la app
const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('admin_panel.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos', err);
    } else {
        console.log('Conectado a SQLite');
        db.run(`CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT
        )`);
    }
});

// Ruta para obtener el contenido
app.get('/content', (req, res) => {
    db.get('SELECT * FROM content WHERE id = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(row || { title: '', description: '' });
        }
    });
});

// Ruta para actualizar el contenido
app.post('/content', (req, res) => {
    const { title, description } = req.body;
    db.run('INSERT INTO content (id, title, description) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description', 
    [title, description],
    (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Contenido actualizado' });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});