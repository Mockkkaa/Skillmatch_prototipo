const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { getAprendiz, updateAprendiz, uploadFoto } = require('../controllers/aprendizController');
const upload = require('../config/multer');

router.get('/:id', authenticate, getAprendiz);
router.put('/:id', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), updateAprendiz);
router.post('/:id/foto', authenticate, authorize('APRENDIZ', 'ADMINISTRADOR'), upload.single('foto'), uploadFoto);

module.exports = router;
