import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import OperatorHeader from '../../components/operator/OperatorHeader';
import ExperienceForm from '../../components/forms/ExperienceForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

const EditExperiencePage = () => {
  const navigate = useNavigate();
  const { experienceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [experienceData, setExperienceData] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos de la experiencia al montar el componente
  useEffect(() => {
    loadExperienceData();
  }, [experienceId]);
  const loadExperienceData = async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.id) {
        throw new Error('Usuario no autenticado');
      }

      if (!experienceId) {
        throw new Error('ID de experiencia no proporcionado');
      }

      console.log('Cargando datos de experiencia:', experienceId);

      // Obtener todas las experiencias del operador y buscar la específica
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.getByOperator({ 
          operatorId: userData.id 
        });
        
        if (result.success) {
          const experience = result.experiences?.find(exp => exp.id === parseInt(experienceId));
          
          if (experience) {
            setExperienceData(experience);
            console.log('Experiencia cargada:', experience);
          } else {
            throw new Error('Experiencia no encontrada o no tienes permisos para editarla');
          }
        } else {
          throw new Error(result.error || 'Error al cargar experiencia');
        }
      } else {
        throw new Error('API no disponible');
      }
    } catch (error) {
      console.error('Error cargando experiencia:', error);
      setError(error.message);
    } finally {
      setIsLoadingData(false);
    }
  };
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('Actualizando experiencia:', experienceId, formData);

      // Llamar al API para actualizar la experiencia
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.update({
          experienceId: parseInt(experienceId),
          updateData: formData,
          operatorId: userData.id,
          isAdmin: false
        });
        
        if (result.success) {
          alert('¡Experiencia actualizada exitosamente!');
          navigate(ROUTES.MANAGE_EXPERIENCES);
        } else {
          throw new Error(result.error || 'Error al actualizar la experiencia');
        }
      } else {
        // Fallback para desarrollo
        console.log('ElectronAPI no disponible, simulando actualización');
        alert('Experiencia actualizada exitosamente (modo desarrollo)');
        navigate(ROUTES.MANAGE_EXPERIENCES);
      }
    } catch (error) {
      console.error('Error al actualizar experiencia:', error);
      alert(`Error al actualizar la experiencia: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.');
    if (confirmCancel) {
      navigate(ROUTES.MANAGE_EXPERIENCES);
    }
  };

  // Mostrar loading mientras cargan los datos
  if (isLoadingData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <OperatorHeader currentPage="manage" />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '20px', color: '#666' }}>
            Cargando datos de la experiencia...
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se pudo cargar
  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <OperatorHeader currentPage="manage" />
        <div style={{ 
          padding: '20px', 
          maxWidth: '900px', 
          margin: '0 auto' 
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              color: '#dc3545', 
              marginBottom: '20px',
              fontSize: '1.5rem'
            }}>
              ❌ Error al cargar experiencia
            </h1>
            
            <p style={{ 
              color: '#666', 
              marginBottom: '30px', 
              fontSize: '1.1rem' 
            }}>
              {error}
            </p>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={loadExperienceData}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                🔄 Reintentar
              </button>
              
              <button
                onClick={() => navigate(ROUTES.MANAGE_EXPERIENCES)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                ← Volver a Mis Experiencias
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <OperatorHeader currentPage="manage" />
      
      <div style={{ 
        padding: '20px', 
        maxWidth: '900px', 
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
            ✏️ Editar Experiencia
          </h1>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '20px', 
            fontSize: '1.1rem' 
          }}>
            Actualiza la información de tu experiencia: <strong>{experienceData?.title}</strong>
          </p>

          {!experienceData?.is_active && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #ffeaa7'
            }}>
              <strong>⚠️ Nota:</strong> Esta experiencia está pendiente de aprobación. 
              Los cambios realizados también requerirán nueva aprobación.
            </div>
          )}
        </div>

        <ExperienceForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={experienceData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EditExperiencePage;
