export default function Alert({ children, variant = 'info', className = '', icon }) {
  const defaultIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`alert alert-${variant} ${className}`}>
      <span className="alert-icon">{icon || defaultIcons[variant]}</span>
      <div className="alert-content">{children}</div>
    </div>
  );
}
