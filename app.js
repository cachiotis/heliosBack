require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/clientes');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://helios-front.vercel.app', // Reemplaza con la URL de tu frontend desplegado
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos que permites
    allowedHeaders: ['Content-Type', 'Authorization'], // IMPORTANTE: Incluye 'Authorization'
    credentials: true, // Si manejas cookies o sesiones a través de dominios
    optionsSuccessStatus: 200 // Para compatibilidad con navegadores más antiguos
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error conectando a MongoDB:', err));

app.use(express.json());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/api/login', require('./routes/auth')); // Tu ruta de login (basado en acceso.js)


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
