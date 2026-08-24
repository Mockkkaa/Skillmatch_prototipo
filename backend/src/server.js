const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('================================================');
  console.log('  🚀 SkillMatch API Server');
  console.log(`  📡 Corriendo en: http://localhost:${PORT}`);
  console.log(`  🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================');
  console.log('');
});
