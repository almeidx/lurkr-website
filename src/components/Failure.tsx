interface FailureProps {
  message: string;
}

export default function Failure({ message }: FailureProps) {
  return (
    <div className="flex min-h-screen-no-footer bg-discord-dark">
      <p className="m-auto max-w-prose text-xl font-bold text-center text-white sm:text-3xl">{message}</p>
    </div>
  );
}
