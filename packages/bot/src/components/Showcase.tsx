import { useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import styles from '../styles/components/Showcase.module.css';

export interface ShowcaseProps {
  align: 'left' | 'right';
  title: string;
  description: string;
  path: string;
}

export default function Showcase({ align, description, path, title }: ShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function onVisibilityChange(isVisible: boolean) {
    if (isVisible) void videoRef.current?.play();
    else videoRef.current?.pause();
  }

  return (
    <VisibilitySensor onChange={onVisibilityChange}>
      <div className={`${styles.container} ${styles[`${align}AlignedShowcase`]}`}>
        <span>{title}</span>
        <p>{description}</p>
        <video autoPlay loop src={path} ref={videoRef} />
      </div>
    </VisibilitySensor>
  );
}
