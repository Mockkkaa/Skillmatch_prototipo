import { useState } from 'react';

export default function Avatar({
  src,
  name = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  style
}) {
  const [imgError, setImgError] = useState(false);

  // Compute initials from name (up to 2 letters)
  const getInitials = (n) => {
    if (!n) return 'SM';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className={`avatar avatar-${size} ${className}`} style={style}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
