const pool = require('../config/database');

/** GET /api/users */
const getUsers = async (req, res, next) => {
  try {
    const { rol, activo, busqueda, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;
    let where = [];
    const params = [];

    if (rol) { where.push('r.nombre = ?'); params.push(rol); }
    if (activo !== undefined) { where.push('u.activo = ?'); params.push(activo === 'true' ? 1 : 0); }
    if (busqueda) { where.push('(u.nombre LIKE ? OR u.apellido LIKE ? OR u.correo LIKE ?)'); params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`); }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.correo, u.documento, u.ciudad, u.activo, u.created_at, r.nombre as rol
       FROM usuarios u JOIN roles r ON u.rol_id = r.id
       ${whereClause}
       ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limite), offset]
    );

    const [total] = await pool.query(`SELECT COUNT(*) as total FROM usuarios u JOIN roles r ON u.rol_id = r.id ${whereClause}`, params);

    res.json({ success: true, data: rows, pagination: { total: total[0].total, pagina: parseInt(pagina), limite: parseInt(limite), totalPaginas: Math.ceil(total[0].total / limite) } });
  } catch (error) {
    next(error);
  }
};

/** GET /api/users/:id */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT u.id, u.nombre, u.apellido, u.correo, u.documento, u.telefono, u.ciudad, u.activo, u.created_at, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/users/:id/activar */
const activarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE usuarios SET activo = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Usuario activado correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/users/:id/desactivar */
const desactivarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) return res.status(400).json({ success: false, message: 'No puedes desactivar tu propia cuenta.' });
    await pool.query('UPDATE usuarios SET activo = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Usuario desactivado correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** GET /api/programas */
const getProgramas = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM programas_formacion WHERE activo = 1 ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, activarUsuario, desactivarUsuario, getProgramas };
