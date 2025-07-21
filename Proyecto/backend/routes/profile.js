import express from 'express'
import db from '../db.js'
import verifyToken from '../middleware/auth.js'

const router = express.Router()


// Endpoint de prueba para verificar conectividad y autenticación
router.get('/test', verifyToken, async (req, res) => {
  try {
    const testResult = await db.query('SELECT 1 as test');
    res.json({ message: 'OK', user: req.user.id, dbTest: testResult.rows[0] });
  } catch (err) {
    console.error('Test endpoint error:', err);
    res.status(500).json({ error: 'Test failed', details: err.message });
  }
});

// ✅ Ruta correcta: /api/profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT username, email, first_name, last_name,
              identification_document, telephone, address, nationality, created_at
       FROM users
       WHERE id = ?`,
      [userId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Formatear respuesta para frontend (puedes adaptar según necesidad)
    const user = result.rows[0];
    res.json({
      username: user.username,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      identification_document: user.identification_document || '',
      telephone: user.telephone || '',
      address: user.address || '',
      nationality: user.nationality || '',
      created_at: user.created_at
    });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ error: 'Error al obtener el perfil', details: err.message });
  }
});


// Validación simple de campos requeridos
function validateProfileFields(fields) {
  const errors = [];
  if (fields.first_name !== undefined && typeof fields.first_name !== 'string') errors.push('first_name debe ser texto');
  if (fields.last_name !== undefined && typeof fields.last_name !== 'string') errors.push('last_name debe ser texto');
  if (fields.identification_document !== undefined && typeof fields.identification_document !== 'string') errors.push('identification_document debe ser texto');
  if (fields.telephone !== undefined && typeof fields.telephone !== 'string') errors.push('telephone debe ser texto');
  if (fields.address !== undefined && typeof fields.address !== 'string') errors.push('address debe ser texto');
  if (fields.nationality !== undefined && typeof fields.nationality !== 'string') errors.push('nationality debe ser texto');
  return errors;
}

router.put('/', verifyToken, async (req, res) => {
  const {
    first_name = '',
    last_name = '',
    identification_document = '',
    telephone = '',
    address = '',
    nationality = ''
  } = req.body;

  // Validar tipos de datos
  const errors = validateProfileFields({ first_name, last_name, identification_document, telephone, address, nationality });
  if (errors.length) {
    return res.status(400).json({ error: 'Datos inválidos', details: errors });
  }

  try {
    const userId = req.user.id;
    const result = await db.query(
      `UPDATE users SET
         first_name = ?,
         last_name = ?,
         identification_document = ?,
         telephone = ?,
         address = ?,
         nationality = ?
       WHERE id = ?`,
      [first_name, last_name, identification_document, telephone, address, nationality, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar el perfil:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil', details: err.message });
  }
});

export default router
