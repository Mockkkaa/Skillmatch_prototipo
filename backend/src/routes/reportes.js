const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getReportes } = require('../controllers/reporteController');

router.get('/', authenticate, authorize('ADMINISTRADOR', 'FUNCIONARIO'), getReportes);

module.exports = router;
