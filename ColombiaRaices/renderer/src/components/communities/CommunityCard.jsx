// Componente de tarjeta para comunidades turísticas
import { useState } from "react";
import { REGIONS } from '../../utils/constants';

const CommunityCard = ({ community }) => {
  const [showModal, setShowModal] = useState(false);
  
  const getCommunityIcon = (community) => {
    const name = community.name?.toLowerCase() || community.nombre?.toLowerCase() || '';
    const region = community.region?.toLowerCase() || '';
    
    if (name.includes('wayuu') || name.includes('kogui') || name.includes('misak') || name.includes('nasa')) return '🏺';
    if (name.includes('barichara') || name.includes('mompox') || region.includes('patrimonio')) return '🏛️';
    if (region.includes('chocó') || region.includes('amazonia') || name.includes('leticia')) return '🌿';
    if (name.includes('campesina') || name.includes('rural')) return '🌾';
    if (region.includes('caribe') || region.includes('guajira')) return '🏖️';
    return '🏘️';
  };

  const getRegionColor = (region) => {
    switch (region) {
      case REGIONS.GUAJIRA:
        return '#f97316'; // Naranja para Caribe
      case REGIONS.CHOCO:
        return '#10b981'; // Verde para Pacífico
      case REGIONS.AMAZONIA:
        return '#059669'; // Verde oscuro para Amazonía
      case REGIONS.BARICHARA:
        return '#fbbf24'; // Amarillo para Andina
      case REGIONS.MOMPOX:
        return '#f59e0b'; // Dorado para Colonial
      default:
        return '#6b7280'; // Gris por defecto
    }
  };

  const communityName = community.name || community.nombre;
  const communityDescription = community.description || community.descripcion;
  const communityRegion = community.region;
  const communityPopulation = community.population || community.poblacion;
  const communityFounded = community.founded || community.fundada;
  const communityExperiences = community.experiencesCount || community.experiencias_count || 0;
  const communityEmail = community.contact?.email || community.contact_email;
  const communityPhone = community.contact?.phone || community.contact_phone;

  return (
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
      {/* Imagen de fondo con icono overlay */}
      <div style={{ 
        height: '180px',
        backgroundImage: `url(${community.image_url || `./images/communities/community_${community.id}.jpg`})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Overlay con ícono de comunidad */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '6px 12px',
          fontSize: '1.1rem'
        }}>
          {getCommunityIcon(community)}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div style={{ padding: '20px' }}>
        {/* Header con nombre y región */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#03222b',
            margin: 0,
            lineHeight: '1.3',
            flex: 1
          }}>
            {communityName}
          </h3>
          <span style={{
            backgroundColor: getRegionColor(communityRegion),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            marginLeft: '8px',
            whiteSpace: 'nowrap'
          }}>
            {communityRegion}
          </span>
        </div>

        {/* Descripción */}
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
          {communityDescription}
        </p>

        {/* Información básica */}
        <div style={{ marginBottom: '16px' }}>
          {/* Población y fundación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>👥</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                {communityPopulation ? communityPopulation.toLocaleString() : 'N/A'} hab.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>📅</span>
              <span>{communityFounded || 'Ancestral'}</span>
            </div>
          </div>

          {/* Experiencias y contacto */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem' }}>
              <span style={{ marginRight: '4px' }}>🌟</span>
              <span>{communityExperiences} experiencias</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#10b981', marginRight: '4px' }}>📧</span>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>
                Contacto
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer con botón */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              cursor: 'pointer',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Ver Comunidad
          </button>
        </div>
      </div>

      {/* Modal compacto para comunidades */}
      {showModal && (
        <div style={{
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
        }}>
          <div style={{
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
            }}>
              {/* Imagen de la comunidad */}
              <div style={{ 
                height: '200px',
                backgroundImage: `url(./images/communities/community_${community.id}.jpg)`,
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
                  {getCommunityIcon(community)}
                </div>

                {/* Badge de región */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: getRegionColor(communityRegion),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {communityRegion}
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
                  {communityName}
                </h2>

                {/* Región */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666',
                  fontSize: '0.9rem',
                  marginBottom: '16px'
                }}>
                  <span style={{ marginRight: '6px' }}>📍</span>
                  <span>{communityRegion}</span>
                </div>

                {/* Descripción */}
                <p style={{
                  color: '#666',
                  lineHeight: '1.5',
                  fontSize: '0.9rem',
                  marginBottom: '20px'
                }}>
                  {communityDescription}
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
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>👥</div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Población</div>
                    <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>
                      {communityPopulation ? communityPopulation.toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📅</div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Fundada</div>
                    <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>
                      {communityFounded || 'Ancestral'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🌟</div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Experiencias</div>
                    <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>
                      {communityExperiences}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🏛️</div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '2px' }}>Región</div>
                    <div style={{ fontWeight: '600', color: '#03222b', fontSize: '0.85rem' }}>
                      {communityRegion}
                    </div>
                  </div>
                </div>

                {/* Información de contacto */}
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
                    📧 Información de Contacto
                  </div>
                  <div style={{
                    color: '#92400e',
                    fontSize: '0.75rem',
                    lineHeight: '1.3'
                  }}>
                    <strong>Email:</strong> {communityEmail || 'No disponible'}<br/>
                    <strong>Teléfono:</strong> {communityPhone || 'No disponible'}
                  </div>
                </div>

                {/* Botón de contacto */}
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
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#059669';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#10b981';
                  }}
                  onClick={() => {
                    alert('🚧 Sistema de contacto en desarrollo.\n\nPronto podrás contactar directamente con la comunidad.');
                  }}
                >
                  🏘️ Contactar Comunidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCard;
