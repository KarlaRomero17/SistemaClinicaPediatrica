const Cita = require('../models/Cita');

// Obtener todas las citas
exports.getCitas = async (req, res) => {
  try {
    const citas = await Cita.find().populate('pacienteId', 'nombre');
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva cita
exports.addCita = async (req, res) => {
  const { pacienteId, profesional, fecha, motivo, estado, notas } = req.body;

  if (!pacienteId) {
    return res.status(400).json({ message: 'El campo pacienteId es obligatorio.' });
  }

  try {
    const nuevaCita = new Cita({ pacienteId, profesional, fecha, motivo, estado, notas });
    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una cita
exports.updateCita = async (req, res) => {
  const { id } = req.params;
  const { pacienteId, profesional, fecha, motivo, estado, notas } = req.body;

  try {
    const cita = await Cita.findByIdAndUpdate(
      id,
      { pacienteId, profesional, fecha, motivo, estado, notas }, // Incluir pacienteId
      { new: true }
    );
    if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una cita
exports.deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    await Cita.findByIdAndDelete(id);
    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
