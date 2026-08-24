const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getHojaVida, getHojaVidaByAprendiz, updateHojaVida } = require('../controllers/hojaVidaController');

router.get('/aprendiz/:aprendizId', authenticate, getHojaVidaByAprendiz);
router.get('/:id', authenticate, getHojaVida);
router.put('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), updateHojaVida);

module.exports = router;
