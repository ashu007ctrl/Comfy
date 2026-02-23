import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

    // Set up axios defaults
    axios.defaults.withCredentials = true; // Send cookies (refresh token)

    useEffect(() => {
        // Axios interceptor for handling token expiration
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Stop infinite loops: If the original request WAS the refresh endpoint, don't try to refresh again
                    if (originalRequest.url?.includes('/api/auth/refresh')) {
                        return Promise.reject(error);
                    }

                    try {
                        const { data } = await axios.post(`${API_URL}/api/auth/refresh`);
                        const newToken = data.data.accessToken;
                        setToken(newToken);

                        // Update defaults for future requests
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        // Update the original failed request with the new token
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (err) {
                        console.error('Refresh token failed, user logged out', err);
                        setUser(null);
                        setToken(null);
                        delete axios.defaults.headers.common['Authorization'];
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [API_URL]);

    useEffect(() => {
        const verifySession = async () => {
            try {
                // Try to get a new access token using the http-only refresh cookie
                const { data } = await axios.post(`${API_URL}/api/auth/refresh`);
                const newToken = data.data.accessToken;
                setToken(newToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                // Fetch user data
                const userRes = await axios.get(`${API_URL}/api/auth/me`);
                setUser(userRes.data.data);
            } catch (error) {
                console.log("No active session.");
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, [API_URL]);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        setUser(data.data.user);
        setToken(data.data.accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
        setUser(data.data.user);
        setToken(data.data.accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
        return data;
    };

    const logout = async () => {
        try {
            await axios.get(`${API_URL}/api/auth/logout`);
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
