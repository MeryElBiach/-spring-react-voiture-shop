import axiosInstance from './axiosConfig';

export const login = async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    // Stocke le token
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};