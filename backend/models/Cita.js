const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente', 
    required: true
  },
  profesional: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  notas: {
    type: String,
    default: ''
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cita', citaSchema);
