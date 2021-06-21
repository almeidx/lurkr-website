export interface ShowcaseProps {
  align: 'left' | 'right';
  description: string;
  src: string;
  title: string;
}

export default function Showcase({ align, description, src, title }: ShowcaseProps) {
  return (
    <div className="flex flex-col items-center lg:grid lg:grid-cols-3 gap-6">
      <video
        autoPlay
        className="rounded-md w-[93%] sm:w-3/4 lg:w-full lg:h-auto"
        controls={false}
        loop
        muted
        playsInline
        src={src}
      />

      <div className={`${align === 'left' ? 'row-start-1' : ''} col-span-2 flex flex-col justify-center mx-3`}>
        <span className="font-bold text-white text-2xl">{title}</span>
        <p className="mt-3 text-gray-400 font-light">{description}</p>
      </div>
    </div>
  );
}
