export default function FormSection({
  title,
  description,
  action,
  children,
  className = ''
}) {
  return (
    <section className={`form-section ${className}`}>
      {(title || description || action) && (
        <div className="flex justify-between items-start mb-4">
          <div>
            {title && <h3 className="form-section-title">{title}</h3>}
            {description && <p className="form-section-desc">{description}</p>}
          </div>
          {action && <div className="form-section-action">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
