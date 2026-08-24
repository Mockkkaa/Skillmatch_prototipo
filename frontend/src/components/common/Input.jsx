import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  hint,
  required = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required" title="Requerido">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          ref={ref}
          className={`form-textarea ${error ? 'error' : ''}`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          ref={ref}
          className={`form-select ${error ? 'error' : ''}`}
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          ref={ref}
          className={`form-input ${error ? 'error' : ''}`}
          {...props}
        />
      )}
      
      {error && <span className="form-error">⚠️ {error.message || error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
