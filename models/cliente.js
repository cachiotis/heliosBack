const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number },
    telefono: { type: Number },
    direccion: { type: String },
    descripcionCaso: { type: String },
    estado: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Cliente', clientSchema);
