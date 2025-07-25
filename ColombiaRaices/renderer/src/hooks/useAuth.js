
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gestionar autenticación
 * Conecta con AuthService del main process via IPC
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Verificar estado de autenticación actual
   */
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      setError('Error al verificar sesión');
      // Limpiar datos corruptos
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };
  /**
   * Iniciar sesión
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // Verificar si window.electronAPI está disponible
      if (window.electronAPI && window.electronAPI.auth) {
        // Usar IPC para comunicarse con el main process
        const result = await window.electronAPI.auth.login({ email, password });
        
        if (result.success) {
          setUser(result.user);
          setToken(result.token);
          setIsAuthenticated(true);
          
          // Guardar en localStorage para persistencia
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));
          
          return result;
        } else {
          throw new Error(result.error || 'Error en el login');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando modo de desarrollo');
          // Mock de usuario para desarrollo
        const mockUser = {
          id: '1',
          email: email,
          name: 'Usuario Test',
          userType: email.includes('operator') ? 'operador' : 'viajero'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthenticated(true);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        return { success: true, user: mockUser, token: mockToken };
      }
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  /**
   * Registrar nuevo usuario
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Todos los campos son requeridos');
      }

      // Verificar si window.electronAPI está disponible
      if (window.electronAPI && window.electronAPI.auth) {
        // Usar IPC para comunicarse con el main process
        const result = await window.electronAPI.auth.register(userData);
        
        if (result.success) {
          setUser(result.user);
          setToken(result.token);
          setIsAuthenticated(true);
          
          // Guardar en localStorage para persistencia
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));
          
          return result;
        } else {
          throw new Error(result.error || 'Error en el registro');
        }
      } else {
        // Fallback para desarrollo web
        console.warn('ElectronAPI no disponible, usando modo de desarrollo');
          // Mock de usuario para desarrollo
        const mockUser = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          userType: userData.userType || 'viajero'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        setIsAuthenticated(true);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        return { success: true, user: mockUser, token: mockToken };
      }
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (window.electronAPI && window.electronAPI.auth && user) {
        // Usar IPC para comunicarse con el main process
        await window.electronAPI.auth.logout({ userId: user.id });
      }
      
      // Limpiar estado local
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      console.error('Error during logout:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    } finally {
      setLoading(false);
    }  }, [user]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError
  };
};

export default useAuth;
