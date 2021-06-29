import Header from '../Header';

export default function Autorole() {
  return (
    <>
      <Header
        description="Autoroles consist of roles that are given to users when they join the server."
        title="Autorole"
      />

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3"></div>
      </div>
    </>
  );
}
