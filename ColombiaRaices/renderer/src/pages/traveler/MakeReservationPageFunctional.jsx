import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useReservations from '../../hooks/useReservations';
import './MakeReservationPage.css';

const MakeReservationPage = () => {
  const navigate = useNavigate();
  const { createReservation, loading, error } = useReservations();
  
  const [formData, setFormData] = useState({
    departureDate: '',
    returnDate: '',
    destination: '',
    numberOfTravelers: 1,
    roomType: 'single',
    specialRequests: '',
    contactInfo: {
      email: '',
      phone: '',
      fullName: ''
    }
  });

  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.departureDate) {
      errors.departureDate = 'La fecha de salida es obligatoria';
    }
    
    if (!formData.returnDate) {
      errors.returnDate = 'La fecha de regreso es obligatoria';
    }
    
    if (formData.departureDate && formData.returnDate && 
        new Date(formData.departureDate) >= new Date(formData.returnDate)) {
      errors.returnDate = 'La fecha de regreso debe ser posterior a la de salida';
    }
    
    if (!formData.destination) {
      errors.destination = 'Debe seleccionar un destino';
    }
    
    if (!formData.contactInfo.email || !/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      errors['contactInfo.email'] = 'Email válido es requerido';
    }
    
    if (!formData.contactInfo.phone || formData.contactInfo.phone.length < 10) {
      errors['contactInfo.phone'] = 'Teléfono válido es requerido (mín. 10 dígitos)';
    }
    
    if (!formData.contactInfo.fullName || formData.contactInfo.fullName.trim().length < 2) {
      errors['contactInfo.fullName'] = 'Nombre completo es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateEstimate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCalculating(true);
    
    try {
      // Simular cálculo de estimación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const basePrice = 150000; // Precio base por persona
      const days = Math.ceil((new Date(formData.returnDate) - new Date(formData.departureDate)) / (1000 * 60 * 60 * 24));
      const totalBasic = basePrice * formData.numberOfTravelers * days;
      
      // Ajustes por tipo de habitación
      const roomMultiplier = {
        single: 1.0,
        double: 0.8,
        triple: 0.7,
        suite: 1.5
      };
      
      const total = totalBasic * roomMultiplier[formData.roomType];
      
      const newEstimate = {
        total: Math.round(total),
        breakdown: {
          accommodation: Math.round(total * 0.6),
          transport: Math.round(total * 0.2),
          activities: Math.round(total * 0.15),
          insurance: Math.round(total * 0.05)
        },
        days: days,
        travelers: formData.numberOfTravelers
      };
      
      setEstimate(newEstimate);
      
    } catch (error) {
      console.error('Error calculating estimate:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !estimate) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createReservation({
        ...formData,
        estimate: estimate
      });
      
      setSuccessMessage('¡Reserva creada exitosamente!');
      
      setTimeout(() => {
        navigate('/reservation-history', { 
          state: { 
            message: 'Reserva creada exitosamente',
            type: 'success'
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const destinations = [
    'Cartagena de Indias',
    'Medellín',
    'Bogotá',
    'San Andrés',
    'Villa de Leyva',
    'Guatapé',
    'Tayrona',
    'Cocora',
    'Caño Cristales',
    'Amazonas'
  ];

  return (
    <main className="make-reservation-page" role="main">
      <div className="container">
        <header className="reservation-header">
          <h1 id="page-title">Nueva Reserva</h1>
          <p>Planifica tu próxima aventura por Colombia</p>
        </header>

        {successMessage && (
          <div className="success-message" role="alert">
            <span className="success-icon">✅</span>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-alert" role="alert">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reservation-form">
          
          <fieldset className="form-section">
            <legend>Detalles del Viaje</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="destination">
                  Destino <span className="required">*</span>
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className={formErrors.destination ? 'error' : ''}
                  required
                >
                  <option value="">Selecciona un destino</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
                {formErrors.destination && (
                  <span className="error-message">{formErrors.destination}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="numberOfTravelers">
                  Número de Viajeros <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="numberOfTravelers"
                  name="numberOfTravelers"
                  value={formData.numberOfTravelers}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureDate">
                  Fecha de Salida <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  className={formErrors.departureDate ? 'error' : ''}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                {formErrors.departureDate && (
                  <span className="error-message">{formErrors.departureDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="returnDate">
                  Fecha de Regreso <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className={formErrors.returnDate ? 'error' : ''}
                  required
                  min={formData.departureDate || new Date().toISOString().split('T')[0]}
                />
                {formErrors.returnDate && (
                  <span className="error-message">{formErrors.returnDate}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Tipo de Habitación</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
              >
                <option value="single">Individual</option>
                <option value="double">Doble</option>
                <option value="triple">Triple</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Solicitudes Especiales</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="3"
                placeholder="Dietas especiales, accesibilidad, preferencias..."
              />
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Información de Contacto</legend>
            
            <div className="form-group">
              <label htmlFor="fullName">
                Nombre Completo <span className="required">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="contactInfo.fullName"
                value={formData.contactInfo.fullName}
                onChange={handleInputChange}
                className={formErrors['contactInfo.fullName'] ? 'error' : ''}
                required
              />
              {formErrors['contactInfo.fullName'] && (
                <span className="error-message">{formErrors['contactInfo.fullName']}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className={formErrors['contactInfo.email'] ? 'error' : ''}
                  required
                />
                {formErrors['contactInfo.email'] && (
                  <span className="error-message">{formErrors['contactInfo.email']}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Teléfono <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  className={formErrors['contactInfo.phone'] ? 'error' : ''}
                  required
                  placeholder="Ej: +57 300 123 4567"
                />
                {formErrors['contactInfo.phone'] && (
                  <span className="error-message">{formErrors['contactInfo.phone']}</span>
                )}
              </div>
            </div>
          </fieldset>

          {estimate && (
            <section className="estimate-section">
              <h2>Estimación de Costos</h2>
              <div className="estimate-details">
                <div className="estimate-row">
                  <span>Alojamiento:</span>
                  <span>${estimate.breakdown.accommodation?.toLocaleString() || '0'} COP</span>
                </div>
                <div className="estimate-row">
                  <span>Transporte:</span>
                  <span>${estimate.breakdown.transport?.toLocaleString() || '0'} COP</span>
                </div>
                <div className="estimate-row">
                  <span>Actividades:</span>
                  <span>${estimate.breakdown.activities?.toLocaleString() || '0'} COP</span>
                </div>
                <div className="estimate-row">
                  <span>Seguro:</span>
                  <span>${estimate.breakdown.insurance?.toLocaleString() || '0'} COP</span>
                </div>
                <div className="estimate-total">
                  <span>Total:</span>
                  <span>${estimate.total?.toLocaleString() || '0'} COP</span>
                </div>
              </div>
            </section>
          )}
          
          <div className="form-actions">
            {isCalculating && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Calculando estimación de costos...</p>
              </div>
            )}

            {isSubmitting && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Procesando su reserva...</p>
              </div>
            )}
            
            <button
              type="button"
              onClick={calculateEstimate}
              disabled={isCalculating || isSubmitting}
              className="btn btn-secondary"
            >
              {isCalculating ? 'Calculando...' : '🧮 Calcular Estimación'}
            </button>
            
            <button
              type="submit"
              disabled={loading || !estimate || isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Procesando...' : '✅ Crear Reserva'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <p>Error: {error}</p>
            </div>
          )}
        </form>
        
        <nav className="page-navigation" role="navigation">
          <button
            type="button"
            onClick={() => navigate('/traveler-dashboard')}
            className="btn btn-outline"
          >
            🏠 Volver al Dashboard
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/reservation-history')}
            className="btn btn-outline"
          >
            📋 Ver Historial
          </button>
        </nav>
      </div>
    </main>
  );
};

export default MakeReservationPage;
