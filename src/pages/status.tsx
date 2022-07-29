import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';

import Input from '../components/form/Input';
import Message from '../components/Message';
import Shard from '../components/Shard';
import { type Snowflake, BOT_API_BASE_URL } from '../utils/constants';
import { isValidSnowflake } from '../utils/utils';

interface GetStatsResponse {
  shards: {
    guilds: number;
    id: number;
    members: number;
    memory: number;
    ping: number;
    uptime: number;
  }[];
  totalShards: number;
}

interface StatusProps {
  shards: GetStatsResponse['shards'] | null;
  totalShards: GetStatsResponse['totalShards'] | null;
}

const tableHeaders = ['ID', 'Guilds', 'Users', 'Ping (ms)', 'Memory (MB)', 'Uptime'];

const calculateShardId = (guildId: Snowflake, shards: number): number => Number(BigInt(guildId) >> BigInt(22)) % shards;

export const getStaticProps: GetStaticProps<StatusProps> = async () => {
  const response = await fetch(`${BOT_API_BASE_URL}/stats`).catch(() => null);
  const data = (await response?.json().catch(() => null)) as GetStatsResponse | null;

  return {
    props: {
      shards: data?.shards ?? null,
      totalShards: data?.totalShards ?? null,
    },
    revalidate: 5,
  };
};

export default function Status({ shards, totalShards }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [serverId, setServerId] = useState<string>('');
  const [selectedShardId, setSelectedShardId] = useState<number | null>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  let timeout: NodeJS.Timeout | null = null;

  const handleServerIdSubmit = () => {
    if (!isValidSnowflake(serverId)) {
      if (submitRef.current) submitRef.current.style.color = '#ed4245';

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (submitRef.current) submitRef.current.style.color = '#fff';
      }, 1_000);
    } else {
      setSelectedShardId(calculateShardId(serverId, totalShards ?? 1));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen-no-footer bg-discord-dark">
      <Head>
        <title>Bot Status | Pepe Manager</title>
      </Head>

      <header className="flex flex-col gap-4 items-center my-4 mx-3 text-center sm:mx-0 sm:mb-6">
        <h1>Bot Status</h1>
        <p className="font-light text-gray-400">Check if the bot is online in your server!</p>
      </header>

      <div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
        <Input
          className="my-5"
          id="searchTerm"
          initialValue={''}
          maxLength={20}
          onChange={(t) => {
            if (selectedShardId !== null) setSelectedShardId(null);
            setServerId(t);
          }}
          onSubmit={handleServerIdSubmit}
          placeholder="Enter a server ID"
          submitRef={submitRef}
        />
      </div>

      <main className="mt-4">
        {!shards && totalShards === null && <Message message="The bot is down" type="error" />}

        {typeof totalShards === 'number' && (
          <span className="text-lg text-white">
            Shards: {shards?.length ?? 0}/{totalShards}
          </span>
        )}

        {!!shards && (
          <table className="gap-4 text-white bg-discord-not-quite-black rounded-md shadow-md">
            <thead>
              <tr>
                {tableHeaders.map((name, i) => (
                  <th className="py-3 px-5 text-lg" key={i}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center text-gray-300">
              {shards.map(({ guilds, id, members, memory, ping, uptime }) => (
                <Shard
                  key={id}
                  guilds={guilds}
                  id={id}
                  members={members}
                  memory={memory}
                  ping={ping}
                  selected={id === selectedShardId}
                  uptime={uptime}
                />
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
