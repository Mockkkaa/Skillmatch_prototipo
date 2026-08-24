const pool = require('../config/database');

/** GET /api/formacion */
const getFormacion = async (req, res, next) => {
  try {
    const aprendizId = req.query.aprendiz_id || req.user.aprendiz_id;
    const [rows] = await pool.query(
      'SELECT * FROM formacion_academica WHERE aprendiz_id = ? ORDER BY fecha_inicio DESC',
      [aprendizId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/** POST /api/formacion */
const createFormacion = async (req, res, next) => {
  try {
    const { aprendiz_id, institucion, programa, nivel, fecha_inicio, fecha_fin, actualmente_cursando, estado } = req.body;

    // Verify ownership
    await verifyAprendizOwnership(req, aprendiz_id);

    const [result] = await pool.query(
      'INSERT INTO formacion_academica (aprendiz_id, institucion, programa, nivel, fecha_inicio, fecha_fin, actualmente_cursando, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [aprendiz_id, institucion, programa, nivel, fecha_inicio, fecha_fin || null, actualmente_cursando ? 1 : 0, estado || 'EN_CURSO']
    );

    res.status(201).json({
      success: true,
      message: 'Formación académica agregada correctamente.',
      id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/formacion/:id */
const updateFormacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { institucion, programa, nivel, fecha_inicio, fecha_fin, actualmente_cursando, estado } = req.body;

    const [form] = await pool.query('SELECT aprendiz_id FROM formacion_academica WHERE id = ?', [id]);
    if (!form.length) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    await verifyAprendizOwnership(req, form[0].aprendiz_id);

    await pool.query(
      'UPDATE formacion_academica SET institucion=?, programa=?, nivel=?, fecha_inicio=?, fecha_fin=?, actualmente_cursando=?, estado=? WHERE id=?',
      [institucion, programa, nivel, fecha_inicio, fecha_fin || null, actualmente_cursando ? 1 : 0, estado, id]
    );

    res.json({ success: true, message: 'Formación académica actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/formacion/:id */
const deleteFormacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [form] = await pool.query('SELECT aprendiz_id FROM formacion_academica WHERE id = ?', [id]);
    if (!form.length) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    await verifyAprendizOwnership(req, form[0].aprendiz_id);

    await pool.query('DELETE FROM formacion_academica WHERE id = ?', [id]);
    res.json({ success: true, message: 'Formación eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

async function verifyAprendizOwnership(req, aprendizId) {
  if (req.user.rol === 'ADMINISTRADOR') return;
  const [ap] = await pool.query('SELECT usuario_id FROM aprendices WHERE id = ?', [aprendizId]);
  if (!ap.length || ap[0].usuario_id !== req.user.id) {
    const err = new Error('No tienes permiso para modificar este registro');
    err.status = 403;
    throw err;
  }
}

module.exports = { getFormacion, createFormacion, updateFormacion, deleteFormacion };
