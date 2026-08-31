-- ============================================================
-- SKILLMATCH - Base de datos
-- Plataforma de gestión de empleo para aprendices del SENA
-- ============================================================

DROP DATABASE IF EXISTS skillmatch;
CREATE DATABASE skillmatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillmatch;

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  documento VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  ciudad VARCHAR(100),
  foto_perfil VARCHAR(500),
  rol_id INT NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ============================================================
-- PROGRAMAS DE FORMACIÓN
-- ============================================================
CREATE TABLE programas_formacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  area VARCHAR(100),
  nivel VARCHAR(50),
  duracion_meses INT,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- APRENDICES (extiende usuario con datos SENA)
-- ============================================================
CREATE TABLE aprendices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  programa_formacion_id INT,
  numero_ficha VARCHAR(20),
  nivel_formacion VARCHAR(50),
  perfil_profesional TEXT,
  fecha_inicio_formacion DATE,
  fecha_fin_formacion DATE,
  estado_formacion ENUM('EN_FORMACION', 'EGRESADO', 'RETIRO') DEFAULT 'EN_FORMACION',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (programa_formacion_id) REFERENCES programas_formacion(id)
);

-- ============================================================
-- EMPRESAS
-- ============================================================
CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  razon_social VARCHAR(200) NOT NULL,
  nit VARCHAR(20) NOT NULL UNIQUE,
  correo_empresa VARCHAR(150),
  telefono VARCHAR(20),
  direccion VARCHAR(300),
  ciudad VARCHAR(100),
  descripcion TEXT,
  sector VARCHAR(100),
  sitio_web VARCHAR(300),
  logo VARCHAR(500),
  estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
  motivo_rechazo TEXT,
  aprobado_por INT,
  fecha_aprobacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (aprobado_por) REFERENCES usuarios(id)
);

-- ============================================================
-- HOJAS DE VIDA
-- ============================================================
CREATE TABLE hojas_vida (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL UNIQUE,
  objetivo_profesional TEXT,
  disponibilidad ENUM('INMEDIATA', 'EN_15_DIAS', 'EN_1_MES', 'NEGOCIABLE') DEFAULT 'INMEDIATA',
  modalidad_preferida ENUM('PRESENCIAL', 'REMOTO', 'HIBRIDO', 'INDIFERENTE') DEFAULT 'INDIFERENTE',
  salario_esperado DECIMAL(12,2),
  porcentaje_completado INT DEFAULT 0,
  visible TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE
);

-- ============================================================
-- FORMACIÓN ACADÉMICA
-- ============================================================
CREATE TABLE formacion_academica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL,
  institucion VARCHAR(200) NOT NULL,
  programa VARCHAR(200) NOT NULL,
  nivel ENUM('BACHILLERATO', 'TECNICO', 'TECNOLOGO', 'PROFESIONAL', 'ESPECIALIZACION', 'MAESTRIA', 'DOCTORADO', 'OTRO') NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  actualmente_cursando TINYINT(1) DEFAULT 0,
  estado ENUM('GRADUADO', 'EN_CURSO', 'INCOMPLETO') DEFAULT 'EN_CURSO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE
);

-- ============================================================
-- EXPERIENCIA LABORAL
-- ============================================================
CREATE TABLE experiencias_laborales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL,
  empresa VARCHAR(200) NOT NULL,
  cargo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  actualmente_trabaja TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE
);

-- ============================================================
-- HABILIDADES
-- ============================================================
CREATE TABLE habilidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  nivel ENUM('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO') DEFAULT 'INTERMEDIO',
  tipo ENUM('TECNICA', 'BLANDA', 'IDIOMA', 'HERRAMIENTA') DEFAULT 'TECNICA',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE
);

-- ============================================================
-- CERTIFICACIONES
-- ============================================================
CREATE TABLE certificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  entidad_emisora VARCHAR(200),
  fecha_obtencion DATE,
  url_certificado VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE
);

-- ============================================================
-- VACANTES
-- ============================================================
CREATE TABLE vacantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  cargo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  requisitos TEXT,
  habilidades_requeridas TEXT,
  ubicacion VARCHAR(200),
  modalidad ENUM('PRESENCIAL', 'REMOTO', 'HIBRIDO') DEFAULT 'PRESENCIAL',
  tipo_contrato ENUM('TERMINO_FIJO', 'INDEFINIDO', 'PRESTACION_SERVICIOS', 'APRENDIZAJE', 'PASANTIA', 'OTRO') DEFAULT 'APRENDIZAJE',
  salario_min DECIMAL(12,2),
  salario_max DECIMAL(12,2),
  salario_negociable TINYINT(1) DEFAULT 0,
  fecha_limite DATE,
  programa_formacion_id INT,
  area VARCHAR(100),
  estado ENUM('BORRADOR', 'PUBLICADA', 'CERRADA') DEFAULT 'BORRADOR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (programa_formacion_id) REFERENCES programas_formacion(id)
);

-- ============================================================
-- POSTULACIONES
-- ============================================================
CREATE TABLE postulaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aprendiz_id INT NOT NULL,
  vacante_id INT NOT NULL,
  carta_presentacion TEXT,
  estado ENUM('ENVIADA', 'EN_REVISION', 'PRESELECCIONADO', 'RECHAZADO', 'FINALIZADO') DEFAULT 'ENVIADA',
  nota_empresa TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_postulacion (aprendiz_id, vacante_id),
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE,
  FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE CASCADE
);

-- ============================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_vacantes_empresa ON vacantes(empresa_id);
CREATE INDEX idx_vacantes_estado ON vacantes(estado);
CREATE INDEX idx_postulaciones_aprendiz ON postulaciones(aprendiz_id);
CREATE INDEX idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX idx_empresas_estado ON empresas(estado);
