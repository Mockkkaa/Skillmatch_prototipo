-- ============================================================
-- SKILLMATCH - Datos de prueba (seed.sql)
-- ============================================================

USE skillmatch;

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (nombre, descripcion) VALUES
('ADMINISTRADOR', 'Acceso total al sistema'),
('FUNCIONARIO', 'Gestión de información y reportes SENA'),
('APRENDIZ', 'Aprendiz del SENA con acceso a perfil y postulaciones'),
('EMPRESA', 'Empresa que publica vacantes');

-- ============================================================
-- PROGRAMAS DE FORMACIÓN
-- ============================================================
INSERT INTO programas_formacion (nombre, area, nivel, duracion_meses) VALUES
('Análisis y Desarrollo de Software', 'Tecnología', 'TECNOLOGO', 24),
('Diseño Gráfico', 'Diseño', 'TECNOLOGO', 24),
('Gestión Empresarial', 'Administración', 'TECNOLOGO', 24),
('Marketing Digital', 'Comercio', 'TECNICO', 18),
('Contabilidad y Finanzas', 'Finanzas', 'TECNOLOGO', 24),
('Redes y Seguridad Informática', 'Tecnología', 'TECNOLOGO', 24),
('Producción Multimedia', 'Diseño', 'TECNICO', 18),
('Gestión Logística', 'Logística', 'TECNOLOGO', 24);

-- ============================================================
-- USUARIOS - ADMINISTRADORES (contraseña: Admin2024!)
-- Hash bcrypt de "Admin2024!"
-- ============================================================
INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES
('Carlos', 'Mendoza', 'admin@skillmatch.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1000111001', '3001234567', 'Bogotá', 1),
('María', 'Gómez', 'maria.admin@skillmatch.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1000111002', '3007654321', 'Medellín', 1);

-- FUNCIONARIOS (contraseña: Func2024!)
INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES
('Juan', 'Pérez', 'juan.funcionario@sena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1000222001', '3101112233', 'Bogotá', 2),
('Ana', 'Torres', 'ana.funcionario@sena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1000222002', '3104445566', 'Cali', 2);

-- APRENDICES (contraseña: Aprendiz2024!)
INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES
('Santiago', 'Ramírez', 'santiago.r@misena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1002333001', '3201112233', 'Bogotá', 3),
('Laura', 'Martínez', 'laura.m@misena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1002333002', '3204445566', 'Medellín', 3),
('Andrés', 'López', 'andres.l@misena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1002333003', '3207778899', 'Cali', 3),
('Valentina', 'Cruz', 'valentina.c@misena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1002333004', '3150001234', 'Barranquilla', 3),
('Miguel', 'Herrera', 'miguel.h@misena.edu.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '1002333005', '3156669999', 'Bucaramanga', 3);

-- EMPRESAS (contraseña: Empresa2024!)
INSERT INTO usuarios (nombre, apellido, correo, contrasena, documento, telefono, ciudad, rol_id) VALUES
('TechCorp', 'Colombia', 'contacto@techcorp.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '9001001001', '6011234567', 'Bogotá', 4),
('Innovasoft', 'SAS', 'rrhh@innovasoft.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '9001002002', '6044567890', 'Medellín', 4),
('DigitalMind', 'Ltda', 'talentos@digitalmind.co', '$2b$10$rQnv5V3Z1K9P2M8X4Y7W0u5vJ3L6O9R2T8U1Q4S7N0M3K6I9F2E5B', '9001003003', '6022345678', 'Cali', 4);

-- ============================================================
-- APRENDICES (perfil extendido)
-- ============================================================
INSERT INTO aprendices (usuario_id, programa_formacion_id, numero_ficha, nivel_formacion, perfil_profesional, fecha_inicio_formacion, fecha_fin_formacion, estado_formacion) VALUES
(5, 1, '2558934', 'TECNOLOGO', 'Aprendiz de desarrollo de software con interés en aplicaciones web y móviles. Experiencia en JavaScript, React y Node.js.', '2023-03-01', '2025-03-01', 'EN_FORMACION'),
(6, 2, '2558935', 'TECNOLOGO', 'Aprendiz de diseño gráfico con habilidades en branding, ilustración digital y diseño de interfaces.', '2023-03-01', '2025-03-01', 'EN_FORMACION'),
(7, 1, '2558936', 'TECNOLOGO', 'Aprendiz de análisis y desarrollo de software con enfoque en backend y bases de datos.', '2022-09-01', '2024-09-01', 'EN_FORMACION'),
(8, 4, '2558937', 'TECNICO', 'Aprendiz de marketing digital con experiencia en redes sociales, SEO y campañas publicitarias.', '2023-09-01', '2025-03-01', 'EN_FORMACION'),
(9, 6, '2558938', 'TECNOLOGO', 'Aprendiz de redes y seguridad con conocimientos en ciberseguridad y administración de servidores.', '2023-03-01', '2025-09-01', 'EN_FORMACION');

-- ============================================================
-- EMPRESAS (perfil extendido)
-- ============================================================
INSERT INTO empresas (usuario_id, razon_social, nit, correo_empresa, telefono, direccion, ciudad, descripcion, sector, sitio_web, estado, aprobado_por, fecha_aprobacion) VALUES
(10, 'TechCorp Colombia SAS', '900100100-1', 'contacto@techcorp.co', '6011234567', 'Cra 7 # 32-16', 'Bogotá', 'Empresa de desarrollo de software y soluciones tecnológicas con más de 10 años de experiencia en el mercado colombiano.', 'Tecnología', 'https://techcorp.co', 'APROBADA', 1, NOW()),
(11, 'Innovasoft SAS', '900100200-2', 'rrhh@innovasoft.co', '6044567890', 'Calle 50 # 43-60', 'Medellín', 'Empresa de innovación tecnológica especializada en desarrollo de apps móviles y soluciones cloud.', 'Software', 'https://innovasoft.co', 'APROBADA', 1, NOW()),
(12, 'DigitalMind Ltda', '900100300-3', 'talentos@digitalmind.co', '6022345678', 'Av 3N # 45-12', 'Cali', 'Agencia de marketing digital y desarrollo web con enfoque en startups y pymes.', 'Marketing Digital', 'https://digitalmind.co', 'PENDIENTE', NULL, NULL);

-- ============================================================
-- HOJAS DE VIDA
-- ============================================================
INSERT INTO hojas_vida (aprendiz_id, objetivo_profesional, disponibilidad, modalidad_preferida, porcentaje_completado) VALUES
(1, 'Desarrollador web full stack en proceso de formación, busco mi primera experiencia laboral en el área de tecnología.', 'INMEDIATA', 'HIBRIDO', 75),
(2, 'Diseñadora gráfica en formación con pasión por el branding y la identidad visual corporativa.', 'EN_15_DIAS', 'REMOTO', 60),
(3, 'Desarrollador backend con conocimientos en Node.js y bases de datos relacionales.', 'EN_1_MES', 'PRESENCIAL', 50),
(4, 'Especialista en marketing digital con habilidades en gestión de comunidades y campañas digitales.', 'INMEDIATA', 'INDIFERENTE', 40),
(5, 'Técnico en redes con enfoque en ciberseguridad y protección de infraestructuras digitales.', 'NEGOCIABLE', 'PRESENCIAL', 35);

-- ============================================================
-- FORMACIÓN ACADÉMICA
-- ============================================================
INSERT INTO formacion_academica (aprendiz_id, institucion, programa, nivel, fecha_inicio, actualmente_cursando, estado) VALUES
(1, 'SENA', 'Análisis y Desarrollo de Software', 'TECNOLOGO', '2023-03-01', 1, 'EN_CURSO'),
(2, 'SENA', 'Diseño Gráfico', 'TECNOLOGO', '2023-03-01', 1, 'EN_CURSO'),
(3, 'SENA', 'Análisis y Desarrollo de Software', 'TECNOLOGO', '2022-09-01', 1, 'EN_CURSO'),
(1, 'Colegio San Bartolomé', 'Bachillerato Académico', 'BACHILLERATO', '2016-01-01', 0, 'GRADUADO'),
(2, 'Instituto Técnico Central', 'Bachillerato Técnico', 'BACHILLERATO', '2016-01-01', 0, 'GRADUADO');

-- ============================================================
-- EXPERIENCIA LABORAL
-- ============================================================
INSERT INTO experiencias_laborales (aprendiz_id, empresa, cargo, descripcion, fecha_inicio, actualmente_trabaja) VALUES
(1, 'Freelance', 'Desarrollador Web', 'Desarrollo de sitios web para pequeñas empresas usando HTML, CSS y JavaScript.', '2023-01-01', 1),
(2, 'Studio Creativo Ltda', 'Asistente de Diseño', 'Apoyo en diseño de materiales publicitarios y redes sociales para clientes corporativos.', '2022-06-01', 0);

-- ============================================================
-- HABILIDADES
-- ============================================================
INSERT INTO habilidades (aprendiz_id, nombre, nivel, tipo) VALUES
(1, 'JavaScript', 'INTERMEDIO', 'TECNICA'),
(1, 'React', 'BASICO', 'TECNICA'),
(1, 'Node.js', 'BASICO', 'TECNICA'),
(1, 'MySQL', 'INTERMEDIO', 'TECNICA'),
(1, 'Trabajo en equipo', 'AVANZADO', 'BLANDA'),
(2, 'Illustrator', 'AVANZADO', 'HERRAMIENTA'),
(2, 'Photoshop', 'AVANZADO', 'HERRAMIENTA'),
(2, 'Figma', 'INTERMEDIO', 'HERRAMIENTA'),
(2, 'Creatividad', 'AVANZADO', 'BLANDA'),
(3, 'Python', 'INTERMEDIO', 'TECNICA'),
(3, 'SQL', 'AVANZADO', 'TECNICA'),
(3, 'Docker', 'BASICO', 'HERRAMIENTA'),
(4, 'SEO', 'INTERMEDIO', 'TECNICA'),
(4, 'Google Ads', 'BASICO', 'HERRAMIENTA'),
(5, 'Cisco', 'INTERMEDIO', 'TECNICA'),
(5, 'Linux', 'INTERMEDIO', 'HERRAMIENTA');

-- ============================================================
-- VACANTES
-- ============================================================
INSERT INTO vacantes (empresa_id, cargo, descripcion, requisitos, habilidades_requeridas, ubicacion, modalidad, tipo_contrato, salario_min, salario_max, salario_negociable, fecha_limite, programa_formacion_id, area, estado) VALUES
(1, 'Desarrollador Frontend React', 
'Buscamos un aprendiz SENA del programa de Análisis y Desarrollo de Software para apoyar al equipo de desarrollo frontend. Trabajarás en proyectos reales con tecnologías modernas.', 
'Estar en etapa productiva SENA. Conocimientos en HTML, CSS y JavaScript. Deseable React.', 
'JavaScript, React, CSS, HTML', 
'Bogotá', 'HIBRIDO', 'APRENDIZAJE', 1000000, 1500000, 0, 
DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1, 'Tecnología', 'PUBLICADA'),

(1, 'Desarrollador Backend Node.js', 
'Aprendiz para el equipo backend. Participará en el desarrollo de APIs REST y gestión de bases de datos MySQL.', 
'Etapa productiva SENA. Conocimientos en Node.js o Python. Manejo de bases de datos.', 
'Node.js, MySQL, REST API', 
'Bogotá', 'PRESENCIAL', 'APRENDIZAJE', 1000000, 1300000, 1, 
DATE_ADD(CURDATE(), INTERVAL 45 DAY), 1, 'Tecnología', 'PUBLICADA'),

(2, 'Diseñador UI/UX', 
'Buscamos un aprendiz creativo de diseño gráfico para unirse a nuestro equipo de producto. Trabajarás en el diseño de interfaces de nuestras aplicaciones móviles.', 
'Etapa productiva. Portafolio de trabajos. Conocimiento en herramientas de diseño.', 
'Figma, Illustrator, Photoshop', 
'Medellín', 'REMOTO', 'APRENDIZAJE', 900000, 1200000, 0, 
DATE_ADD(CURDATE(), INTERVAL 20 DAY), 2, 'Diseño', 'PUBLICADA'),

(2, 'Especialista en Marketing Digital', 
'Aprendiz para el área de marketing digital. Gestionará redes sociales, creará contenido y apoyará en campañas de publicidad digital.', 
'Etapa productiva. Conocimiento en redes sociales y herramientas de marketing.', 
'Google Ads, SEO, Redes Sociales', 
'Medellín', 'HIBRIDO', 'APRENDIZAJE', 900000, 1100000, 1, 
DATE_ADD(CURDATE(), INTERVAL 15 DAY), 4, 'Marketing', 'PUBLICADA'),

(1, 'Analista de Ciberseguridad', 
'Apoyo en el área de seguridad informática. El aprendiz participará en auditorías de seguridad y monitoreo de redes.', 
'Etapa productiva. Conocimientos en redes y seguridad. Deseable certificación Cisco.', 
'Linux, Cisco, Redes', 
'Bogotá', 'PRESENCIAL', 'APRENDIZAJE', 1100000, 1500000, 0, 
DATE_ADD(CURDATE(), INTERVAL 60 DAY), 6, 'Tecnología', 'PUBLICADA');

-- ============================================================
-- POSTULACIONES
-- ============================================================
INSERT INTO postulaciones (aprendiz_id, vacante_id, carta_presentacion, estado) VALUES
(1, 1, 'Soy Santiago Ramírez, aprendiz de desarrollo de software del SENA. Tengo conocimientos en React y JavaScript y me encuentro en etapa productiva. Estoy muy interesado en esta oportunidad.', 'EN_REVISION'),
(1, 2, 'Me postulo al cargo de desarrollador backend ya que tengo conocimientos en Node.js y MySQL adquiridos durante mi formación en el SENA.', 'ENVIADA'),
(2, 3, 'Soy Laura Martínez, aprendiz de diseño gráfico con amplio manejo de herramientas Adobe y Figma. Adjunto mi portafolio de trabajos.', 'PRESELECCIONADO'),
(3, 2, 'Estoy interesado en el cargo de desarrollador backend. Cuento con conocimientos en Node.js, SQL y manejo de APIs REST.', 'ENVIADA'),
(4, 4, 'Como aprendiz de marketing digital, tengo experiencia en gestión de redes sociales y conocimientos en Google Ads. Sería un aporte valioso para su equipo.', 'RECHAZADO'),
(5, 5, 'Me interesa mucho este cargo ya que estoy en el programa de Redes y Seguridad Informática del SENA y tengo conocimientos en Linux y Cisco.', 'ENVIADA');
