import { signIn, signOut, useSession } from 'next-auth/client';

export default function Test() {
  const [session, loading] = useSession();

  return (
    <>
      Loading: {loading}
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn('discord')}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}
