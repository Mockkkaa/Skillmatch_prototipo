const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Middleware de autenticación JWT
 * Verifica el token Bearer en el header Authorization
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario actualizado de BD
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.correo, u.activo,
              r.nombre as rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    if (!user.activo) {
      return res.status(401).json({ success: false, message: 'Tu cuenta está inactiva. Contacta al administrador.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesión expirada. Por favor inicia sesión nuevamente.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }
    next(error);
  }
};

/**
 * Middleware de autorización por rol
 * Uso: authorize('ADMINISTRADOR', 'FUNCIONARIO')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
