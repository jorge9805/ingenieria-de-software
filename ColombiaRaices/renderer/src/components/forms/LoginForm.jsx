
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const LoginForm = ({ onSuccess, onCancel }) => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  /**
   * Manejar cambios en los inputs
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores al escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);      if (result.success) {
        // Redirect based on user type
        if (result.user.userType === 'admin') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else if (result.user.userType === 'operador') {
          navigate(ROUTES.OPERATOR_DASHBOARD);
        } else {
          navigate(ROUTES.TRAVELER_DASHBOARD);
        }
        
        // Call onSuccess callback if provided
        onSuccess?.(result.user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          color: '#03222b', 
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          🔐 Iniciar Sesión
        </h2>
        <p style={{ 
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Accede a tu cuenta de Colombia Raíces
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#03222b',
            fontWeight: '500'
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `2px solid ${formErrors.email ? '#ff4444' : '#e0e0e0'}`,
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbd338';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = formErrors.email ? '#ff4444' : '#e0e0e0';
            }}
            placeholder="tu@email.com"
          />
          {formErrors.email && (
            <p style={{ color: '#ff4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {formErrors.email}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#03222b',
            fontWeight: '500'
          }}>
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `2px solid ${formErrors.password ? '#ff4444' : '#e0e0e0'}`,
              borderRadius: '8px',
              fontSize: '1rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbd338';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = formErrors.password ? '#ff4444' : '#e0e0e0';
            }}
            placeholder="••••••••"
          />
          {formErrors.password && (
            <p style={{ color: '#ff4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {formErrors.password}
            </p>
          )}
        </div>

        {/* Error general */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '1px solid #ff4444',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#ff4444', fontSize: '0.9rem', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : '#fbd338',
              color: '#03222b',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f2c832';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#fbd338';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? '🔄 Iniciando sesión...' : '🔐 Iniciar Sesión'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #e0e0e0',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#03222b';
              e.target.style.color = '#03222b';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.color = '#666';
            }}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Links adicionales */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? {' '}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fbd338',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            onClick={() => console.log('Navegar a registro')}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
