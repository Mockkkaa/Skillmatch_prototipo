const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getEmpresas, getEmpresaById, createEmpresa, updateEmpresa, aprobarEmpresa, rechazarEmpresa, getMiEmpresa } = require('../controllers/empresaController');

// Public registration
router.post('/register', createEmpresa);

// Auth required
router.get('/mi-empresa', authenticate, authorize('EMPRESA'), getMiEmpresa);
router.get('/', authenticate, authorize('ADMINISTRADOR', 'FUNCIONARIO'), getEmpresas);
router.get('/:id', authenticate, getEmpresaById);
router.put('/:id', authenticate, authorize('EMPRESA', 'ADMINISTRADOR'), updateEmpresa);
router.put('/:id/aprobar', authenticate, authorize('ADMINISTRADOR'), aprobarEmpresa);
router.put('/:id/rechazar', authenticate, authorize('ADMINISTRADOR'), rechazarEmpresa);

module.exports = router;
