export default function Loading({ message = 'Cargando...', fullPage = false }) {
  const content = (
    <div className="loading-container animate-fade">
      <div className="spinner"></div>
      <p className="text-muted text-sm mt-2">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    );
  }

  return content;
}
