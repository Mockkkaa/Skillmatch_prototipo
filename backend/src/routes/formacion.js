const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getFormacion, createFormacion, updateFormacion, deleteFormacion } = require('../controllers/formacionController');

router.get('/', authenticate, getFormacion);
router.post('/', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), createFormacion);
router.put('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), updateFormacion);
router.delete('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), deleteFormacion);

module.exports = router;
