const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getPostulaciones, createPostulacion, updatePostulacion } = require('../controllers/postulacionController');

router.get('/', authenticate, getPostulaciones);
router.post('/', authenticate, authorize('APRENDIZ'), createPostulacion);
router.put('/:id', authenticate, authorize('EMPRESA', 'ADMINISTRADOR'), updatePostulacion);

module.exports = router;
