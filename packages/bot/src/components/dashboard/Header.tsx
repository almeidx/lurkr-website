interface HeaderProps {
  description: string;
  title: string;
}

export default function Header({ description, title }: HeaderProps) {
  return (
    <header className="flex flex-col gap-3 mb-3">
      <h1 className="text-white uppercase font-bold text-3xl">{title}</h1>
      <p className="text-gray-400 font-light">{description}</p>
    </header>
  );
}
