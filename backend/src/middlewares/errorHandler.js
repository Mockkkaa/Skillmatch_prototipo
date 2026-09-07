const multer = require('multer');

/**
 * Middleware global de manejo de errores
 * Compatible con Express 5.x y Multer 2.x
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message || err);

  // ── Multer 2.x errors ────────────────────────────────────────────
  if (err instanceof multer.MulterError) {
    const multerMessages = {
      LIMIT_FILE_SIZE:      'El archivo es demasiado grande. Máximo 5MB.',
      LIMIT_FILE_COUNT:     'Solo se permite subir un archivo a la vez.',
      LIMIT_UNEXPECTED_FILE: err.message || 'Tipo de archivo no permitido.',
      LIMIT_FIELD_KEY:      'Nombre de campo demasiado largo.',
      LIMIT_FIELD_VALUE:    'Valor de campo demasiado largo.',
      LIMIT_PART_COUNT:     'Demasiadas partes en la solicitud.',
    };
    return res.status(400).json({
      success: false,
      message: multerMessages[err.code] || `Error al subir archivo: ${err.code}`,
    });
  }

  // Errores de tipo de archivo (fileFilter custom)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'El archivo es demasiado grande. Máximo 5MB.' });
  }

  // ── MySQL errors ─────────────────────────────────────────────────
  if (err.code === 'ER_DUP_ENTRY') {
    const msg = err.message || '';
    const field = msg.includes('correo')   ? 'correo'    :
                  msg.includes('documento') ? 'documento' :
                  msg.includes('nit')       ? 'NIT'       : 'campo';
    return res.status(409).json({
      success: false,
      message: `El ${field} ya está registrado en el sistema.`,
    });
  }

  // MySQL charset / collation errors
  if (err.code === 'ER_WRONG_VALUE_FOR_VAR' || err.code === 'ER_UNKNOWN_CHARACTER_SET') {
    return res.status(500).json({
      success: false,
      message: 'Error de configuración de charset en la base de datos.',
    });
  }

  // ── Validation errors (express-validator) ────────────────────────
  if (err.type === 'validation') {
    return res.status(400).json({ success: false, message: err.message, errors: err.errors });
  }

  // ── Express 5.x: route not found throws with status 404 ─────────
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({ success: false, message });
};

/**
 * Middleware para rutas no encontradas (Express 5 compatible)
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
