import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  const getWindowDimensions = () => ({
    height: hasWindow ? window.innerHeight : null,
    width: hasWindow ? window.innerWidth : null,
  });

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => setWindowDimensions(getWindowDimensions());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
