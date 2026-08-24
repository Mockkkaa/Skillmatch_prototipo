const pool = require('../config/database');

/** GET /api/experiencias */
const getExperiencias = async (req, res, next) => {
  try {
    const aprendizId = req.query.aprendiz_id;
    const [rows] = await pool.query(
      'SELECT * FROM experiencias_laborales WHERE aprendiz_id = ? ORDER BY fecha_inicio DESC',
      [aprendizId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/** POST /api/experiencias */
const createExperiencia = async (req, res, next) => {
  try {
    const { aprendiz_id, empresa, cargo, descripcion, fecha_inicio, fecha_fin, actualmente_trabaja } = req.body;
    await verifyOwnership(req, aprendiz_id);

    const [result] = await pool.query(
      'INSERT INTO experiencias_laborales (aprendiz_id, empresa, cargo, descripcion, fecha_inicio, fecha_fin, actualmente_trabaja) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [aprendiz_id, empresa, cargo, descripcion || null, fecha_inicio, fecha_fin || null, actualmente_trabaja ? 1 : 0]
    );

    res.status(201).json({ success: true, message: 'Experiencia laboral agregada correctamente.', id: result.insertId });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/experiencias/:id */
const updateExperiencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { empresa, cargo, descripcion, fecha_inicio, fecha_fin, actualmente_trabaja } = req.body;

    const [exp] = await pool.query('SELECT aprendiz_id FROM experiencias_laborales WHERE id = ?', [id]);
    if (!exp.length) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    await verifyOwnership(req, exp[0].aprendiz_id);

    await pool.query(
      'UPDATE experiencias_laborales SET empresa=?, cargo=?, descripcion=?, fecha_inicio=?, fecha_fin=?, actualmente_trabaja=? WHERE id=?',
      [empresa, cargo, descripcion || null, fecha_inicio, fecha_fin || null, actualmente_trabaja ? 1 : 0, id]
    );

    res.json({ success: true, message: 'Experiencia laboral actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/experiencias/:id */
const deleteExperiencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [exp] = await pool.query('SELECT aprendiz_id FROM experiencias_laborales WHERE id = ?', [id]);
    if (!exp.length) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    await verifyOwnership(req, exp[0].aprendiz_id);
    await pool.query('DELETE FROM experiencias_laborales WHERE id = ?', [id]);
    res.json({ success: true, message: 'Experiencia eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// ---- Habilidades ----
/** GET /api/habilidades */
const getHabilidades = async (req, res, next) => {
  try {
    const { aprendiz_id } = req.query;
    const [rows] = await pool.query('SELECT * FROM habilidades WHERE aprendiz_id = ?', [aprendiz_id]);
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

/** POST /api/habilidades */
const createHabilidad = async (req, res, next) => {
  try {
    const { aprendiz_id, nombre, nivel, tipo } = req.body;
    await verifyOwnership(req, aprendiz_id);
    const [r] = await pool.query(
      'INSERT INTO habilidades (aprendiz_id, nombre, nivel, tipo) VALUES (?, ?, ?, ?)',
      [aprendiz_id, nombre, nivel || 'INTERMEDIO', tipo || 'TECNICA']
    );
    res.status(201).json({ success: true, message: 'Habilidad agregada.', id: r.insertId });
  } catch (error) { next(error); }
};

/** DELETE /api/habilidades/:id */
const deleteHabilidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [h] = await pool.query('SELECT aprendiz_id FROM habilidades WHERE id = ?', [id]);
    if (!h.length) return res.status(404).json({ success: false, message: 'Habilidad no encontrada' });
    await verifyOwnership(req, h[0].aprendiz_id);
    await pool.query('DELETE FROM habilidades WHERE id = ?', [id]);
    res.json({ success: true, message: 'Habilidad eliminada.' });
  } catch (error) { next(error); }
};

async function verifyOwnership(req, aprendizId) {
  if (req.user.rol === 'ADMINISTRADOR') return;
  const [ap] = await pool.query('SELECT usuario_id FROM aprendices WHERE id = ?', [aprendizId]);
  if (!ap.length || ap[0].usuario_id !== req.user.id) {
    const err = new Error('No tienes permiso para modificar este registro');
    err.status = 403;
    throw err;
  }
}

module.exports = { getExperiencias, createExperiencia, updateExperiencia, deleteExperiencia, getHabilidades, createHabilidad, deleteHabilidad };
