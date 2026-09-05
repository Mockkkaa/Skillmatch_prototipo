const pool = require('../config/database');

/** Helper para crear notificaciones internas en el sistema */
const createNotification = async ({ usuario_id, tipo = 'INFO', titulo, mensaje, enlace = null }) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, enlace) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, tipo, titulo, mensaje, enlace]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    return null;
  }
};

/** GET /api/notificaciones - Obtiene las notificaciones del usuario autenticado */
const getNotificaciones = async (req, res, next) => {
  try {
    const usuario_id = req.user.id;
    const [notificaciones] = await pool.query(
      'SELECT id, tipo, titulo, mensaje, enlace, leida, created_at FROM notificaciones WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 30',
      [usuario_id]
    );

    const [unreadCountResult] = await pool.query(
      'SELECT COUNT(*) as unread_count FROM notificaciones WHERE usuario_id = ? AND leida = 0',
      [usuario_id]
    );

    res.json({
      success: true,
      data: notificaciones,
      unread_count: unreadCountResult[0]?.unread_count || 0
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/notificaciones/:id/leer - Marcar una notificación individual como leída */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const [result] = await pool.query(
      'UPDATE notificaciones SET leida = 1 WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }

    res.json({ success: true, message: 'Notificación marcada como leída' });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/notificaciones/leer-todas - Marcar todas como leídas */
const markAllAsRead = async (req, res, next) => {
  try {
    const usuario_id = req.user.id;

    await pool.query(
      'UPDATE notificaciones SET leida = 1 WHERE usuario_id = ? AND leida = 0',
      [usuario_id]
    );

    res.json({ success: true, message: 'Todas las notificaciones fueron marcadas como leídas' });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/notificaciones/:id - Eliminar una notificación */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const [result] = await pool.query(
      'DELETE FROM notificaciones WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }

    res.json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotificaciones,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
