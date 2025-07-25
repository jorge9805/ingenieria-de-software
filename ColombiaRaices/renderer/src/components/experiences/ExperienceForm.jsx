import { useState } from "react";
import { EXPERIENCE_TYPES } from '../../utils/constants';

const ExperienceForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || '',
    price: initialData?.price || '',
    duration_hours: initialData?.duration_hours || '',
    max_participants: initialData?.max_participants || '',
    location: initialData?.location || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'La descripción debe tener al menos 50 caracteres';
    }
    
    if (!formData.type) {
      newErrors.type = 'El tipo de experiencia es requerido';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.duration_hours || formData.duration_hours <= 0) {
      newErrors.duration_hours = 'La duración debe ser mayor a 0 horas';
    }
    
    if (!formData.max_participants || formData.max_participants <= 0) {
      newErrors.max_participants = 'El número máximo de participantes debe ser mayor a 0';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const fieldStyle = {
    marginBottom: '20px'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '5px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Título de la experiencia *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.title ? '#dc3545' : '#ddd'
          }}
          placeholder="Ej: Aventura en el Valle de Cocora"
        />
        {errors.title && <div style={errorStyle}>{errors.title}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Descripción *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          style={{
            ...inputStyle,
            borderColor: errors.description ? '#dc3545' : '#ddd',
            resize: 'vertical'
          }}
          placeholder="Describe la experiencia, qué incluye, qué pueden esperar los viajeros... (mínimo 50 caracteres)"
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
          {formData.description.length}/50 caracteres mínimo
        </div>
        {errors.description && <div style={errorStyle}>{errors.description}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Tipo de experiencia *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.type ? '#dc3545' : '#ddd'
          }}
        >
          <option value="">Selecciona un tipo</option>
          <option value={EXPERIENCE_TYPES.CULTURAL}>Cultural</option>
          <option value={EXPERIENCE_TYPES.HISTORICAL}>Histórica</option>
          <option value={EXPERIENCE_TYPES.ECOLOGICAL}>Ecológica</option>
        </select>
        {errors.type && <div style={errorStyle}>{errors.type}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Precio por persona (COP) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          style={{
            ...inputStyle,
            borderColor: errors.price ? '#dc3545' : '#ddd'
          }}
          placeholder="50000"
        />
        {errors.price && <div style={errorStyle}>{errors.price}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Duración (horas) *
        </label>
        <input
          type="number"
          name="duration_hours"
          value={formData.duration_hours}
          onChange={handleChange}
          min="1"
          step="0.5"
          style={{
            ...inputStyle,
            borderColor: errors.duration_hours ? '#dc3545' : '#ddd'
          }}
          placeholder="4"
        />
        {errors.duration_hours && <div style={errorStyle}>{errors.duration_hours}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Máximo de participantes *
        </label>
        <input
          type="number"
          name="max_participants"
          value={formData.max_participants}
          onChange={handleChange}
          min="1"
          style={{
            ...inputStyle,
            borderColor: errors.max_participants ? '#dc3545' : '#ddd'
          }}
          placeholder="15"
        />
        {errors.max_participants && <div style={errorStyle}>{errors.max_participants}</div>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Ubicación/Dirección *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          style={{
            ...inputStyle,
            borderColor: errors.location ? '#dc3545' : '#ddd'
          }}
          placeholder="Ej: Salento, Quindío - Valle de Cocora"
        />
        {errors.location && <div style={errorStyle}>{errors.location}</div>}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'flex-end',
        marginTop: '30px'
      }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            border: '1px solid #6c757d',
            backgroundColor: 'white',
            color: '#6c757d',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: isLoading ? '#ccc' : '#fbd338',
            color: isLoading ? '#666' : '#03222b',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Guardando...' : 'Guardar Experiencia'}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
