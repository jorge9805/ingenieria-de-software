// ReservationForm.jsx
// Formulario para crear o editar reservas

import { useState, useEffect } from "react";
import { COLORS } from '../../constants/colors';
import useReservations from '../../hooks/useReservations';

const ReservationForm = ({ 
  experienceId = null, 
  onSubmit = null, 
  onCancel = null,
  initialData = null 
}) => {
  const { calculateEstimate, estimateData, estimateLoading, error, clearError } = useReservations();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    experience_id: experienceId || '',
    fecha_inicio: '',
    num_personas: 1,
    servicios_adicionales: [],
    comentarios: '',
    contacto_emergencia: '',
    telefono_emergencia: ''
  });

  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [showEstimate, setShowEstimate] = useState(false);

  // Cargar experiencias disponibles si no se proporciona experienceId
  useEffect(() => {
    if (!experienceId) {
      loadExperiences();
    }
  }, [experienceId]);

  // Cargar datos iniciales si se proporcionan
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const loadExperiences = async () => {
    setLoadingExperiences(true);
    try {
      const response = await window.electronAPI.experiencesSimple.getAll();
      if (response.success) {
        // Filtrar solo experiencias activas
        const activeExperiences = response.data.filter(exp => exp.is_active === 1);
        setExperiences(activeExperiences);
      }
    } catch (err) {
      console.error('Error loading experiences:', err);
    } finally {
      setLoadingExperiences(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setShowEstimate(false);
    clearError();
  };

  const handleServiciosChange = (servicio, checked) => {
    setFormData(prev => ({
      ...prev,
      servicios_adicionales: checked 
        ? [...prev.servicios_adicionales, servicio]
        : prev.servicios_adicionales.filter(s => s !== servicio)
    }));
    setShowEstimate(false);
  };
  const handleCalculateEstimate = async () => {
    console.log('🔍 DEBUG - handleCalculateEstimate called');
    console.log('🔍 DEBUG - formData:', formData);
    
    if (!formData.experience_id || !formData.fecha_inicio || !formData.num_personas) {
      alert('Por favor completa los campos requeridos para calcular la estimación');
      return;
    }

    const requestData = {
      experience_id: formData.experience_id,
      fecha_inicio: formData.fecha_inicio,
      num_personas: formData.num_personas,
      servicios_adicionales: formData.servicios_adicionales
    };
    
    console.log('🔍 DEBUG - Calling calculateEstimate with:', requestData);
    
    const result = await calculateEstimate(requestData);
    
    console.log('🔍 DEBUG - calculateEstimate result:', result);
    console.log('🔍 DEBUG - estimateData from hook:', estimateData);

    if (result) {
      setShowEstimate(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.experience_id || !formData.fecha_inicio || !formData.num_personas) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease'
  };

  const buttonStyle = {
    backgroundColor: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'all 0.3s ease'
  };

  const serviciosAdicionales = [
    'Transporte local',
    'Alimentación completa', 
    'Guía especializado',
    'Equipo fotográfico',
    'Seguro de viaje'
  ];

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ color: COLORS.primary, marginBottom: '30px', textAlign: 'center' }}>
        📝 {experienceId ? 'Reservar Experiencia' : 'Generar Nueva Reserva'}
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Selección de experiencia */}
      {!experienceId && (
        <div style={fieldStyle}>
          <label style={labelStyle}>Experiencia *</label>
          <select
            style={inputStyle}
            value={formData.experience_id}
            onChange={(e) => handleInputChange('experience_id', e.target.value)}
            disabled={loadingExperiences}
          >
            <option value="">Selecciona una experiencia</option>
            {experiences.map(exp => (
              <option key={exp.id} value={exp.id}>
                {exp.nombre} - {exp.ubicacion} (${exp.precio?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fecha de inicio */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Fecha de inicio *</label>
        <input
          type="date"
          style={inputStyle}
          value={formData.fecha_inicio}
          onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Número de personas */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Número de personas *</label>
        <input
          type="number"
          style={inputStyle}
          value={formData.num_personas}
          onChange={(e) => handleInputChange('num_personas', parseInt(e.target.value))}
          min="1"
          max="20"
        />
      </div>

      {/* Servicios adicionales */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Servicios adicionales</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {serviciosAdicionales.map(servicio => (
            <label key={servicio} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.servicios_adicionales.includes(servicio)}
                onChange={(e) => handleServiciosChange(servicio, e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              {servicio}
            </label>
          ))}
        </div>
      </div>

      {/* Contacto de emergencia */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Contacto de emergencia</label>
          <input
            type="text"
            style={inputStyle}
            value={formData.contacto_emergencia}
            onChange={(e) => handleInputChange('contacto_emergencia', e.target.value)}
            placeholder="Nombre del contacto"
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Teléfono de emergencia</label>
          <input
            type="tel"
            style={inputStyle}
            value={formData.telefono_emergencia}
            onChange={(e) => handleInputChange('telefono_emergencia', e.target.value)}
            placeholder="+57 300 123 4567"
          />
        </div>
      </div>

      {/* Comentarios */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Comentarios adicionales</label>
        <textarea
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          value={formData.comentarios}
          onChange={(e) => handleInputChange('comentarios', e.target.value)}
          placeholder="Solicitudes especiales, preferencias, etc."
        />
      </div>

      {/* Botón de estimación */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          type="button"
          style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}
          onClick={handleCalculateEstimate}
          disabled={estimateLoading}
        >
          {estimateLoading ? 'Calculando...' : '💰 Calcular Estimación'}
        </button>
      </div>      {/* Mostrar estimación */}
      {showEstimate && estimateData && (
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #28a745'
        }}>
          <h3 style={{ color: '#28a745', marginBottom: '15px' }}>💰 Estimación de Reserva</h3>
          
          {/* DEBUG: Mostrar datos raw */}
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '10px', 
            marginBottom: '15px', 
            fontSize: '12px',
            border: '1px solid #ffeaa7'
          }}>
            <strong>🔍 DEBUG - estimateData:</strong>
            <pre>{JSON.stringify(estimateData, null, 2)}</pre>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><strong>Costo base:</strong> ${estimateData.precio_base?.toLocaleString()}</div>
            <div><strong>Servicios adicionales:</strong> ${estimateData.servicios_adicionales?.toLocaleString()}</div>
            <div><strong>Total estimado:</strong> <strong>${estimateData.total?.toLocaleString()}</strong></div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
          onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
        >
          🎯 Crear Reserva
        </button>
        
        {onCancel && (
          <button
            type="button"
            style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
            onClick={onCancel}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            ❌ Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ReservationForm;
