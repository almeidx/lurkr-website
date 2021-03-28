import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

declare module 'next-auth' {
  interface User {
    id: string;
  }
}

export default NextAuth({
  callbacks: {
    // @ts-expect-error
    async session(session, user) {
      session.user.id = user.id as string;
      return Promise.resolve(session);
    },
  },
  database: process.env.MONGO_URI as string,
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_SECRET as string,
      scope: 'identify guilds',
    }),
  ],
});
