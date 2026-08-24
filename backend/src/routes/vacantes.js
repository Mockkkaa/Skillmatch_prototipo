const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getVacantes, getVacanteById, createVacante, updateVacante, deleteVacante, getVacantesEmpresa } = require('../controllers/vacanteController');

// Public
router.get('/', getVacantes);
router.get('/mis-vacantes', authenticate, authorize('EMPRESA'), getVacantesEmpresa);
router.get('/:id', getVacanteById);

// Protected
router.post('/', authenticate, authorize('EMPRESA'), createVacante);
router.put('/:id', authenticate, authorize('EMPRESA', 'ADMINISTRADOR'), updateVacante);
router.delete('/:id', authenticate, authorize('EMPRESA', 'ADMINISTRADOR'), deleteVacante);

module.exports = router;
