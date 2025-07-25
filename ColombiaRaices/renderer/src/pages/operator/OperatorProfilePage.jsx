import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import OperatorHeader from '../../components/operator/OperatorHeader';
import { ROUTES } from '../../utils/constants';

const OperatorProfilePage = () => {
  const navigate = useNavigate();
  const [operatorInfo, setOperatorInfo] = useState({
    name: 'Operador Demo',
    email: 'operador@comunidad.com',
    phone: '+57 300 987 6543',
    community: 'Comunidad Wayuu',
    region: 'La Guajira',
    memberSince: '2023-08-20',
    totalExperiences: 4,
    totalReservations: 15,
    averageRating: 4.8,
    specialties: ['Turismo Cultural', 'Artesanías', 'Gastronomía Local'],
    description: 'Operador turístico comunitario especializado en experiencias auténticas de la cultura Wayuu.',
    certifications: ['Guía Turístico Certificado', 'Turismo Sostenible', 'Primeros Auxilios']
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...operatorInfo });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...operatorInfo });
  };

  const handleSave = () => {
    setOperatorInfo({ ...editForm });
    setIsEditing(false);
    // Aquí se haría la llamada a la API para guardar los cambios
    alert('✅ Perfil de operador actualizado correctamente');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...operatorInfo });
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
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    overflow: 'hidden'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #03222b 0%, #569079 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  };

  const sectionStyle = {
    padding: '30px',
    borderBottom: '1px solid #e2e8f0'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '10px'
  };

  return (
    <div style={containerStyle}>
      <OperatorHeader />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header del perfil */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px'
            }}>
              🏘️
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>
              {operatorInfo.name}
            </h1>
            <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
              Operador Turístico Comunitario
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '1rem', opacity: 0.8 }}>
              {operatorInfo.community} - {operatorInfo.region}
            </p>
          </div>

          {/* Estadísticas del operador */}
          <div style={{ 
            ...sectionStyle, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#03222b' }}>
                {operatorInfo.totalExperiences}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Experiencias Creadas</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#03222b' }}>
                {operatorInfo.totalReservations}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Reservas Gestionadas</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbd338' }}>
                ⭐ {operatorInfo.averageRating}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Calificación Promedio</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#569079' }}>
                {new Date().getFullYear() - new Date(operatorInfo.memberSince).getFullYear()}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Años de Experiencia</div>
            </div>
          </div>

          {/* Información personal */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#03222b' }}>📝 Información Personal</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#fbd338',
                    color: '#03222b',
                    border: 'none'
                  }}
                >
                  ✏️ Editar Perfil
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#03222b' }}>
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: '2px solid transparent' }}>
                    {operatorInfo.name}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#03222b' }}>
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: '2px solid transparent' }}>
                    {operatorInfo.email}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#03222b' }}>
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: '2px solid transparent' }}>
                    {operatorInfo.phone}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#03222b' }}>
                  Comunidad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.community}
                    onChange={(e) => handleInputChange('community', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: '2px solid transparent' }}>
                    {operatorInfo.community}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción del operador */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#03222b' }}>
                Descripción Profesional
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Describe tu experiencia como operador turístico comunitario..."
                />
              ) : (
                <div style={{ ...inputStyle, backgroundColor: '#f8f9fa', border: '2px solid transparent', minHeight: '80px' }}>
                  {operatorInfo.description}
                </div>
              )}
            </div>

            {/* Botones de acción en modo edición */}
            {isEditing && (
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  ✅ Guardar Cambios
                </button>
              </div>
            )}
          </div>

          {/* Especialidades */}
          <div style={sectionStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#03222b' }}>🎯 Especialidades</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {operatorInfo.specialties.map((specialty, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#fbd338',
                    color: '#03222b',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          <div style={sectionStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#03222b' }}>🏆 Certificaciones</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {operatorInfo.certifications.map((cert, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎓</span>
                  <span style={{ fontWeight: '500' }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div style={{ ...sectionStyle, borderBottom: 'none' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#03222b' }}>⚡ Acciones Rápidas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <button
                onClick={() => navigate(ROUTES.MANAGE_EXPERIENCES)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#03222b',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  textAlign: 'left'
                }}
              >
                📋 Gestionar Experiencias
              </button>
              <button
                onClick={() => navigate(ROUTES.PUBLISH_EXPERIENCE)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#569079',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  textAlign: 'left'
                }}
              >
                ➕ Crear Nueva Experiencia
              </button>
              <button
                onClick={() => navigate(ROUTES.OPERATOR_RESERVATIONS)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#fbd338',
                  color: '#03222b',
                  border: 'none',
                  padding: '15px 20px',
                  textAlign: 'left'
                }}
              >
                📅 Ver Reservas
              </button>
              <button
                onClick={() => navigate(ROUTES.OPERATOR_DASHBOARD)}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  textAlign: 'left'
                }}
              >
                🏠 Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorProfilePage;
