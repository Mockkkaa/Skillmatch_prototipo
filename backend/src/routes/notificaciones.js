const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  getNotificaciones,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificacionController');

// Todas las rutas de notificaciones requieren estar autenticado
router.use(authenticate);

router.get('/', getNotificaciones);
router.patch('/leer-todas', markAllAsRead);
router.patch('/:id/leer', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
