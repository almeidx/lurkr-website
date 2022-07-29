interface FailureProps {
  message: string;
}

export default function Failure({ message }: FailureProps) {
  return (
    <div className="flex min-h-screen-no-footer bg-discord-dark">
      <p className="m-auto max-w-prose text-center text-xl font-bold text-white sm:text-3xl">{message}</p>
    </div>
  );
}
