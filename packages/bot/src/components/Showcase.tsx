export interface ShowcaseProps {
  align: 'left' | 'right';
  description: string;
  src: string;
  title: string;
}

export default function Showcase({ align, description, src, title }: ShowcaseProps) {
  return (
    <div className="flex flex-col lg:px-6 xl:px-48 items-center lg:grid lg:grid-cols-3 gap-6">
      <video
        autoPlay
        className="rounded-md w-[93%]  sm:w-3/4 lg:w-full lg:h-auto"
        controls={false}
        loop
        muted
        playsInline
        src={src}
      />

      <div
        className={`${
          align === 'left' ? 'row-start-1' : ''
        } h-full col-span-2 flex flex-col justify-center mx-3 px-2 sm:px-16 lg:px-0 text-center lg:text-left`}
      >
        <h2>{title}</h2>
        <p className="mt-3 text-gray-400 font-light">{description}</p>
      </div>
    </div>
  );
}
