export default function Badge({ children, variant = 'gray', className = '', icon }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
