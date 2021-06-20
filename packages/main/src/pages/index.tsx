import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';

import Emoji from '../components/Emoji';
import Guild from '../components/Guild';
import Spinner from '../components/Spinner';
import { initializeApollo } from '../graphql/client';
import ALL_GUILDS, { AllGuilds } from '../graphql/queries/AllGuilds';
import FIND_EMOJIS, { FindEmojis } from '../graphql/queries/FindEmojis';

interface HomeProps {
  emojiCount: number;
  guilds: AllGuilds['allOfficialGuilds'];
  otherGuilds: AllGuilds['allOtherGuilds'];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<AllGuilds>({
    query: ALL_GUILDS,
  });

  const officialGuildsClone = [...data.allOfficialGuilds];
  const otherGuildsClone = [...data.allOtherGuilds];

  return {
    props: {
      emojiCount: officialGuildsClone.reduce((a, g) => a + g.emojiCount, 0),
      guilds: officialGuildsClone.sort((a, b) => b.memberCount - a.memberCount),
      otherGuilds: otherGuildsClone.sort((a, b) => b.memberCount - a.memberCount),
    },
    revalidate: 300,
  };
};

export default function Home({ emojiCount, guilds, otherGuilds }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [requestedEmojis, setRequestedEmojis] = useState<FindEmojis['findEmojis']>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const cancelSearch = () => {
    setIsSearchLoading(false);
    setSearchTerm('');
    setRequestedEmojis([]);
  };

  useEffect(() => {
    if (!searchTerm) {
      cancelSearch();
      return () => void 0;
    }

    setIsTimeoutRunning(true);
    const typingTimeout = setTimeout(() => {
      setIsTimeoutRunning(false);
      if (searchTerm) {
        setRequestedEmojis([]);
        setIsSearchLoading(true);

        const apolloClient = initializeApollo();
        apolloClient
          .query<FindEmojis>({
            query: FIND_EMOJIS,
            variables: { query: searchTerm },
          })
          .then(({ data }) => {
            setIsSearchLoading(false);
            setRequestedEmojis(data.findEmojis);
          })
          .catch(() => {
            setIsSearchLoading(false);
            setRequestedEmojis([]);
          });
      }
    }, 750);

    return () => {
      setIsTimeoutRunning(false);
      clearTimeout(typingTimeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) setSearchTerm(decodeURIComponent(query));
  }, []);

  return (
    <div className="bg-discord-dark min-h-screen flex items-center flex-col">
      <header className="py-5 font-bold">
        <h1 className="text-white text-2xl sm:text-4xl">{emojiCount.toLocaleString('en')} unique Pepe Emojis</h1>
      </header>

      <div className="relative flex justify-center items-center my-5 w-1/4 min-w-max h-12">
        <input
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          autoFocus
          className="text-white bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow w-full"
          id="searchTerm"
          maxLength={32}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for Pepe Emojis"
          type="text"
          value={searchTerm}
        />

        {searchTerm && (
          <label
            className="absolute right-0 min-w-max my-auto mx-4 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
            onClick={() => cancelSearch()}
          >
            <span className="inline-block align-middle h-10 leading-10">x</span>
          </label>
        )}
      </div>

      <section className="flex flex-row flex-wrap max-w-2xl gap-2">
        {isSearchLoading && <Spinner />}

        {requestedEmojis.length !== 0
          ? requestedEmojis.map(({ id, invite, name }) => (
              <Emoji animated={name.startsWith('a')} key={id} invite={invite} id={id} name={name} />
            ))
          : searchTerm &&
            !isSearchLoading &&
            !isTimeoutRunning && <p className="text-white">Could not find anything</p>}
      </section>

      <h2 className="text-white text-2xl sm:text-3xl my-6 font-bold">Official Pepe Emoji servers</h2>

      <div className="flex flex-col flex-wrap lg:grid lg:grid-row-2 lg:grid-cols-2 gap-3 lg:place-items-center">
        {guilds.map(({ icon, id, invite, memberCount, name }, i) => (
          <Guild
            icon={icon}
            id={id}
            index={i}
            invite={invite}
            key={i}
            memberCount={memberCount}
            name={name}
            total={guilds.length}
          />
        ))}
      </div>

      <h2 className="text-white text-2xl sm:text-3xl my-6 font-bold">Other official Emoji servers</h2>

      <div className="flex flex-col flex-wrap lg:grid lg:grid-row-2 lg:grid-cols-2 gap-3 mb-16 lg:place-items-center">
        {otherGuilds.map(({ icon, id, invite, memberCount, name }, i) => (
          <Guild
            icon={icon}
            id={id}
            index={i}
            invite={invite}
            key={i}
            memberCount={memberCount}
            name={name}
            total={otherGuilds.length}
          />
        ))}
      </div>
    </div>
  );
}
