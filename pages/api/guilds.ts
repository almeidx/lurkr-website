import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { IGuild } from '../../@types';

let cachedGuilds: IGuild[] | null = null;

export default async (request: NowRequest, response: NowResponse) => {
  if (!cachedGuilds) {
    const { data } = await axios.get<IGuild[]>('https://api.pepe-is.life/guilds');
    cachedGuilds = data;
    return response.json(data);
  }

  return response.json(cachedGuilds);
};
