import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { Guild } from '../../@types';

let cachedGuilds: Guild[] | null = null;

export default async (request: NowRequest, response: NowResponse) => {
  if (!cachedGuilds) {
    const { data } = await axios.get<Guild[]>('https://api.pepe-is.life/guilds');
    cachedGuilds = data;
    return response.json(data);
  }

  return response.json(cachedGuilds);
}
