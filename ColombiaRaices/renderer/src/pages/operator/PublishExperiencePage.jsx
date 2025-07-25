import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import OperatorHeader from '../../components/operator/OperatorHeader';
import ExperienceForm from '../../components/forms/ExperienceForm';
import { ROUTES } from '../../utils/constants';

const PublishExperiencePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);  const handleSubmit = async (experienceData) => {
    setIsLoading(true);
    try {
      // Obtener datos del usuario actual desde localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!userData.id) {
        throw new Error('Usuario no autenticado');
      }

      // Preparar datos completos para la experiencia
      const completeExperienceData = {
        ...experienceData,
        operator_id: userData.id,
        community_id: userData.community_id || 1, // TODO: Obtener de perfil de usuario
      };

      console.log('Creando experiencia:', completeExperienceData);

      // Llamar al API para crear la experiencia
      if (window.electronAPI && window.electronAPI.experiences) {
        const result = await window.electronAPI.experiences.create(completeExperienceData);
        
        if (result.success) {
          alert('¡Experiencia enviada para revisión! Será publicada una vez sea aprobada por el administrador.');
          navigate(ROUTES.OPERATOR_DASHBOARD);
        } else {
          throw new Error(result.error || 'Error al crear la experiencia');
        }
      } else {
        // Fallback para desarrollo
        console.log('ElectronAPI no disponible, simulando creación');
        alert('Experiencia guardada exitosamente (modo desarrollo)');
        navigate(ROUTES.OPERATOR_DASHBOARD);
      }
    } catch (error) {
      console.error('Error al guardar experiencia:', error);
      alert(`Error al guardar la experiencia: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.');
    if (confirmCancel) {
      navigate(ROUTES.OPERATOR_DASHBOARD);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <OperatorHeader currentPage="publish" />
      
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
            📝 Publicar Nueva Experiencia
          </h1>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '30px', 
            fontSize: '1.1rem' 
          }}>
            Comparte una experiencia auténtica de tu comunidad con viajeros de todo el mundo
          </p>
        </div>

        <ExperienceForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PublishExperiencePage;
