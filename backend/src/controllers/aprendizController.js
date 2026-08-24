const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/aprendices/:id
 */
const getAprendiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.id as usuario_id, u.nombre, u.apellido, u.correo, u.documento, u.telefono, u.ciudad, u.foto_perfil,
              a.id as aprendiz_id, a.numero_ficha, a.nivel_formacion, a.perfil_profesional,
              a.fecha_inicio_formacion, a.fecha_fin_formacion, a.estado_formacion,
              p.id as programa_id, p.nombre as programa, p.area
       FROM usuarios u
       JOIN aprendices a ON u.id = a.usuario_id
       LEFT JOIN programas_formacion p ON a.programa_formacion_id = p.id
       WHERE a.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Aprendiz no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/aprendices/:id
 */
const updateAprendiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, ciudad, programa_formacion_id, numero_ficha, nivel_formacion, perfil_profesional, fecha_inicio_formacion, fecha_fin_formacion } = req.body;

    // Verify ownership or admin
    const [ap] = await pool.query('SELECT usuario_id FROM aprendices WHERE id = ?', [id]);
    if (!ap.length) return res.status(404).json({ success: false, message: 'Aprendiz no encontrado' });
    if (req.user.rol !== 'ADMINISTRADOR' && ap[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar este perfil' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        'UPDATE usuarios SET nombre=?, apellido=?, telefono=?, ciudad=? WHERE id=?',
        [nombre, apellido, telefono || null, ciudad || null, ap[0].usuario_id]
      );

      await conn.query(
        'UPDATE aprendices SET programa_formacion_id=?, numero_ficha=?, nivel_formacion=?, perfil_profesional=?, fecha_inicio_formacion=?, fecha_fin_formacion=? WHERE id=?',
        [programa_formacion_id || null, numero_ficha || null, nivel_formacion || null, perfil_profesional || null, fecha_inicio_formacion || null, fecha_fin_formacion || null, id]
      );

      // Recalculate profile completion
      await updateProfileCompletion(conn, parseInt(id));

      await conn.commit();
      res.json({ success: true, message: 'Perfil actualizado correctamente.' });
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

/**
 * POST /api/aprendices/:id/foto
 */
const uploadFoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });

    const { id } = req.params;
    const [ap] = await pool.query('SELECT usuario_id FROM aprendices WHERE id = ?', [id]);
    if (!ap.length) return res.status(404).json({ success: false, message: 'Aprendiz no encontrado' });
    if (req.user.rol !== 'ADMINISTRADOR' && ap[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso' });
    }

    // Delete old photo if exists
    const [user] = await pool.query('SELECT foto_perfil FROM usuarios WHERE id = ?', [ap[0].usuario_id]);
    if (user[0]?.foto_perfil) {
      const oldPath = path.join(process.cwd(), user[0].foto_perfil);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const fotoUrl = `/uploads/photos/${req.file.filename}`;
    await pool.query('UPDATE usuarios SET foto_perfil = ? WHERE id = ?', [fotoUrl, ap[0].usuario_id]);

    res.json({ success: true, message: 'Foto de perfil actualizada.', foto_perfil: fotoUrl });
  } catch (error) {
    next(error);
  }
};

// Helper: recalculate profile completion percentage
async function updateProfileCompletion(conn, aprendizId) {
  const [ap] = await conn.query(
    `SELECT a.perfil_profesional, a.numero_ficha, u.telefono, u.ciudad, u.foto_perfil
     FROM aprendices a JOIN usuarios u ON a.usuario_id = u.id WHERE a.id = ?`,
    [aprendizId]
  );
  const [form] = await conn.query('SELECT COUNT(*) as cnt FROM formacion_academica WHERE aprendiz_id = ?', [aprendizId]);
  const [exp] = await conn.query('SELECT COUNT(*) as cnt FROM experiencias_laborales WHERE aprendiz_id = ?', [aprendizId]);
  const [hab] = await conn.query('SELECT COUNT(*) as cnt FROM habilidades WHERE aprendiz_id = ?', [aprendizId]);

  let score = 20; // base
  if (ap[0]?.perfil_profesional) score += 15;
  if (ap[0]?.numero_ficha) score += 10;
  if (ap[0]?.telefono) score += 5;
  if (ap[0]?.ciudad) score += 5;
  if (ap[0]?.foto_perfil) score += 10;
  if (form[0].cnt > 0) score += 15;
  if (exp[0].cnt > 0) score += 10;
  if (hab[0].cnt > 0) score += 10;

  await conn.query('UPDATE hojas_vida SET porcentaje_completado = ? WHERE aprendiz_id = ?', [Math.min(score, 100), aprendizId]);
}

module.exports = { getAprendiz, updateAprendiz, uploadFoto };
