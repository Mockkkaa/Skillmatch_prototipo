const pool = require('../config/database');

/** GET /api/reportes */
const getReportes = async (req, res, next) => {
  try {
    // Counts
    const [[aprendices]] = await pool.query("SELECT COUNT(*) as total FROM aprendices");
    const [[empresas]] = await pool.query("SELECT COUNT(*) as total FROM empresas");
    const [[empresasPendientes]] = await pool.query("SELECT COUNT(*) as total FROM empresas WHERE estado='PENDIENTE'");
    const [[empresasAprobadas]] = await pool.query("SELECT COUNT(*) as total FROM empresas WHERE estado='APROBADA'");
    const [[vacantes]] = await pool.query("SELECT COUNT(*) as total FROM vacantes");
    const [[vacantesActivas]] = await pool.query("SELECT COUNT(*) as total FROM vacantes WHERE estado='PUBLICADA'");
    const [[postulaciones]] = await pool.query("SELECT COUNT(*) as total FROM postulaciones");

    // Postulaciones por estado
    const [postulacionesPorEstado] = await pool.query(
      "SELECT estado, COUNT(*) as cantidad FROM postulaciones GROUP BY estado"
    );

    // Vacantes por empresa (top 5)
    const [vacantesPorEmpresa] = await pool.query(
      `SELECT e.razon_social, COUNT(v.id) as total_vacantes
       FROM empresas e LEFT JOIN vacantes v ON e.id = v.empresa_id
       WHERE e.estado = 'APROBADA'
       GROUP BY e.id ORDER BY total_vacantes DESC LIMIT 5`
    );

    // Aprendices por programa (top 5)
    const [aprendicesPorPrograma] = await pool.query(
      `SELECT p.nombre, COUNT(a.id) as total
       FROM programas_formacion p LEFT JOIN aprendices a ON p.id = a.programa_formacion_id
       GROUP BY p.id ORDER BY total DESC LIMIT 5`
    );

    // Postulaciones últimos 7 días
    const [postulacionesRecientes] = await pool.query(
      `SELECT DATE(created_at) as fecha, COUNT(*) as cantidad
       FROM postulaciones
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY fecha`
    );

    res.json({
      success: true,
      data: {
        resumen: {
          totalAprendices: aprendices.total,
          totalEmpresas: empresas.total,
          empresasPendientes: empresasPendientes.total,
          empresasAprobadas: empresasAprobadas.total,
          totalVacantes: vacantes.total,
          vacantesActivas: vacantesActivas.total,
          totalPostulaciones: postulaciones.total,
        },
        postulacionesPorEstado,
        vacantesPorEmpresa,
        aprendicesPorPrograma,
        postulacionesRecientes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReportes };
