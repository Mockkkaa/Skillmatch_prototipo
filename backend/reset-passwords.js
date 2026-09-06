/**
 * reset-passwords.js
 * Regenera los hashes bcrypt correctos y los actualiza directamente en la DB.
 * Ejecutar: node reset-passwords.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

const SALT_ROUNDS = 10;

const users = [
  { correo: 'admin@skillmatch.co',              plain: 'Admin2024!'    },
  { correo: 'maria.admin@skillmatch.co',         plain: 'Admin2024!'    },
  { correo: 'juan.funcionario@sena.edu.co',      plain: 'Func2024!'     },
  { correo: 'ana.funcionario@sena.edu.co',       plain: 'Func2024!'     },
  { correo: 'santiago.r@misena.edu.co',          plain: 'Aprendiz2024!' },
  { correo: 'laura.m@misena.edu.co',             plain: 'Aprendiz2024!' },
  { correo: 'andres.l@misena.edu.co',            plain: 'Aprendiz2024!' },
  { correo: 'valentina.c@misena.edu.co',         plain: 'Aprendiz2024!' },
  { correo: 'miguel.h@misena.edu.co',            plain: 'Aprendiz2024!' },
  { correo: 'contacto@techcorp.co',              plain: 'Empresa2024!'  },
  { correo: 'rrhh@innovasoft.co',                plain: 'Empresa2024!'  },
  { correo: 'talentos@digitalmind.co',           plain: 'Empresa2024!'  },
];

async function resetPasswords() {
  console.log('\n================================================');
  console.log('  SkillMatch — Reset de contraseñas en DB');
  console.log('================================================\n');

  let updated = 0;
  let skipped = 0;

  for (const { correo, plain } of users) {
    const hash = await bcrypt.hash(plain, SALT_ROUNDS);
    const [result] = await pool.query(
      'UPDATE usuarios SET contrasena = ? WHERE correo = ?',
      [hash, correo]
    );

    if (result.affectedRows > 0) {
      console.log(`✅  ${correo}  →  "${plain}"`);
      updated++;
    } else {
      console.log(`⚠️  ${correo}  →  usuario no encontrado en DB (saltado)`);
      skipped++;
    }
  }

  console.log(`\n------------------------------------------------`);
  console.log(`  Actualizados : ${updated}`);
  console.log(`  No encontrados: ${skipped}`);
  console.log(`------------------------------------------------`);
  console.log('\n✔ Listo. Ahora puedes iniciar sesión con las credenciales de arriba.\n');

  await pool.end();
  process.exit(0);
}

resetPasswords().catch((e) => {
  console.error('\n❌ Error:', e.message);
  process.exit(1);
});
