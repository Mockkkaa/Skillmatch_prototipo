const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

/**
 * POST /api/auth/register
 * Registrar nuevo aprendiz
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
    }

    const { nombre, apellido, correo, contrasena, documento, telefono, ciudad, programa_formacion_id, numero_ficha } = req.body;

    // Verificar correo único
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE correo = ? OR documento = ?', [correo, documento]);
    if (existing.length > 0) {
      const isEmail = existing[0].correo === correo;
      return res.status(409).json({
        success: false,
        message: isEmail ? 'El correo ya está registrado en el sistema.' : 'El documento ya está registrado en el sistema.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Obtener rol APRENDIZ
    const [roles] = await pool.query("SELECT id FROM roles WHERE nombre = 'APRENDIZ'");
    if (!roles.length) return res.status(500).json({ success: false, message: 'Error en configuración de roles' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Crear usuario
      const [userResult] = await conn.query(
        'INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, correo, hashedPassword, documento, telefono || null, ciudad || null, roles[0].id]
      );
      const userId = userResult.insertId;

      // Crear perfil aprendiz
      const [aprendizResult] = await conn.query(
        'INSERT INTO aprendices (usuario_id, programa_formacion_id, numero_ficha) VALUES (?, ?, ?)',
        [userId, programa_formacion_id || null, numero_ficha || null]
      );

      // Crear hoja de vida vacía
      await conn.query('INSERT INTO hojas_vida (aprendiz_id) VALUES (?)', [aprendizResult.insertId]);

      await conn.commit();

      // Generar token
      const token = jwt.sign(
        { id: userId, rol: 'APRENDIZ' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: '¡Registro exitoso! Bienvenido a SkillMatch.',
        token,
        user: {
          id: userId,
          nombre,
          apellido,
          correo,
          rol: 'APRENDIZ',
        },
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

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errors.array() });
    }

    const { correo, contrasena } = req.body;

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.correo, u.contrasena, u.activo, u.foto_perfil,
              r.nombre as rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.correo = ?`,
      [correo]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }

    const user = rows[0];

    if (!user.activo) {
      return res.status(401).json({ success: false, message: 'Tu cuenta está inactiva. Contacta al administrador.' });
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Get extra profile info based on role
    let profileData = {};
    if (user.rol === 'APRENDIZ') {
      const [ap] = await pool.query('SELECT id FROM aprendices WHERE usuario_id = ?', [user.id]);
      profileData = { aprendiz_id: ap[0]?.id };
    } else if (user.rol === 'EMPRESA') {
      const [em] = await pool.query('SELECT id, estado FROM empresas WHERE usuario_id = ?', [user.id]);
      profileData = { empresa_id: em[0]?.id, empresa_estado: em[0]?.estado };
    }

    res.json({
      success: true,
      message: `¡Bienvenido, ${user.nombre}!`,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        foto_perfil: user.foto_perfil,
        rol: user.rol,
        ...profileData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const me = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.correo, u.documento, u.telefono, u.ciudad, u.foto_perfil,
              r.nombre as rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const user = rows[0];
    let profileData = {};

    if (user.rol === 'APRENDIZ') {
      const [ap] = await pool.query(
        `SELECT a.id, a.numero_ficha, a.nivel_formacion, a.perfil_profesional, a.estado_formacion,
                p.nombre as programa
         FROM aprendices a
         LEFT JOIN programas_formacion p ON a.programa_formacion_id = p.id
         WHERE a.usuario_id = ?`,
        [user.id]
      );
      profileData = { aprendiz: ap[0] || null };
    } else if (user.rol === 'EMPRESA') {
      const [em] = await pool.query('SELECT id, razon_social, estado FROM empresas WHERE usuario_id = ?', [user.id]);
      profileData = { empresa: em[0] || null };
    }

    res.json({ success: true, user: { ...user, ...profileData } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
