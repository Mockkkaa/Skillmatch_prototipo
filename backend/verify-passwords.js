/**
 * verify-passwords.js
 * Ejecutar: node verify-passwords.js
 * Verifica si los hashes del seed.sql coinciden con las contraseñas esperadas.
 */
const bcrypt = require('bcryptjs');

const checks = [
  {
    label: 'Admin (admin@skillmatch.co)',
    plain: 'Admin2024!',
    hash: '$2b$10$mPeZDjaAoj0Mf1VGGDmFROlnGg4f8jL.w2t1.pxC.wS8le7bd/Csi',
  },
  {
    label: 'Aprendiz (santiago.r@misena.edu.co)',
    plain: 'Aprendiz2024!',
    hash: '$2b$10$Oz2Iv90SGjiDHcJKLlGmbOyz.xFy6Wf/xttTZX3B41ku84X4mfPmq',
  },
  {
    label: 'Empresa (contacto@techcorp.co)',
    plain: 'Empresa2024!',
    hash: '$2b$10$Bzi.GXLMYWRplzdHzZ1J1OCCR9V5lDBAyKR1bJEp6nrqcGmNPyDSi',
  },
];

async function verify() {
  console.log('\n==============================');
  console.log('  Verificación de contraseñas');
  console.log('==============================\n');

  for (const { label, plain, hash } of checks) {
    const match = await bcrypt.compare(plain, hash);
    const icon = match ? '✅' : '❌';
    console.log(`${icon}  ${label}`);
    console.log(`   Contraseña: "${plain}"`);
    console.log(`   Hash DB:    ${hash}`);
    console.log(`   ¿Coincide?: ${match ? 'SÍ' : 'NO — el hash NO corresponde a esta contraseña'}\n`);
  }

  console.log('==============================');
  console.log('Si algún hash NO coincide, ejecuta reset-passwords.js');
  console.log('==============================\n');
}

verify().catch(console.error);
