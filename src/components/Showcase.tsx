import { useCallback, useEffect, useRef } from 'react';

export interface ShowcaseProps {
  align: 'left' | 'right';
  description: string;
  src: string;
  title: string;
}

export default function Showcase({ align, description, src, title }: ShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // https://stackoverflow.com/a/63887052/11252146
  const makeVideoPlayable = useCallback((): void => {
    if (!videoRef.current) return;

    const x = videoRef.current.offsetLeft;
    const y = videoRef.current.offsetTop;
    const w = videoRef.current.offsetWidth;
    const h = videoRef.current.offsetHeight;
    const right = x + w; // right
    const bottom = y + h; // bottom

    const visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, right - window.pageXOffset));
    const visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, bottom - window.pageYOffset));

    const visible = (visibleX * visibleY) / (w * h);

    if (visible > 0.8) {
      void videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', makeVideoPlayable, false);
    window.addEventListener('resize', makeVideoPlayable, false);

    return () => {
      window.removeEventListener('scroll', makeVideoPlayable);
      window.removeEventListener('resize', makeVideoPlayable);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col lg:px-6 xl:px-48 items-center lg:grid lg:grid-cols-3 gap-6">
      <video
        autoPlay
        className="rounded-md w-[93%]  sm:w-3/4 lg:w-full lg:h-auto"
        controls={false}
        loop
        muted
        playsInline
        src={src}
        ref={videoRef}
      />

      <div
        className={`${
          align === 'left' ? 'row-start-1' : ''
        } h-full col-span-2 flex flex-col justify-center mx-3 px-2 sm:px-16 lg:px-0 text-center lg:text-left`}
      >
        <h2>{title}</h2>
        <p className="mt-3 text-gray-400 font-light">{description}</p>
      </div>
    </section>
  );
}
