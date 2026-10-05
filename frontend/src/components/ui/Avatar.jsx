// frontend/src/components/ui/Avatar.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Avatar({ src, fallback, name, size = 'md', className = '' }) {
  const [blobSrc, setBlobSrc] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const displayName = fallback || name || '';

  useEffect(() => {
    if (!src) {
      setBlobSrc(null);
      setLoadError(false);
      return;
    }

    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setBlobSrc(src);
      setLoadError(false);
      return;
    }

    let isMounted = true;
    let createdUrl = null;

    // Use authenticated axios instance to retrieve image blob if from /api
    api.get(src, { responseType: 'blob' })
      .then((res) => {
        if (isMounted) {
          createdUrl = URL.createObjectURL(res.data);
          setBlobSrc(createdUrl);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(true);
        }
      });

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [src]);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const showImage = blobSrc && !loadError;

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-muted border-[1.5px] border-border-dark ${sizes[size] || size} ${className}`}>
      {showImage ? (
        <img src={blobSrc} alt={displayName || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium text-foreground uppercase select-none">
          {displayName?.substring(0, 2) || 'NA'}
        </span>
      )}
    </div>
  );
}