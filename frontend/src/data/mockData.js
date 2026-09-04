/**
 * SKILLMATCH - Mock Data
 * Datos de prueba centralizados para el prototipo académico.
 * Permite que todas las vistas funcionen de manera completa e interactiva
 * aún cuando el backend no esté activo o devuelva error.
 */

export const mockUsuarios = [
  {
    id: 1,
    nombre: 'Juan Camilo Pérez',
    email: 'juan.perez@soy.sena.edu.co',
    rol: 'aprendiz',
    estado: 'ACTIVO',
    aprendiz_id: 1,
    fecha_registro: '2025-01-15'
  },
  {
    id: 2,
    nombre: 'María Camila Gómez',
    email: 'maria.gomez@soy.sena.edu.co',
    rol: 'aprendiz',
    estado: 'ACTIVO',
    aprendiz_id: 2,
    fecha_registro: '2025-02-01'
  },
  {
    id: 3,
    nombre: 'Carlos Andrés Rodríguez',
    email: 'carlos.rodriguez@soy.sena.edu.co',
    rol: 'aprendiz',
    estado: 'ACTIVO',
    aprendiz_id: 3,
    fecha_registro: '2025-02-10'
  },
  {
    id: 4,
    nombre: 'TechSolutions Colombia',
    email: 'contacto@techsolutions.co',
    rol: 'empresa',
    estado: 'ACTIVO',
    empresa_id: 1,
    fecha_registro: '2025-01-10'
  },
  {
    id: 5,
    nombre: 'InnovaTech S.A.S.',
    email: 'talento@innovatech.com',
    rol: 'empresa',
    estado: 'ACTIVO',
    empresa_id: 2,
    fecha_registro: '2025-01-20'
  },
  {
    id: 6,
    nombre: 'Grupo Digital Andino',
    email: 'rrhh@grupodigital.com',
    rol: 'empresa',
    estado: 'PENDIENTE',
    empresa_id: 3,
    fecha_registro: '2025-02-18'
  },
  {
    id: 7,
    nombre: 'Administrador SENA',
    email: 'admin@sena.edu.co',
    rol: 'admin',
    estado: 'ACTIVO',
    fecha_registro: '2024-12-01'
  }
];

export const mockAprendices = [
  {
    id: 1,
    user_id: 1,
    nombre: 'Juan Camilo',
    apellido: 'Pérez Silva',
    nombre_completo: 'Juan Camilo Pérez Silva',
    tipo_documento: 'CC',
    numero_documento: '1020304050',
    email: 'juan.perez@soy.sena.edu.co',
    telefono: '3124567890',
    direccion: 'Calle 45 # 28-15, Bogotá D.C.',
    ciudad: 'Bogotá',
    fecha_nacimiento: '2002-05-14',
    programa_formacion: 'Análisis y Desarrollo de Software (ADSO)',
    ficha_sena: '2670145',
    centro_formacion: 'Centro de Servicios y Gestión Empresarial',
    estado_formacion: 'Etapa Productiva',
    porcentaje_completado: 85,
    perfil_profesional: 'Aprendiz SENA del programa ADSO con sólida formación en desarrollo frontend y backend. Apasionado por construir interfaces intuitivas, responsivas y accesibles con React, JavaScript y Node.js.',
    foto_url: null,
    linkedin: 'https://linkedin.com/in/juan-perez-sena',
    github: 'https://github.com/juanperez-sena'
  },
  {
    id: 2,
    user_id: 2,
    nombre: 'María Camila',
    apellido: 'Gómez Restrepo',
    nombre_completo: 'María Camila Gómez Restrepo',
    tipo_documento: 'CC',
    numero_documento: '1098765432',
    email: 'maria.gomez@soy.sena.edu.co',
    telefono: '3157890123',
    ciudad: 'Medellín',
    programa_formacion: 'Gestión Administrativa',
    ficha_sena: '2561980',
    centro_formacion: 'Centro de Comercio',
    estado_formacion: 'Etapa Lectiva',
    porcentaje_completado: 70,
    perfil_profesional: 'Tecnóloga en Gestión Administrativa con habilidades en redacción ejecutiva, gestión documental y software ERP.',
    foto_url: null
  },
  {
    id: 3,
    user_id: 3,
    nombre: 'Carlos Andrés',
    apellido: 'Rodríguez Niño',
    nombre_completo: 'Carlos Andrés Rodríguez Niño',
    tipo_documento: 'CC',
    numero_documento: '1014234567',
    email: 'carlos.rodriguez@soy.sena.edu.co',
    telefono: '3209876543',
    ciudad: 'Cali',
    programa_formacion: 'Mantenimiento de Redes de Datos',
    ficha_sena: '2718902',
    centro_formacion: 'Centro de Electricidad y Telecomunicaciones',
    estado_formacion: 'Etapa Productiva',
    porcentaje_completado: 90,
    perfil_profesional: 'Técnico en soporte y redes con conocimientos en Linux, cableado estructurado y administración básica de servidores.',
    foto_url: null
  }
];

export const mockFormacion = [
  {
    id: 1,
    aprendiz_id: 1,
    institucion: 'Servicio Nacional de Aprendizaje (SENA)',
    titulo: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    nivel_educativo: 'Tecnólogo',
    fecha_inicio: '2023-04-10',
    fecha_fin: '2025-04-10',
    en_curso: true,
    descripcion: 'Formación integral en desarrollo web, bases de datos relacionales, metodologías ágiles (Scrum) y arquitectura de software.'
  },
  {
    id: 2,
    aprendiz_id: 1,
    institucion: 'Colegio Técnico República de Colombia',
    titulo: 'Bachiller Técnico en Informática',
    nivel_educativo: 'Media Técnica',
    fecha_inicio: '2017-02-01',
    fecha_fin: '2022-11-25',
    en_curso: false,
    descripcion: 'Fundamentos de computación, algoritmos, mantenimiento de hardware y ofimática avanzada.'
  }
];

export const mockExperiencia = [
  {
    id: 1,
    aprendiz_id: 1,
    empresa: 'Proyectos Académicos SENA',
    cargo: 'Desarrollador Web Junior (Proyecto Formativo)',
    tipo_experiencia: 'Practicante / Aprendiz',
    fecha_inicio: '2024-02-01',
    fecha_fin: '2024-11-30',
    en_curso: false,
    descripcion: 'Diseño e implementación de un portal de inventarios utilizando React, CSS Grid/Flexbox y APIs RESTful.'
  }
];

export const mockHabilidades = [
  { id: 1, aprendiz_id: 1, nombre: 'React.js', nivel: 'Avanzado', categoria: 'Técnica' },
  { id: 2, aprendiz_id: 1, nombre: 'JavaScript (ES6+)', nivel: 'Avanzado', categoria: 'Técnica' },
  { id: 3, aprendiz_id: 1, nombre: 'HTML5 & CSS3', nivel: 'Avanzado', categoria: 'Técnica' },
  { id: 4, aprendiz_id: 1, nombre: 'Node.js & Express', nivel: 'Intermedio', categoria: 'Técnica' },
  { id: 5, aprendiz_id: 1, nombre: 'Git & GitHub', nivel: 'Avanzado', categoria: 'Herramienta' },
  { id: 6, aprendiz_id: 1, nombre: 'Bases de Datos MySQL', nivel: 'Intermedio', categoria: 'Técnica' },
  { id: 7, aprendiz_id: 1, nombre: 'Trabajo en Equipo', nivel: 'Avanzado', categoria: 'Blanda' },
  { id: 8, aprendiz_id: 1, nombre: 'Resolución de Problemas', nivel: 'Avanzado', categoria: 'Blanda' }
];

export const mockEmpresas = [
  {
    id: 1,
    user_id: 4,
    razon_social: 'TechSolutions Colombia S.A.S.',
    nit: '901.345.678-9',
    sector_economico: 'Tecnología y Software',
    tamano_empresa: 'Mediana (51-200 empleados)',
    descripcion: 'Empresa líder en desarrollo de soluciones digitales y consultoría en la nube para el sector financiero y retail.',
    sitio_web: 'https://techsolutions.co',
    email_contacto: 'contacto@techsolutions.co',
    telefono_contacto: '6017894561',
    direccion: 'Cra 15 # 93-60 Of. 402',
    ciudad: 'Bogotá',
    estado: 'APROBADA',
    logo_url: null,
    total_vacantes: 4
  },
  {
    id: 2,
    user_id: 5,
    razon_social: 'InnovaTech S.A.S.',
    nit: '900.876.543-2',
    sector_economico: 'Telecomunicaciones y Redes',
    tamano_empresa: 'Grande (más de 200 empleados)',
    descripcion: 'Pioneros en infraestructura de telecomunicaciones y soporte de misión crítica en el eje cafetero y Antioquia.',
    sitio_web: 'https://innovatech.com',
    email_contacto: 'talento@innovatech.com',
    telefono_contacto: '6043219870',
    direccion: 'Calle 10 # 43E-12',
    ciudad: 'Medellín',
    estado: 'APROBADA',
    logo_url: null,
    total_vacantes: 2
  },
  {
    id: 3,
    user_id: 6,
    razon_social: 'Grupo Digital Andino S.A.S.',
    nit: '901.654.321-0',
    sector_economico: 'Marketing Digital y Medios',
    tamano_empresa: 'Pequeña (11-50 empleados)',
    descripcion: 'Agencia de contenidos, diseño digital y estrategias de inbound marketing para Latinoamérica.',
    sitio_web: 'https://grupodigital.com',
    email_contacto: 'rrhh@grupodigital.com',
    telefono_contacto: '6024567890',
    direccion: 'Av 6N # 24N-10',
    ciudad: 'Cali',
    estado: 'PENDIENTE',
    logo_url: null,
    total_vacantes: 0
  }
];

export const mockVacantes = [
  {
    id: 1,
    empresa_id: 1,
    empresa_nombre: 'TechSolutions Colombia S.A.S.',
    titulo: 'Desarrollador Frontend React Junior (Contrato de Aprendizaje)',
    descripcion: 'Buscamos aprendiz SENA de programas de desarrollo de software o afines para vincularse en etapa productiva mediante contrato de aprendizaje. Participarás en la construcción de interfaces web modernas con React, consumo de APIs REST y maquetación accesible.',
    modalidad: 'Híbrido',
    ubicacion: 'Bogotá, D.C.',
    tipo_contrato: 'Contrato de Aprendizaje',
    salario: '$1.423.500 (100% SMMLV + EPS + ARL)',
    fecha_publicacion: '2025-02-15',
    fecha_cierre: '2025-03-30',
    estado: 'Publicada',
    requisitos: 'Estar cursando etapa práctica del programa ADSO o similares. Manejo básico-intermedio de React, CSS3 y Git. Buena disposición para el trabajo colaborativo.',
    beneficios: 'Día de home office, auxilio de conectividad, plan de capacitación técnica, oportunidad de contratación a término indefinido tras la etapa práctica.',
    cupos: 2,
    postulaciones_count: 5
  },
  {
    id: 2,
    empresa_id: 1,
    empresa_nombre: 'TechSolutions Colombia S.A.S.',
    titulo: 'Analista de Soporte Técnico y Redes',
    descripcion: 'Oportunidad para tecnólogos en mantenimiento de equipos de cómputo y redes del SENA. Brindarás soporte a usuarios internos y mantenimiento preventivo.',
    modalidad: 'Presencial',
    ubicacion: 'Bogotá, D.C.',
    tipo_contrato: 'Contrato de Aprendizaje',
    salario: '$1.423.500 + Prestaciones de ley',
    fecha_publicacion: '2025-02-18',
    fecha_cierre: '2025-04-15',
    estado: 'Publicada',
    requisitos: 'Conocimientos en sistemas operativos Windows/Linux, redes LAN y ensamble de equipos.',
    beneficios: 'Capacitación en certificaciones Microsoft, excelente clima laboral.',
    cupos: 1,
    postulaciones_count: 3
  },
  {
    id: 3,
    empresa_id: 2,
    empresa_nombre: 'InnovaTech S.A.S.',
    titulo: 'Auxiliar Administrativo / Gestión Documental',
    descripcion: 'Vacante para aprendices de Gestión Administrativa o Asistencia Administrativa. Apoyo en digitalización documental, archivo y gestión de correspondencia.',
    modalidad: 'Presencial',
    ubicacion: 'Medellín, Antioquia',
    tipo_contrato: 'Contrato de Aprendizaje',
    salario: '$1.423.500 (Apoyo de sostenimiento)',
    fecha_publicacion: '2025-02-20',
    fecha_cierre: '2025-03-25',
    estado: 'Publicada',
    requisitos: 'Manejo intermedio de Excel y herramientas ofimáticas. Habilidad de comunicación asertiva.',
    beneficios: 'Almuerzo cubierto por la empresa, horario flexible los viernes.',
    cupos: 3,
    postulaciones_count: 8
  },
  {
    id: 4,
    empresa_id: 2,
    empresa_nombre: 'InnovaTech S.A.S.',
    titulo: 'Desarrollador Backend Node.js / Express',
    descripcion: 'Participa en el desarrollo de microservicios e integraciones para clientes enterprise. Buscamos aprendices con curiosidad por arquitecturas modernas y bases de datos.',
    modalidad: 'Remoto',
    ubicacion: 'Nacional (Remoto Colombia)',
    tipo_contrato: 'Contrato de Aprendizaje',
    salario: '$1.600.000 (Apoyo superior al mínimo)',
    fecha_publicacion: '2025-02-25',
    fecha_cierre: '2025-04-20',
    estado: 'Publicada',
    requisitos: 'Conocimientos en Node.js, Express, bases de datos SQL o NoSQL. Interés por APIs y seguridad web.',
    beneficios: '100% remoto, equipo de cómputo proporcionado, mentoría 1-a-1 con ingenieros senior.',
    cupos: 2,
    postulaciones_count: 12
  },
  {
    id: 5,
    empresa_id: 1,
    empresa_nombre: 'TechSolutions Colombia S.A.S.',
    titulo: 'Diseñador UI/UX Junior',
    descripcion: 'Apoyo en el prototipado y pruebas de usabilidad de plataformas web y móviles con Figma.',
    modalidad: 'Híbrido',
    ubicacion: 'Bogotá, D.C.',
    tipo_contrato: 'Contrato de Aprendizaje',
    salario: '$1.423.500',
    fecha_publicacion: '2025-02-10',
    fecha_cierre: '2025-03-15',
    estado: 'Cerrada',
    requisitos: 'Portafolio con proyectos en Figma o Adobe XD, nociones de Design Systems.',
    beneficios: 'Licencia Figma profesional, horario adaptable.',
    cupos: 1,
    postulaciones_count: 6
  }
];

export const mockPostulaciones = [
  {
    id: 1,
    aprendiz_id: 1,
    vacante_id: 1,
    fecha_postulacion: '2025-02-16',
    estado: 'EN_REVISION',
    vacante_titulo: 'Desarrollador Frontend React Junior',
    empresa_nombre: 'TechSolutions Colombia S.A.S.',
    ubicacion: 'Bogotá, D.C.',
    tipo_contrato: 'Contrato de Aprendizaje',
    modalidad: 'Híbrido',
    aprendiz_nombre: 'Juan Camilo Pérez Silva',
    programa_formacion: 'Análisis y Desarrollo de Software (ADSO)',
    mensaje: 'Estoy muy interesado en participar en los proyectos de TechSolutions y aportar mis conocimientos en React.'
  },
  {
    id: 2,
    aprendiz_id: 1,
    vacante_id: 4,
    fecha_postulacion: '2025-02-26',
    estado: 'PRESELECCIONADO',
    vacante_titulo: 'Desarrollador Backend Node.js / Express',
    empresa_nombre: 'InnovaTech S.A.S.',
    ubicacion: 'Remoto Colombia',
    tipo_contrato: 'Contrato de Aprendizaje',
    modalidad: 'Remoto',
    aprendiz_nombre: 'Juan Camilo Pérez Silva',
    programa_formacion: 'Análisis y Desarrollo de Software (ADSO)',
    mensaje: 'Tengo experiencia en APIs REST con Node.js y deseo continuar formándome en tecnologías backend.'
  },
  {
    id: 3,
    aprendiz_id: 2,
    vacante_id: 3,
    fecha_postulacion: '2025-02-21',
    estado: 'FINALIZADO',
    vacante_titulo: 'Auxiliar Administrativo / Gestión Documental',
    empresa_nombre: 'InnovaTech S.A.S.',
    ubicacion: 'Medellín, Antioquia',
    tipo_contrato: 'Contrato de Aprendizaje',
    modalidad: 'Presencial',
    aprendiz_nombre: 'María Camila Gómez Restrepo',
    programa_formacion: 'Gestión Administrativa',
    mensaje: 'Cuento con disponibilidad inmediata para iniciar etapa productiva.'
  },
  {
    id: 4,
    aprendiz_id: 3,
    vacante_id: 2,
    fecha_postulacion: '2025-02-19',
    estado: 'ENVIADA',
    vacante_titulo: 'Analista de Soporte Técnico y Redes',
    empresa_nombre: 'TechSolutions Colombia S.A.S.',
    ubicacion: 'Bogotá, D.C.',
    tipo_contrato: 'Contrato de Aprendizaje',
    modalidad: 'Presencial',
    aprendiz_nombre: 'Carlos Andrés Rodríguez Niño',
    programa_formacion: 'Mantenimiento de Redes de Datos',
    mensaje: 'Interesado en la gestión de infraestructura y telecomunicaciones.'
  }
];

export const mockAdminStats = {
  totalAprendices: 1420,
  totalEmpresas: 185,
  vacantesActivas: 64,
  postulacionesTotales: 3890,
  tasaColocacion: '78.4%',
  empresasPendientes: 3,
  aprendicesPorPrograma: [
    { programa: 'ADSO', cantidad: 520 },
    { programa: 'Gestión Administrativa', cantidad: 380 },
    { programa: 'Redes y Telecomunicaciones', cantidad: 260 },
    { programa: 'Contabilidad y Finanzas', cantidad: 160 },
    { programa: 'Otros', cantidad: 100 }
  ],
  postulacionesPorMes: [
    { mes: 'Nov', total: 420 },
    { mes: 'Dic', total: 310 },
    { mes: 'Ene', total: 680 },
    { mes: 'Feb', total: 850 }
  ]
};

export const mockReportes = [
  {
    id: 1,
    tipo: 'Postulaciones por Programa',
    fecha_generacion: '2025-02-28',
    registros: 1250,
    estado: 'Completado'
  },
  {
    id: 2,
    tipo: 'Empresas Vinculadas y Vacantes',
    fecha_generacion: '2025-02-25',
    registros: 185,
    estado: 'Completado'
  },
  {
    id: 3,
    tipo: 'Efectividad de Colocación Laboral',
    fecha_generacion: '2025-02-20',
    registros: 890,
    estado: 'Completado'
  }
];
