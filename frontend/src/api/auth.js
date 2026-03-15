import axios from 'axios';

const API_URL = '/api/users';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, { username, password });
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('organization_name', response.data.organization_name);
    localStorage.setItem('agency_type', response.data.agency_type);
    localStorage.setItem('district', response.data.district);
    localStorage.setItem('taluk', response.data.taluk);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('organization_name');
  localStorage.removeItem('agency_type');
  localStorage.removeItem('district');
  localStorage.removeItem('taluk');
};

export const getAuthData = () => {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    username: localStorage.getItem('username'),
    organization_name: localStorage.getItem('organization_name'),
    agency_type: localStorage.getItem('agency_type'),
    district: localStorage.getItem('district'),
    taluk: localStorage.getItem('taluk')
  };
};
