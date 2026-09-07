const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skillmatch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // mysql2 3.x: charset se especifica como string de la siguiente forma
  charset: 'utf8mb4',
  // Configuración adicional para garantizar UTF-8 en cada conexión nueva
  // mediante el evento 'connection' del pool
});

// Garantizar SET NAMES utf8mb4 en cada nueva conexión del pool
// Esto es el método correcto en mysql2 3.x para forzar charset
pool.on('connection', (connection) => {
  connection.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci", (err) => {
    if (err) console.warn('⚠️  Warning SET NAMES:', err.message);
  });
  connection.query("SET character_set_results = utf8mb4", (err) => {
    if (err) console.warn('⚠️  Warning charset_results:', err.message);
  });
});

// Test connection on startup
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    // Verificar que el charset está correctamente configurado
    const [rows] = await conn.query('SHOW VARIABLES LIKE "character_set%"');
    const charsetOk = rows.some(r => r.Variable_name === 'character_set_client' && r.Value === 'utf8mb4');
    console.log('✅ Conexión a MySQL establecida correctamente');
    if (charsetOk) {
      console.log('✅ Charset UTF-8 (utf8mb4) configurado correctamente');
    } else {
      console.warn('⚠️  Charset no es utf8mb4 - pueden aparecer problemas con caracteres especiales');
      console.warn('   Asegúrate de que MySQL esté configurado con utf8mb4');
    }
    conn.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
    console.error('   Verifica que XAMPP MySQL esté corriendo y las credenciales en .env sean correctas');
  }
}

testConnection();

module.exports = pool;
