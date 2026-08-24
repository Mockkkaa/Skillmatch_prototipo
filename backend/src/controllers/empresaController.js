const pool = require('../config/database');

/** GET /api/empresas */
const getEmpresas = async (req, res, next) => {
  try {
    const { estado, busqueda } = req.query;
    let where = [];
    const params = [];

    if (estado) { where.push('e.estado = ?'); params.push(estado); }
    if (busqueda) { where.push('(e.razon_social LIKE ? OR e.nit LIKE ?)'); params.push(`%${busqueda}%`, `%${busqueda}%`); }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [rows] = await pool.query(
      `SELECT e.id, e.razon_social, e.nit, e.correo_empresa, e.ciudad, e.sector, e.estado, e.created_at,
              u.correo, u.nombre, u.apellido
       FROM empresas e JOIN usuarios u ON e.usuario_id = u.id
       ${whereClause}
       ORDER BY e.created_at DESC`,
      params
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/** GET /api/empresas/:id */
const getEmpresaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT e.*, u.correo, u.nombre, u.apellido FROM empresas e JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/** POST /api/empresas - Registrar empresa */
const createEmpresa = async (req, res, next) => {
  try {
    const { nombre, apellido, correo, contrasena, razon_social, nit, telefono, direccion, ciudad, descripcion, sector, sitio_web, correo_empresa } = req.body;

    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Check unique correo/nit
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existing.length) return res.status(409).json({ success: false, message: 'El correo ya está registrado.' });
    const [existingNit] = await pool.query('SELECT id FROM empresas WHERE nit = ?', [nit]);
    if (existingNit.length) return res.status(409).json({ success: false, message: 'El NIT ya está registrado.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const [roles] = await pool.query("SELECT id FROM roles WHERE nombre = 'EMPRESA'");

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [userResult] = await conn.query(
        'INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre || razon_social, apellido || 'Empresa', correo, hashedPassword, nit, telefono || null, ciudad || null, roles[0].id]
      );

      const [empResult] = await conn.query(
        'INSERT INTO empresas (usuario_id, razon_social, nit, correo_empresa, telefono, direccion, ciudad, descripcion, sector, sitio_web) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userResult.insertId, razon_social, nit, correo_empresa || correo, telefono || null, direccion || null, ciudad || null, descripcion || null, sector || null, sitio_web || null]
      );

      await conn.commit();

      const token = jwt.sign({ id: userResult.insertId, rol: 'EMPRESA' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      res.status(201).json({
        success: true,
        message: 'Empresa registrada correctamente. Tu cuenta está pendiente de aprobación.',
        token,
        user: { id: userResult.insertId, nombre: razon_social, correo, rol: 'EMPRESA', empresa_id: empResult.insertId, empresa_estado: 'PENDIENTE' },
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    next(error);
  }
};

/** PUT /api/empresas/:id */
const updateEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { razon_social, telefono, direccion, ciudad, descripcion, sector, sitio_web, correo_empresa } = req.body;

    const [emp] = await pool.query('SELECT usuario_id FROM empresas WHERE id = ?', [id]);
    if (!emp.length) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    if (req.user.rol !== 'ADMINISTRADOR' && emp[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta empresa' });
    }

    await pool.query(
      'UPDATE empresas SET razon_social=?, telefono=?, direccion=?, ciudad=?, descripcion=?, sector=?, sitio_web=?, correo_empresa=? WHERE id=?',
      [razon_social, telefono || null, direccion || null, ciudad || null, descripcion || null, sector || null, sitio_web || null, correo_empresa || null, id]
    );

    res.json({ success: true, message: 'Información empresarial actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/empresas/:id/aprobar */
const aprobarEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query(
      "UPDATE empresas SET estado='APROBADA', aprobado_por=?, fecha_aprobacion=NOW(), motivo_rechazo=NULL WHERE id=?",
      [req.user.id, id]
    );
    res.json({ success: true, message: 'Empresa aprobada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/empresas/:id/rechazar */
const rechazarEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    await pool.query(
      "UPDATE empresas SET estado='RECHAZADA', motivo_rechazo=? WHERE id=?",
      [motivo || null, id]
    );
    res.json({ success: true, message: 'Empresa rechazada.' });
  } catch (error) {
    next(error);
  }
};

/** GET /api/empresas/mi-empresa - Empresa del usuario autenticado */
const getMiEmpresa = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.* FROM empresas e WHERE e.usuario_id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'No tienes un perfil empresarial registrado' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmpresas, getEmpresaById, createEmpresa, updateEmpresa, aprobarEmpresa, rechazarEmpresa, getMiEmpresa };
