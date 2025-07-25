// Componente de modal expandido para experiencias turísticas
import { EXPERIENCE_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const ExperienceModal = ({ experience, isOpen, onClose }) => {
  if (!isOpen || !experience) return null;

  const getExperienceTypeColor = (type) => {
    switch (type) {
      case EXPERIENCE_TYPES.CULTURAL:
        return 'bg-yellow text-green';
      case EXPERIENCE_TYPES.HISTORICAL:
        return 'bg-orange text-white';
      case EXPERIENCE_TYPES.ECOLOGICAL:
        return 'bg-green text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getExperienceIcon = (experience) => {
    const name = experience.nombre?.toLowerCase() || experience.title?.toLowerCase() || '';
    const description = experience.descripcion?.toLowerCase() || experience.description?.toLowerCase() || '';
    
    if (name.includes('wayuu') || name.includes('indígena') || description.includes('cultura')) return '🏺';
    if (name.includes('histórico') || name.includes('colonial') || name.includes('patrimonio')) return '🏛️';
    if (name.includes('eco') || name.includes('naturaleza') || name.includes('biodiversidad')) return '🌿';
    if (name.includes('aventura') || name.includes('deportes')) return '🏃‍♂️';
    if (name.includes('gastronomía') || name.includes('comida')) return '🍽️';
    if (name.includes('artesanía') || name.includes('arte')) return '🎨';
    if (name.includes('música') || name.includes('danza')) return '🎵';
    return '✨';
  };

  const experienceTitle = experience.nombre || experience.title;
  const experienceDescription = experience.descripcion || experience.description;
  const experienceType = experience.tipo || experience.type;
  const experiencePrice = experience.precio || experience.price;
  const experienceLocation = experience.ubicacion || experience.community_name;
  const experienceRegion = experience.community_region;
  const experienceDuration = experience.duracion_horas || experience.duration;
  const experienceMaxParticipants = experience.max_participants || experience.maxParticipants;

  // Cerrar modal si se hace clic en el backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={handleBackdropClick}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e5e7eb',
        overflow: 'hidden',
        width: '900px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        position: 'relative'
      }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '8px',
            borderRadius: '50%',
            lineHeight: 1,
            zIndex: 1001,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            e.target.style.color = '#333';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#666';
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', height: '500px' }}>
          {/* Imagen full de la experiencia - Lado izquierdo */}
          <div style={{ 
            flex: '1',
            backgroundImage: `url(./images/experiences/experience_${experience.id}_full.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            minHeight: '500px'
          }}>
            {/* Overlay con ícono */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '25px',
              padding: '10px 16px',
              fontSize: '1.8rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {getExperienceIcon(experience)}
            </div>

            {/* Badge de tipo */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: getExperienceTypeColor(experienceType).includes('yellow') ? '#fbd338' : 
                             getExperienceTypeColor(experienceType).includes('orange') ? '#f97316' : '#10b981',
              color: getExperienceTypeColor(experienceType).includes('yellow') ? '#03222b' : 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {experienceType}
            </div>
          </div>

          {/* Contenido de información - Lado derecho */}
          <div style={{ 
            flex: '1',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fafafa',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#03222b',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {experienceTitle}
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <span style={{ color: '#666', fontSize: '1rem' }}>
                  📍 {experienceLocation}{experienceRegion && `, ${experienceRegion}`}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '24px', flex: '1' }}>
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: 0
              }}>
                {experienceDescription}
              </p>
            </div>

            {/* Grid de información */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>⏱️</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Duración</div>
                <div style={{ fontWeight: '600', color: '#03222b' }}>{experienceDuration} horas</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👥</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Participantes</div>
                <div style={{ fontWeight: '600', color: '#03222b' }}>Hasta {experienceMaxParticipants || 'N/A'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>⭐</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Calificación</div>
                <div style={{ fontWeight: '600', color: '#03222b' }}>{experience.rating || '4.5'}/5</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💰</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Precio desde</div>
                <div style={{ fontWeight: '600', color: '#03222b', fontSize: '1.1rem' }}>
                  {formatCurrency(experiencePrice)}
                </div>
              </div>
            </div>

            {/* Información de la comunidad */}
            <div style={{
              padding: '16px',
              backgroundColor: '#fef3cd',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fbbf24'
            }}>
              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#92400e',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🏘️ Comunidad Anfitriona
              </h3>
              <p style={{
                color: '#92400e',
                fontSize: '0.85rem',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Ofrecida por la comunidad de <strong>{experienceLocation}</strong>
                {experienceRegion && ` en ${experienceRegion}`}.
              </p>
            </div>

            {/* Botón de reserva */}
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '2px solid #10b981',
              textAlign: 'center'
            }}>
              <button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                }}
                onClick={() => {
                  alert('🚧 Sistema de reservas en desarrollo.\n\nPronto podrás reservar esta experiencia directamente desde aquí.');
                }}
              >
                💼 Reservar Experiencia
              </button>
              <p style={{
                color: '#059669',
                fontSize: '0.8rem',
                margin: '8px 0 0 0',
                fontStyle: 'italic'
              }}>
                Sistema de reservas próximamente disponible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
