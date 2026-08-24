/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'El archivo es demasiado grande. Máximo 5MB.' });
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.message.includes('correo') ? 'correo' :
                  err.message.includes('documento') ? 'documento' :
                  err.message.includes('nit') ? 'NIT' : 'campo';
    return res.status(409).json({ success: false, message: `El ${field} ya está registrado en el sistema.` });
  }

  // Validation errors (express-validator)
  if (err.type === 'validation') {
    return res.status(400).json({ success: false, message: err.message, errors: err.errors });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({ success: false, message });
};

/**
 * Middleware para rutas no encontradas
 */
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
