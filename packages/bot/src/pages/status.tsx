import axios from 'axios';
import type { Snowflake } from 'discord-api-types';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';

import Input from '../components/form/Input';
import Message from '../components/Message';
import Shard from '../components/Shard';
import { BOT_API_BASE_URL } from '../utils/constants';
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
  const response = await axios.get<GetStatsResponse>('/stats', { baseURL: BOT_API_BASE_URL }).catch(() => null);

  console.log(response?.data);

  return {
    props: {
      shards: response?.data.shards ?? null,
      totalShards: response?.data.totalShards ?? null,
    },
    revalidate: 15,
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
    <div className="min-h-screen bg-discord-dark flex flex-col items-center">
      <Head>
        <title>Bot Status | Pepe Manager</title>
      </Head>

      <header className="flex flex-col gap-4 items-center my-4 mx-3 sm:mx-0 text-center sm:mb-6">
        <h1>Bot Status</h1>
        <p className="text-gray-400 font-light">Check if the bot is online in your server!</p>
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
          <span className="text-white text-lg">
            Shards: {shards?.length ?? 0}/{totalShards}
          </span>
        )}

        {!!shards && (
          <table className="bg-discord-not-quite-black text-white gap-4 rounded-md shadow-md">
            <thead>
              <tr>
                {tableHeaders.map((name, i) => (
                  <th className="px-5 py-3 text-lg" key={i}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-300 text-center">
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
