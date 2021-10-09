interface FailureProps {
  message: string;
}

export default function Failure({ message }: FailureProps) {
  return (
    <div className="min-h-screen bg-discord-dark flex justify-center items-center">
      <span className="text-white font-bold text-center text-xl sm:text-3xl max-w-prose">{message}</span>
    </div>
  );
}
