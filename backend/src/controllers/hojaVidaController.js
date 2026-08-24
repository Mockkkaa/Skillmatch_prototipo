const pool = require('../config/database');

/** GET /api/hojas-vida/:id */
const getHojaVida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [hv] = await pool.query(
      `SELECT hv.*, a.id as aprendiz_id, u.nombre, u.apellido, u.correo, u.telefono, u.ciudad, u.foto_perfil, u.documento,
              a.perfil_profesional, a.nivel_formacion, a.numero_ficha, a.estado_formacion,
              p.nombre as programa
       FROM hojas_vida hv
       JOIN aprendices a ON hv.aprendiz_id = a.id
       JOIN usuarios u ON a.usuario_id = u.id
       LEFT JOIN programas_formacion p ON a.programa_formacion_id = p.id
       WHERE hv.id = ?`,
      [id]
    );
    if (!hv.length) return res.status(404).json({ success: false, message: 'Hoja de vida no encontrada' });

    const aprendizId = hv[0].aprendiz_id;

    const [formacion] = await pool.query('SELECT * FROM formacion_academica WHERE aprendiz_id = ? ORDER BY fecha_inicio DESC', [aprendizId]);
    const [experiencias] = await pool.query('SELECT * FROM experiencias_laborales WHERE aprendiz_id = ? ORDER BY fecha_inicio DESC', [aprendizId]);
    const [habilidades] = await pool.query('SELECT * FROM habilidades WHERE aprendiz_id = ?', [aprendizId]);
    const [certificaciones] = await pool.query('SELECT * FROM certificaciones WHERE aprendiz_id = ? ORDER BY fecha_obtencion DESC', [aprendizId]);

    res.json({
      success: true,
      data: {
        ...hv[0],
        formacion,
        experiencias,
        habilidades,
        certificaciones,
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/hojas-vida/aprendiz/:aprendizId */
const getHojaVidaByAprendiz = async (req, res, next) => {
  try {
    const { aprendizId } = req.params;
    const [hv] = await pool.query('SELECT * FROM hojas_vida WHERE aprendiz_id = ?', [aprendizId]);
    if (!hv.length) return res.status(404).json({ success: false, message: 'Hoja de vida no encontrada' });
    req.params.id = hv[0].id;
    return getHojaVida(req, res, next);
  } catch (error) {
    next(error);
  }
};

/** PUT /api/hojas-vida/:id */
const updateHojaVida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { objetivo_profesional, disponibilidad, modalidad_preferida, salario_esperado, visible } = req.body;

    const [hv] = await pool.query(
      'SELECT hv.id, a.usuario_id FROM hojas_vida hv JOIN aprendices a ON hv.aprendiz_id = a.id WHERE hv.id = ?',
      [id]
    );
    if (!hv.length) return res.status(404).json({ success: false, message: 'Hoja de vida no encontrada' });
    if (req.user.rol !== 'ADMINISTRADOR' && hv[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta hoja de vida' });
    }

    await pool.query(
      'UPDATE hojas_vida SET objetivo_profesional=?, disponibilidad=?, modalidad_preferida=?, salario_esperado=?, visible=? WHERE id=?',
      [objetivo_profesional || null, disponibilidad || 'INMEDIATA', modalidad_preferida || 'INDIFERENTE', salario_esperado || null, visible ?? 1, id]
    );

    res.json({ success: true, message: 'Hoja de vida actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHojaVida, getHojaVidaByAprendiz, updateHojaVida };
