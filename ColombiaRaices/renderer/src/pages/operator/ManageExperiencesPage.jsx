import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import OperatorHeader from '../../components/operator/OperatorHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const ManageExperiencesPage = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar experiencias del operador al montar el componente
  useEffect(() => {
    loadOperatorExperiences();
  }, []);

  const loadOperatorExperiences = async () => {
    setLoading(true);
    setError(null);
      try {
      // Obtener datos del usuario actual
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('Cargando experiencias del operador:', userData.id);

      // Llamar al API para obtener experiencias del operador
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getByOperator({ 
          operatorId: userData.id 
        });
        
        if (result.success) {
          setExperiences(result.experiences || []);
          console.log('Experiencias cargadas:', result.experiences?.length || 0);
        } else {
          throw new Error(result.error || 'Error al cargar experiencias');
        }
      } else {
        // Fallback para desarrollo
        console.warn('ElectronAPI no disponible, usando datos mock');
        setExperiences([]);
      }
    } catch (error) {
      console.error('Error cargando experiencias:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (experienceId) => {
    // Navegar a la página de edición
    navigate(`${ROUTES.EDIT_EXPERIENCE}/${experienceId}`);
  };
  const handleDelete = async (experienceId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta experiencia? Esta acción no se puede deshacer.');
    
    if (!confirmDelete) return;

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.delete({
          experienceId,
          operatorId: userData.id,
          isAdmin: false
        });
        
        if (result.success) {
          alert('Experiencia eliminada exitosamente');
          // Recargar la lista
          loadOperatorExperiences();
        } else {
          throw new Error(result.error || 'Error al eliminar experiencia');
        }
      } else {
        console.warn('ElectronAPI no disponible, simulando eliminación');
        alert('Experiencia eliminada (modo desarrollo)');
      }
    } catch (error) {
      console.error('Error eliminando experiencia:', error);
      alert(`Error al eliminar experiencia: ${error.message}`);
    }
  };

  const getStatusBadge = (isActive) => {
    const status = isActive ? 'Aprobada' : 'Pendiente';
    const color = isActive ? '#28a745' : '#ffc107';
    const textColor = isActive ? 'white' : '#212529';
    
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: color,
        color: textColor
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <OperatorHeader currentPage="manage" />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <OperatorHeader currentPage="manage" />
      
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h1 style={{ 
            color: '#03222b', 
            marginBottom: '10px',
            fontSize: '2rem'
          }}>
            📋 Mis Experiencias Publicadas
          </h1>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '30px', 
            fontSize: '1.1rem' 
          }}>
            Gestiona y actualiza las experiencias que has publicado
          </p>

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              Error: {error}
              <button 
                onClick={loadOperatorExperiences}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {experiences.length === 0 ? (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '40px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px dashed #dee2e6'
            }}>
              <h3 style={{ color: '#666', marginBottom: '15px' }}>
                📝 No has publicado experiencias aún
              </h3>
              <p style={{ color: '#888', marginBottom: '20px' }}>
                Comparte las experiencias auténticas de tu comunidad con viajeros de todo el mundo
              </p>
              <button
                onClick={() => navigate(ROUTES.PUBLISH_EXPERIENCE)}
                style={{
                  backgroundColor: '#fbd338',
                  color: '#03222b',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Publicar Primera Experiencia
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Header de la card */}
                  <div style={{
                    padding: '20px 20px 15px',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{
                        color: '#03222b',
                        fontSize: '1.2rem',
                        margin: 0,
                        lineHeight: '1.3',
                        flex: 1,
                        marginRight: '15px'
                      }}>
                        {experience.title}
                      </h3>
                      {getStatusBadge(experience.is_active)}
                    </div>
                    
                    <p style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {experience.description?.length > 100 
                        ? `${experience.description.substring(0, 100)}...`
                        : experience.description
                      }
                    </p>
                  </div>

                  {/* Información de la experiencia */}
                  <div style={{ padding: '15px 20px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>Tipo:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.type}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>Precio:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {formatCurrency(experience.price)}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>Duración:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.duration_hours} horas
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>Max. personas:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.max_participants}
                        </p>
                      </div>
                    </div>                    {experience.specific_location && (
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#03222b', fontSize: '0.9rem' }}>📍 Ubicación:</strong>
                        <p style={{ margin: '2px 0 0', color: '#666', fontSize: '0.9rem' }}>
                          {experience.specific_location}
                        </p>
                      </div>
                    )}

                    {/* Fechas */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#888'
                      }}>
                        <span>Creada: {new Date(experience.created_at).toLocaleDateString()}</span>
                        {experience.updated_at && experience.updated_at !== experience.created_at && (
                          <span>Actualizada: {new Date(experience.updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => handleEdit(experience.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#138496';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#17a2b8';
                        }}
                      >
                        ✏️ Editar
                      </button>
                      
                      <button
                        onClick={() => handleDelete(experience.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#c82333';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#dc3545';
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón para agregar nueva experiencia */}
          {experiences.length > 0 && (
            <div style={{
              textAlign: 'center',
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button
                onClick={() => navigate(ROUTES.PUBLISH_EXPERIENCE)}
                style={{
                  backgroundColor: '#fbd338',
                  color: '#03222b',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f2c832';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fbd338';
                }}
              >
                ➕ Publicar Nueva Experiencia
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageExperiencesPage;
