import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings({ user, userId, token, onUserUpdate }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: user || '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  // Cargar información del usuario al montar el componente
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
          setFormData(prev => ({
            ...prev,
            username: data.username || '',
            email: data.email || ''
          }))
        } else {
          setMessage('Error al cargar la información del usuario')
          setMessageType('error')
        }
      } catch (error) {
        console.error('Error:', error)
        setMessage('Error de conexión al cargar los datos')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchUserInfo()
    } else {
      navigate('/login')
    }
  }, [token, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    // Validaciones
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('Las contraseñas nuevas no coinciden')
      setMessageType('error')
      setSaving(false)
      return
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage('La nueva contraseña debe tener al menos 6 caracteres')
      setMessageType('error')
      setSaving(false)
      return
    }

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      }

      // Solo incluir contraseñas si se va a cambiar
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setMessage('Debes proporcionar tu contraseña actual para cambiarla')
          setMessageType('error')
          setSaving(false)
          return
        }
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      console.log('Enviando datos:', updateData) // Para debugging

      const response = await fetch(`http://localhost:4000/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Información actualizada correctamente')
        setMessageType('success')
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))

        // Actualizar información local si cambió el username
        if (formData.username !== user && onUserUpdate) {
          onUserUpdate(formData.username)
        }

        // Actualizar userInfo
        setUserInfo(prev => ({
          ...prev,
          username: formData.username,
          email: formData.email
        }))
      } else {
        console.error('Error del servidor:', data)
        setMessage(data.message || data.error || 'Error al actualizar la información')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error de conexión al actualizar los datos')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="settings-container">
        <div className="settings-header">
          <h1>⚙️ Mi Perfil</h1>
          <p>Administra tu cuenta y personaliza tu experiencia</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="settings-content">
          <div className="settings-section">
            <h2>👤 Información Personal</h2>
            
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="username">
                  📝 Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  minLength="3"
                  maxLength="30"
                  placeholder="Tu nombre de usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  📧 Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="settings-divider">
                <h3>🔐 Cambiar Contraseña (Opcional)</h3>
                <p>Deja estos campos vacíos si no quieres cambiar tu contraseña</p>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">
                  🔒 Contraseña Actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña actual"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  🆕 Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Nueva contraseña (mín. 6 caracteres)"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  ✅ Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma la nueva contraseña"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  ← Volver al Inicio
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {userInfo && (
            <div className="settings-section">
              <h2>📊 Información de la Cuenta</h2>
              <div className="account-info">
                <div className="info-item">
                  <span className="label">Usuario desde:</span>
                  <span className="value">
                    {userInfo.created_at 
                      ? new Date(userInfo.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No disponible'
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">ID de Usuario:</span>
                  <span className="value">#{userId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Estado:</span>
                  <span className="value status-active">✅ Activa</span>
                </div>
              </div>
            </div>
          )}

          <div className="settings-section">
            <h2>🎨 Preferencias</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <div className="preference-info">
                  <h4>🌙 Tema Oscuro</h4>
                  <p>Cambiar entre tema claro y oscuro</p>
                </div>
                <div className="preference-control">
                  <span className="coming-soon">Próximamente</span>
                </div>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h4>🔔 Notificaciones</h4>
                  <p>Recibir notificaciones de nuevos comentarios</p>
                </div>
                <div className="preference-control">
                  <span className="coming-soon">Próximamente</span>
                </div>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h4>🌍 Idioma</h4>
                  <p>Cambiar el idioma de la aplicación</p>
                </div>
                <div className="preference-control">
                  <span className="coming-soon">Próximamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
