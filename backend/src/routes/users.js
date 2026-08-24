const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getUsers, getUserById, activarUsuario, desactivarUsuario, getProgramas } = require('../controllers/userController');

router.get('/', authenticate, authorize('ADMINISTRADOR', 'FUNCIONARIO'), getUsers);
router.get('/programas', getProgramas); // Public - for registration forms
router.get('/:id', authenticate, authorize('ADMINISTRADOR', 'FUNCIONARIO'), getUserById);
router.put('/:id/activar', authenticate, authorize('ADMINISTRADOR'), activarUsuario);
router.put('/:id/desactivar', authenticate, authorize('ADMINISTRADOR'), desactivarUsuario);

module.exports = router;
