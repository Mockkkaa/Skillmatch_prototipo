const pool = require('../config/database');

/** GET /api/vacantes - Listado con filtros */
const getVacantes = async (req, res, next) => {
  try {
    const { busqueda, ubicacion, modalidad, tipo_contrato, area, programa_id, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;

    let where = ["v.estado = 'PUBLICADA'", "e.estado = 'APROBADA'"];
    const params = [];

    if (busqueda) {
      where.push('(v.cargo LIKE ? OR v.descripcion LIKE ? OR e.razon_social LIKE ?)');
      params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
    }
    if (ubicacion) { where.push('v.ubicacion LIKE ?'); params.push(`%${ubicacion}%`); }
    if (modalidad) { where.push('v.modalidad = ?'); params.push(modalidad); }
    if (tipo_contrato) { where.push('v.tipo_contrato = ?'); params.push(tipo_contrato); }
    if (area) { where.push('v.area LIKE ?'); params.push(`%${area}%`); }
    if (programa_id) { where.push('v.programa_formacion_id = ?'); params.push(programa_id); }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [vacantes] = await pool.query(
      `SELECT v.id, v.cargo, v.ubicacion, v.modalidad, v.tipo_contrato, v.salario_min, v.salario_max,
              v.salario_negociable, v.fecha_limite, v.area, v.estado, v.created_at,
              e.razon_social as empresa, e.ciudad as empresa_ciudad, e.logo as empresa_logo
       FROM vacantes v
       JOIN empresas e ON v.empresa_id = e.id
       ${whereClause}
       ORDER BY v.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limite), offset]
    );

    const [total] = await pool.query(
      `SELECT COUNT(*) as total FROM vacantes v JOIN empresas e ON v.empresa_id = e.id ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: vacantes,
      pagination: {
        total: total[0].total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total[0].total / limite),
      },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/vacantes/:id */
const getVacanteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT v.*, e.razon_social as empresa, e.ciudad as empresa_ciudad, e.logo as empresa_logo,
              e.descripcion as empresa_descripcion, e.sector as empresa_sector, e.sitio_web,
              p.nombre as programa_nombre
       FROM vacantes v
       JOIN empresas e ON v.empresa_id = e.id
       LEFT JOIN programas_formacion p ON v.programa_formacion_id = p.id
       WHERE v.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Vacante no encontrada' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/** POST /api/vacantes - Empresa crea vacante */
const createVacante = async (req, res, next) => {
  try {
    const { cargo, descripcion, requisitos, habilidades_requeridas, ubicacion, modalidad, tipo_contrato, salario_min, salario_max, salario_negociable, fecha_limite, programa_formacion_id, area, estado } = req.body;

    // Get empresa_id from user
    const [emp] = await pool.query('SELECT id, estado FROM empresas WHERE usuario_id = ?', [req.user.id]);
    if (!emp.length) return res.status(403).json({ success: false, message: 'No tienes un perfil empresarial registrado' });
    if (emp[0].estado !== 'APROBADA') return res.status(403).json({ success: false, message: 'Tu empresa debe estar aprobada para publicar vacantes.' });

    const [result] = await pool.query(
      'INSERT INTO vacantes (empresa_id, cargo, descripcion, requisitos, habilidades_requeridas, ubicacion, modalidad, tipo_contrato, salario_min, salario_max, salario_negociable, fecha_limite, programa_formacion_id, area, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [emp[0].id, cargo, descripcion, requisitos || null, habilidades_requeridas || null, ubicacion || null, modalidad || 'PRESENCIAL', tipo_contrato || 'APRENDIZAJE', salario_min || null, salario_max || null, salario_negociable ? 1 : 0, fecha_limite || null, programa_formacion_id || null, area || null, estado || 'BORRADOR']
    );

    res.status(201).json({ success: true, message: 'Vacante creada correctamente.', id: result.insertId });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/vacantes/:id */
const updateVacante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cargo, descripcion, requisitos, habilidades_requeridas, ubicacion, modalidad, tipo_contrato, salario_min, salario_max, salario_negociable, fecha_limite, programa_formacion_id, area, estado } = req.body;

    const [vac] = await pool.query('SELECT v.empresa_id, e.usuario_id FROM vacantes v JOIN empresas e ON v.empresa_id = e.id WHERE v.id = ?', [id]);
    if (!vac.length) return res.status(404).json({ success: false, message: 'Vacante no encontrada' });
    if (req.user.rol !== 'ADMINISTRADOR' && vac[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta vacante' });
    }

    await pool.query(
      'UPDATE vacantes SET cargo=?, descripcion=?, requisitos=?, habilidades_requeridas=?, ubicacion=?, modalidad=?, tipo_contrato=?, salario_min=?, salario_max=?, salario_negociable=?, fecha_limite=?, programa_formacion_id=?, area=?, estado=? WHERE id=?',
      [cargo, descripcion, requisitos || null, habilidades_requeridas || null, ubicacion || null, modalidad, tipo_contrato, salario_min || null, salario_max || null, salario_negociable ? 1 : 0, fecha_limite || null, programa_formacion_id || null, area || null, estado, id]
    );

    res.json({ success: true, message: 'Vacante actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/vacantes/:id */
const deleteVacante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [vac] = await pool.query('SELECT v.empresa_id, e.usuario_id FROM vacantes v JOIN empresas e ON v.empresa_id = e.id WHERE v.id = ?', [id]);
    if (!vac.length) return res.status(404).json({ success: false, message: 'Vacante no encontrada' });
    if (req.user.rol !== 'ADMINISTRADOR' && vac[0].usuario_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta vacante' });
    }
    await pool.query('DELETE FROM vacantes WHERE id = ?', [id]);
    res.json({ success: true, message: 'Vacante eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

/** GET /api/vacantes/empresa - Vacantes de la empresa autenticada */
const getVacantesEmpresa = async (req, res, next) => {
  try {
    const [emp] = await pool.query('SELECT id FROM empresas WHERE usuario_id = ?', [req.user.id]);
    if (!emp.length) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

    const [vacantes] = await pool.query(
      `SELECT v.*, 
              (SELECT COUNT(*) FROM postulaciones WHERE vacante_id = v.id) as total_postulaciones
       FROM vacantes v WHERE v.empresa_id = ? ORDER BY v.created_at DESC`,
      [emp[0].id]
    );

    res.json({ success: true, data: vacantes });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVacantes, getVacanteById, createVacante, updateVacante, deleteVacante, getVacantesEmpresa };
