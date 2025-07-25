import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TravelerHeader from '../../components/traveler/TravelerHeader';
import { ROUTES } from '../../utils/constants';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia',
    memberSince: '2024-01-15',
    totalReservations: 3,
    favoriteExperiences: 5
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...userInfo });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userInfo });
  };

  const handleSave = () => {
    setUserInfo({ ...editForm });
    setIsEditing(false);
    // Aquí se haría la llamada a la API para guardar los cambios
    alert('✅ Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...userInfo });
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    paddingBottom: '40px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    margin: '20px auto',
    maxWidth: '800px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 10px',
    transition: 'background-color 0.3s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    marginBottom: '10px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '10px'
  };

  return (
    <div style={containerStyle}>
      <TravelerHeader currentPage="profile" customTitle="Mi Perfil" />
      
      <div style={cardStyle}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px' 
        }}>
          <h1 style={{ color: '#007bff', margin: 0 }}>
            👤 Mi Perfil
          </h1>
          {!isEditing && (
            <button 
              style={primaryButtonStyle}
              onClick={handleEdit}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              ✏️ Editar Perfil
            </button>
          )}
        </div>

        {/* Estadísticas del Usuario */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px' 
        }}>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>📅</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {userInfo.totalReservations}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Reservas Totales</p>
          </div>
          
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>❤️</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {userInfo.favoriteExperiences}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Experiencias Favoritas</p>
          </div>
          
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>🗓️</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {new Date(userInfo.memberSince).toLocaleDateString('es-CO')}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Miembro Desde</p>
          </div>
        </div>

        {/* Información del Usuario */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px' 
        }}>
          <div>
            <label style={labelStyle}>Nombre Completo</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: 'none' }}>
                {userInfo.name}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Correo Electrónico</label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: 'none' }}>
                {userInfo.email}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: 'none' }}>
                {userInfo.phone}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Ubicación</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={inputStyle}
              />
            ) : (
              <p style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: 'none' }}>
                {userInfo.location}
              </p>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        {isEditing ? (
          <div style={{ textAlign: 'center' }}>
            <button 
              style={primaryButtonStyle}
              onClick={handleSave}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              ✅ Guardar Cambios
            </button>
            <button 
              style={secondaryButtonStyle}
              onClick={handleCancel}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              ❌ Cancelar
            </button>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #eee' 
          }}>
            <button 
              style={secondaryButtonStyle}
              onClick={() => navigate(ROUTES.TRAVELER_DASHBOARD)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              ⬅️ Volver al Dashboard
            </button>
            <button 
              style={{ ...primaryButtonStyle, backgroundColor: '#dc3545' }}
              onClick={() => navigate(ROUTES.RESERVATION_HISTORY)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              📋 Ver Mis Reservas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
