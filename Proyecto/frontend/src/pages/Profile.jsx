import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ user, token }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [identificationDocument, setIdentificationDocument] = useState('')
  const [telephone, setTelephone] = useState('')
  const [address, setAddress] = useState('')
  const [nationality, setNationality] = useState('')

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  // ✅ 1. Redirigir si no está logueado
  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
    }
  }, [user, token, navigate])

  // ✅ 2. Obtener datos actuales del perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (res.ok) {
          setFirstName(data.first_name || '')
          setLastName(data.last_name || '')
          setIdentificationDocument(data.identification_document || '')
          setTelephone(data.telephone || '')
          setAddress(data.address || '')
          setNationality(data.nationality || '')
        } else {
          setError(data.error || 'Error al cargar el perfil')
        }
      } catch (err) {
        console.error(err)
        setError('Error al conectar con el serviiidor')
      }
    }

    if (user && token) {
      fetchProfile()
    }
  }, [user, token])

  // ✅ 3. Actualizar perfil
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('http://localhost:4000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          identification_document: identificationDocument,
          telephone,
          address,
          nationality
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Perfil actualizado correctamente')
      } else {
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch (err) {
      console.error(err)
      setError('Error al conectar con el servidorr')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Mi Perfil</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <input
        type="text"
        placeholder="Nombre"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Apellidos"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Documento de identidad"
        value={identificationDocument}
        onChange={e => setIdentificationDocument(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={telephone}
        onChange={e => setTelephone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nacionalidad"
        value={nationality}
        onChange={e => setNationality(e.target.value)}
      />

      <button type="submit">Guardar cambios</button>
    </form>
  )
}
