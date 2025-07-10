import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1/easysign';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required if using cookies
});

// Attach JWT token from localStorage to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password });
    return response.data;
  },
};

export const documentsAPI = {
  getMyDocuments: async () => {
    const response = await api.get('/fetch/file');
    return response.data;
  },

  getSharedDocuments: async () => {
    const response = await api.get('/shared');
    return response.data;
  },

  uploadDocument: async (formData) => {
    const response = await api.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  signDocument: async (documentId, signatureCanvas) => {
    const response = await api.post('/sign/file', { documentId, signatureCanvas });
    return response.data;
  },

  shareDocument: async (formData) => {
    const response = await api.post('/share/file', formData);
    return response.data;
  },

  getFileById: async (id) => {
    const response = await api.get(`/file/${id}`);
    return response.data.file;
  },

  annotateSignature: async (documentId, x, y, page, signatureCanvas) => {
    const response = await api.post('/annotate-signature', {
      documentId,
      x,
      y,
      page,
      signatureCanvas,
    });
    return response.data;
  },
};

export const signatureAPI = {
  uploadSignature: async (formData) => {
    const response = await api.post('/upload/signature', formData);
    return response.data;
  },

  fetchSignature: async () => {
    const response = await api.get('/fetch/signature');
    return response.data;
  },

  annotateSignature: async (data) => {
    const response = await api.post('/annotate-signature', data);
    return response.data;
  },
};

export const downloadAPI = {
  downloadSignedPDF: async (fileId) => {
    const response = await api.get(`/download/${fileId}`);
    return response.data;
  },

  downloadTemplate: async (fileId) => {
    const response = await api.get(`/download-template/${fileId}`);
    return response.data;
  },

  downloadSignature: async (userId, fileId) => {
    const response = await api.get(`/download-signature/${userId}/${fileId}`);
    return response.data;
  },
};




export default api;
