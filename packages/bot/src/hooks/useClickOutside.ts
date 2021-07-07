// from best answer https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

import React, { useEffect } from 'react';

export default function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent<HTMLElement>): void => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        // console.log('outside');
        callback();
      }
    };
    // TODO: someday find a way to cast vanilla MouseEvent as React.MouseEvent
    document.addEventListener('mousedown', (e) => handleClickOutside(e as any));
    return () => {
      document.removeEventListener('mousedown', (e) => handleClickOutside(e as any));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
