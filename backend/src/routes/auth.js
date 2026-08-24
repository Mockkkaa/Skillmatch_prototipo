const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

const registerValidations = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellido').trim().notEmpty().withMessage('El apellido es requerido'),
  body('correo').isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('contrasena').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('documento').trim().notEmpty().withMessage('El documento es requerido'),
];

const loginValidations = [
  body('correo').isEmail().withMessage('Correo electrónico inválido'),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
];

router.post('/register', registerValidations, register);
router.post('/login', loginValidations, login);
router.get('/me', authenticate, me);

module.exports = router;
