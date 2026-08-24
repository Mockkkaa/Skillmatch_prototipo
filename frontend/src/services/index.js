import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const aprendizService = {
  get: (id) => api.get(`/aprendices/${id}`),
  update: (id, data) => api.put(`/aprendices/${id}`, data),
  uploadFoto: (id, formData) => api.post(`/aprendices/${id}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const hojaVidaService = {
  getByAprendiz: (aprendizId) => api.get(`/hojas-vida/aprendiz/${aprendizId}`),
  get: (id) => api.get(`/hojas-vida/${id}`),
  update: (id, data) => api.put(`/hojas-vida/${id}`, data),
};

export const formacionService = {
  list: (aprendizId) => api.get('/formacion', { params: { aprendiz_id: aprendizId } }),
  create: (data) => api.post('/formacion', data),
  update: (id, data) => api.put(`/formacion/${id}`, data),
  delete: (id) => api.delete(`/formacion/${id}`),
};

export const experienciaService = {
  list: (aprendizId) => api.get('/experiencias', { params: { aprendiz_id: aprendizId } }),
  create: (data) => api.post('/experiencias', data),
  update: (id, data) => api.put(`/experiencias/${id}`, data),
  delete: (id) => api.delete(`/experiencias/${id}`),
};

export const habilidadesService = {
  list: (aprendizId) => api.get('/habilidades', { params: { aprendiz_id: aprendizId } }),
  create: (data) => api.post('/habilidades', data),
  delete: (id) => api.delete(`/habilidades/${id}`),
};

export const vacanteService = {
  list: (params) => api.get('/vacantes', { params }),
  get: (id) => api.get(`/vacantes/${id}`),
  create: (data) => api.post('/vacantes', data),
  update: (id, data) => api.put(`/vacantes/${id}`, data),
  delete: (id) => api.delete(`/vacantes/${id}`),
  misVacantes: () => api.get('/vacantes/mis-vacantes'),
};

export const postulacionService = {
  list: (params) => api.get('/postulaciones', { params }),
  create: (data) => api.post('/postulaciones', data),
  updateEstado: (id, data) => api.put(`/postulaciones/${id}`, data),
};

export const empresaService = {
  register: (data) => api.post('/empresas/register', data),
  miEmpresa: () => api.get('/empresas/mi-empresa'),
  list: (params) => api.get('/empresas', { params }),
  get: (id) => api.get(`/empresas/${id}`),
  update: (id, data) => api.put(`/empresas/${id}`, data),
  aprobar: (id) => api.put(`/empresas/${id}/aprobar`),
  rechazar: (id, data) => api.put(`/empresas/${id}/rechazar`, data),
};

export const userService = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  activar: (id) => api.put(`/users/${id}/activar`),
  desactivar: (id) => api.put(`/users/${id}/desactivar`),
  getProgramas: () => api.get('/users/programas'),
};

export const reporteService = {
  get: () => api.get('/reportes'),
};
