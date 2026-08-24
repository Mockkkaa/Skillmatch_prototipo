const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getHabilidades, createHabilidad, deleteHabilidad } = require('../controllers/experienciaController');

router.get('/', authenticate, getHabilidades);
router.post('/', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), createHabilidad);
router.delete('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), deleteHabilidad);

module.exports = router;
