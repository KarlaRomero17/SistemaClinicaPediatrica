const express = require('express');
const router = express.Router();
const { getCitas, addCita, updateCita, deleteCita } = require('../controllers/citaController');

// Rutas de citas
router.get('/', getCitas);
router.post('/', addCita);
router.put('/:id', updateCita);
router.delete('/:id', deleteCita);

module.exports = router;
