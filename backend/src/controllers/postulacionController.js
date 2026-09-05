const pool = require('../config/database');
const { createNotification } = require('./notificacionController');

/** GET /api/postulaciones - Postulaciones del aprendiz autenticado */
const getPostulaciones = async (req, res, next) => {
  try {
    let rows;
    if (req.user.rol === 'APRENDIZ') {
      const [ap] = await pool.query('SELECT id FROM aprendices WHERE usuario_id = ?', [req.user.id]);
      if (!ap.length) return res.status(404).json({ success: false, message: 'Perfil de aprendiz no encontrado' });

      [rows] = await pool.query(
        `SELECT p.id, p.estado, p.carta_presentacion, p.nota_empresa, p.created_at, p.updated_at,
                v.cargo, v.modalidad, v.ubicacion,
                e.razon_social as empresa, e.logo as empresa_logo
         FROM postulaciones p
         JOIN vacantes v ON p.vacante_id = v.id
         JOIN empresas e ON v.empresa_id = e.id
         WHERE p.aprendiz_id = ?
         ORDER BY p.created_at DESC`,
        [ap[0].id]
      );
    } else if (req.user.rol === 'EMPRESA') {
      // Postulaciones recibidas para la empresa
      const vacanteId = req.query.vacante_id;
      const [emp] = await pool.query('SELECT id FROM empresas WHERE usuario_id = ?', [req.user.id]);
      if (!emp.length) return res.status(404).json({ success: false, message: 'Empresa no encontrada' });

      let query = `SELECT p.id, p.estado, p.carta_presentacion, p.nota_empresa, p.created_at,
                          v.id as vacante_id, v.cargo,
                          u.nombre, u.apellido, u.correo, u.foto_perfil,
                          a.id as aprendiz_id, prog.nombre as programa
                   FROM postulaciones p
                   JOIN vacantes v ON p.vacante_id = v.id
                   JOIN aprendices a ON p.aprendiz_id = a.id
                   JOIN usuarios u ON a.usuario_id = u.id
                   LEFT JOIN programas_formacion prog ON a.programa_formacion_id = prog.id
                   WHERE v.empresa_id = ?`;
      const params = [emp[0].id];
      if (vacanteId) { query += ' AND v.id = ?'; params.push(vacanteId); }
      query += ' ORDER BY p.created_at DESC';

      [rows] = await pool.query(query, params);
    } else {
      // Admin / Funcionario - ver todas
      [rows] = await pool.query(
        `SELECT p.id, p.estado, p.created_at,
                v.cargo, e.razon_social as empresa,
                u.nombre, u.apellido
         FROM postulaciones p
         JOIN vacantes v ON p.vacante_id = v.id
         JOIN empresas e ON v.empresa_id = e.id
         JOIN aprendices a ON p.aprendiz_id = a.id
         JOIN usuarios u ON a.usuario_id = u.id
         ORDER BY p.created_at DESC LIMIT 100`
      );
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/** POST /api/postulaciones */
const createPostulacion = async (req, res, next) => {
  try {
    const { vacante_id, carta_presentacion } = req.body;

    const [ap] = await pool.query('SELECT id FROM aprendices WHERE usuario_id = ?', [req.user.id]);
    if (!ap.length) return res.status(403).json({ success: false, message: 'Solo los aprendices pueden postularse.' });

    // Check vacante exists and is published
    const [vac] = await pool.query(
      `SELECT v.id, v.cargo, v.estado, e.usuario_id as empresa_usuario_id, e.razon_social 
       FROM vacantes v 
       JOIN empresas e ON v.empresa_id = e.id 
       WHERE v.id = ? AND v.estado = 'PUBLICADA'`,
      [vacante_id]
    );
    if (!vac.length) return res.status(404).json({ success: false, message: 'La vacante no está disponible.' });

    // Check duplicate application
    const [existing] = await pool.query(
      'SELECT id FROM postulaciones WHERE aprendiz_id = ? AND vacante_id = ?',
      [ap[0].id, vacante_id]
    );
    if (existing.length) return res.status(409).json({ success: false, message: 'Ya te has postulado a esta vacante.' });

    const [result] = await pool.query(
      'INSERT INTO postulaciones (aprendiz_id, vacante_id, carta_presentacion) VALUES (?, ?, ?)',
      [ap[0].id, vacante_id, carta_presentacion || null]
    );

    // Notificar al Aprendiz que su postulación fue enviada con éxito
    await createNotification({
      usuario_id: req.user.id,
      tipo: 'SUCCESS',
      titulo: 'Postulación enviada',
      mensaje: `Te has postulado con éxito a la vacante "${vac[0].cargo}" en ${vac[0].razon_social}.`,
      enlace: '/postulaciones'
    });

    // Notificar a la Empresa que recibió una nueva postulación
    if (vac[0].empresa_usuario_id) {
      await createNotification({
        usuario_id: vac[0].empresa_usuario_id,
        tipo: 'INFO',
        titulo: 'Nueva postulación recibida',
        mensaje: `${req.user.nombre || 'Un aprendiz'} se ha postulado a tu vacante "${vac[0].cargo}".`,
        enlace: '/empresa/postulaciones'
      });
    }

    res.status(201).json({ success: true, message: '¡Postulación enviada correctamente!', id: result.insertId });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/postulaciones/:id - Empresa actualiza estado */
const updatePostulacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, nota_empresa } = req.body;

    const validStates = ['ENVIADA', 'EN_REVISION', 'PRESELECCIONADO', 'RECHAZADO', 'FINALIZADO'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado no válido' });
    }

    // Obtener detalles de la postulación para notificar al aprendiz
    const [postData] = await pool.query(
      `SELECT p.id, p.aprendiz_id, a.usuario_id as aprendiz_usuario_id, v.cargo, e.razon_social, e.usuario_id as empresa_usuario_id
       FROM postulaciones p
       JOIN vacantes v ON p.vacante_id = v.id
       JOIN empresas e ON v.empresa_id = e.id
       JOIN aprendices a ON p.aprendiz_id = a.id
       WHERE p.id = ?`,
      [id]
    );

    if (!postData.length) {
      return res.status(404).json({ success: false, message: 'Postulación no encontrada' });
    }

    if (req.user.rol === 'EMPRESA') {
      if (postData[0].empresa_usuario_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar esta postulación' });
      }
    }

    await pool.query('UPDATE postulaciones SET estado=?, nota_empresa=? WHERE id=?', [estado, nota_empresa || null, id]);

    // Notificar al Aprendiz sobre el cambio de estado
    const estadoLabels = {
      'EN_REVISION': 'está en revisión',
      'PRESELECCIONADO': '¡Has sido preseleccionado! 🎉',
      'RECHAZADO': 'ha sido descartada en este proceso',
      'FINALIZADO': 'ha finalizado el proceso de selección',
      'ENVIADA': 'está enviada'
    };

    const notifTipo = estado === 'PRESELECCIONADO' ? 'SUCCESS' : (estado === 'RECHAZADO' ? 'WARNING' : 'INFO');

    await createNotification({
      usuario_id: postData[0].aprendiz_usuario_id,
      tipo: notifTipo,
      titulo: 'Actualización en tu postulación',
      mensaje: `Tu postulación para "${postData[0].cargo}" en ${postData[0].razon_social} ${estadoLabels[estado] || estado}.${nota_empresa ? ' Nota: ' + nota_empresa : ''}`,
      enlace: '/postulaciones'
    });

    res.json({ success: true, message: 'Estado de postulación actualizado y notificación enviada.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPostulaciones, createPostulacion, updatePostulacion };
