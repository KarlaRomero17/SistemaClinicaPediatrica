const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//configuraciones a servidor http
app.use(bodyParser.json());
app.use(cors());
// importar dotenv para variables de entorno
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos MongoDB'))
.catch(err => console.error('Error al conectar a la base de datos MongoDB:', err));

// Rutas para auth
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas para paciente
const pacienteRoutes = require('./routes/paciente');
app.use('/api/pacientes', pacienteRoutes); 

// Rutas para citas
const citaRoutes = require('./routes/cita');
app.use('/api/citas', citaRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
