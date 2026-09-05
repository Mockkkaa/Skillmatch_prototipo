require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const aprendizRoutes = require('./routes/aprendices');
const hojaVidaRoutes = require('./routes/hojaVida');
const formacionRoutes = require('./routes/formacion');
const experienciasRoutes = require('./routes/experiencias');
const habilidadesRoutes = require('./routes/habilidades');
const vacantesRoutes = require('./routes/vacantes');
const postulacionesRoutes = require('./routes/postulaciones');
const empresasRoutes = require('./routes/empresas');
const usersRoutes = require('./routes/users');
const reportesRoutes = require('./routes/reportes');
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SkillMatch API is running 🚀', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/aprendices', aprendizRoutes);
app.use('/api/hojas-vida', hojaVidaRoutes);
app.use('/api/formacion', formacionRoutes);
app.use('/api/experiencias', experienciasRoutes);
app.use('/api/habilidades', habilidadesRoutes);
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

// 404 and global error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
