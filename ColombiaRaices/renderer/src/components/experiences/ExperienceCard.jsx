// Componente de tarjeta para experiencias turísticas
import { useState } from "react";
import { EXPERIENCE_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import SimpleMap from '../maps/SimpleMap';

const ExperienceCard = ({ experience }) => {
  const [showModal, setShowModal] = useState(false);
  
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
  };  const experienceTitle = experience.nombre || experience.title;
  const experienceDescription = experience.descripcion || experience.description;
  const experienceType = experience.tipo || experience.type;
  const experiencePrice = experience.precio || experience.price;
  const experienceLocation = experience.ubicacion || experience.community_name;
  const experienceRegion = experience.community_region;
  const experienceDuration = experience.duracion_horas || experience.duration;
  const experienceMaxParticipants = experience.max_participants || experience.maxParticipants;return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    }}>
      {/* Imagen de fondo real con icono overlay */}
      <div style={{ 
        height: '180px',
        backgroundImage: `url(${experience.image_url || `./images/experiences/experience_${experience.id}_thumbnail.jpg`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Overlay con ícono de categoría */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '6px 12px',
          fontSize: '1.1rem'
        }}>
          {getExperienceIcon(experience)}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div style={{ padding: '20px' }}>        {/* Header con título y tipo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#03222b',
            margin: 0,
            lineHeight: '1.3',
            flex: 1
          }}>
            {experienceTitle}
          </h3>
          <span style={{
            backgroundColor: getExperienceTypeColor(experienceType).includes('yellow') ? '#fbd338' : 
                           getExperienceTypeColor(experienceType).includes('orange') ? '#f97316' : '#10b981',
            color: getExperienceTypeColor(experienceType).includes('yellow') ? '#03222b' : 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            marginLeft: '8px',
            whiteSpace: 'nowrap'
          }}>
            {experienceType}
          </span>
        </div>        {/* Descripción */}
        <p style={{ 
          color: '#666',
          marginBottom: '16px',
          lineHeight: '1.4',
          fontSize: '0.9rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {experienceDescription}
        </p>{/* Información básica */}
        <div style={{ marginBottom: '16px' }}>
          {/* Ubicación y duración */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>📍</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                {experienceLocation}{experienceRegion && `, ${experienceRegion}`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>⏱️</span>
              <span>{experienceDuration}h</span>
            </div>
          </div>          {/* Participantes, rating y mapa */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>👥</span>
              <span>Hasta {experienceMaxParticipants || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#fbbf24', marginRight: '4px' }}>⭐</span>
                <span style={{ color: '#666', fontSize: '0.8rem' }}>
                  {experience.rating || '4.5'}
                </span>
              </div>
              <SimpleMap experience={experience} variant="small" />
            </div>
          </div>
        </div>        
        {/* Footer con precio y botón */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#666', 
              margin: '0 0 4px 0' 
            }}>
              Precio desde
            </p>
            <span style={{ 
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#03222b'
            }}>
              {formatCurrency(experiencePrice)}
            </span>
          </div>          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#fbd338',
              color: '#03222b',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f2c832';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#fbd338';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Ver Detalles          </button>        </div>
      </div>      {/* Modal compacto y funcional */}
      {showModal && (        <div style={{
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
        onClick={(e) => {
          // Cerrar modal al hacer clic en el fondo
          if (e.target === e.currentTarget) {
            setShowModal(false);
          }
        }}><div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e5e7eb',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '85vh',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Botón cerrar - SIEMPRE VISIBLE */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'white',
                padding: '8px',
                borderRadius: '50%',
                lineHeight: 1,
                zIndex: 1002,
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.9)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.8)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            {/* Contenido del modal con scroll completo */}
            <div style={{
              overflowY: 'auto',
              maxHeight: '85vh',
              scrollBehavior: 'smooth'
            }}>            {/* Imagen de la experiencia */}
            <div style={{ 
              height: '200px',
              backgroundImage: `url(./images/experiences/experience_${experience.id}_thumbnail.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              {/* Ícono overlay */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px',
                padding: '8px 12px',
                fontSize: '1.2rem'
              }}>
                {getExperienceIcon(experience)}
              </div>

              {/* Badge de tipo */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: getExperienceTypeColor(experienceType).includes('yellow') ? '#fbd338' : 
                               getExperienceTypeColor(experienceType).includes('orange') ? '#f97316' : '#10b981',
                color: getExperienceTypeColor(experienceType).includes('yellow') ? '#03222b' : 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {experienceType}
              </div>
            </div>

            {/* Contenido de texto del modal */}
            <div style={{ padding: '24px' }}>
              {/* Título */}
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#03222b',
                marginBottom: '12px',
                lineHeight: '1.3'
              }}>
                {experienceTitle}
              </h2>              {/* Ubicación */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#666',
                fontSize: '0.9rem',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '6px' }}>📍</span>
                  <span>{experienceLocation}{experienceRegion && `, ${experienceRegion}`}</span>
                </div>                <SimpleMap 
                  experience={experience}
                  variant="button"
                />
              </div>

              {/* Descripción */}
              <p style={{
                color: '#666',
                lineHeight: '1.5',
                fontSize: '0.9rem',
                marginBottom: '20px'
              }}>
                {experienceDescription}
              </p>

              {/* Información en grid compacto */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⏱️</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Duración</div>
                  <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>{experienceDuration}h</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>👥</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Máx.</div>
                  <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>{experienceMaxParticipants || 'N/A'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⭐</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Rating</div>
                  <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>{experience.rating || '4.5'}/5</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>💰</div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Precio</div>
                  <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>
                    {formatCurrency(experiencePrice)}
                  </div>
                </div>
              </div>

              {/* Información de comunidad */}
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3cd',
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid #fbbf24'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: '4px'
                }}>
                  🏘️ Comunidad Anfitriona
                </div>
                <div style={{
                  color: '#92400e',
                  fontSize: '0.75rem',
                  lineHeight: '1.3'
                }}>
                  Ofrecida por <strong>{experienceLocation}</strong>
                </div>
              </div>              {/* Botón de mapa */}
              <SimpleMap
                experience={experience}
                variant="button"
              />

              {/* Botón de reserva */}
              <button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  marginTop: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                }}
                onClick={() => {
                  alert('🚧 Sistema de reservas en desarrollo.\n\nPronto podrás reservar esta experiencia directamente desde aquí.');
                }}
              >                💼 Reservar Experiencia
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;