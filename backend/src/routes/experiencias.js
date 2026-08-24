const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getExperiencias, createExperiencia, updateExperiencia, deleteExperiencia, getHabilidades, createHabilidad, deleteHabilidad } = require('../controllers/experienciaController');

// Experiencias
router.get('/', authenticate, getExperiencias);
router.post('/', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), createExperiencia);
router.put('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), updateExperiencia);
router.delete('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), deleteExperiencia);

module.exports = router;
