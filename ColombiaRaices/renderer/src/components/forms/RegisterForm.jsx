import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'viajero' // Valor por defecto
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, error: authError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
    }    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = 'Selecciona el tipo de usuario';
    } else if (!['viajero', 'operador'].includes(formData.userType)) {
      newErrors.userType = 'Tipo de usuario no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        userType: formData.userType // Agregar tipo de usuario
      });
        if (result.success) {
        // Redirect based on user type
        if (result.user.userType === 'operador') {
          navigate(ROUTES.OPERATOR_DASHBOARD);
        } else {
          navigate(ROUTES.TRAVELER_DASHBOARD);
        }
      }
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '4px',
    transition: 'border-color 0.3s ease',
    outline: 'none'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#ff6b6b'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.darkGray
  };

  const errorStyle = {
    color: '#ff6b6b',
    fontSize: '12px',
    marginBottom: '12px',
    display: 'block'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    transition: 'all 0.3s ease',
    marginTop: '10px'
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0'
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    color: COLORS.darkGray,
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const authErrorStyle = {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #ffcdd2'
  };

  const passwordRequirementsStyle = {
    fontSize: '12px',
    color: COLORS.mediumGray,
    marginTop: '4px',
    lineHeight: '1.4'
  };

  return (
    <div style={formStyle}>
      <h2 style={titleStyle}>Crear Cuenta</h2>
      
      {authError && (
        <div style={authErrorStyle}>
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="name">
            Nombre Completo *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={errors.name ? errorInputStyle : inputStyle}
            placeholder="Ingresa tu nombre completo"
            disabled={isLoading}
          />
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={errors.email ? errorInputStyle : inputStyle}
            placeholder="ejemplo@correo.com"
            disabled={isLoading}
          />
          {errors.email && <span style={errorStyle}>{errors.email}</span>}        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="userType">
            Tipo de Usuario *
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            style={errors.userType ? errorInputStyle : inputStyle}
            disabled={isLoading}
          >
            <option value="viajero">🧳 Viajero</option>
            <option value="operador">🏘️ Operador Comunitario</option>
          </select>
          {errors.userType && <span style={errorStyle}>{errors.userType}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="password">
            Contraseña *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={errors.password ? errorInputStyle : inputStyle}
            placeholder="Crea una contraseña segura"
            disabled={isLoading}
          />
          {errors.password && <span style={errorStyle}>{errors.password}</span>}
          <div style={passwordRequirementsStyle}>
            Debe contener: 8+ caracteres, mayúscula, minúscula, número y símbolo
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle} htmlFor="confirmPassword">
            Confirmar Contraseña *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={errors.confirmPassword ? errorInputStyle : inputStyle}
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
          {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          style={buttonStyle}
          disabled={isLoading}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = COLORS.primaryHover;
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = COLORS.primary;
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {isLoading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
