interface FailureProps {
  message: string;
}

export default function Failure({ message }: FailureProps) {
  return (
    <div className="bg-discord-dark min-h-screen-no-footer flex">
      <p className="text-white font-bold text-center text-xl sm:text-3xl max-w-prose m-auto">{message}</p>
    </div>
  );
}
