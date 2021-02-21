import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { IGuild } from '../../typings';

let cachedGuilds: IGuild[] | null = null;

export default async (req: NowRequest, res: NowResponse) => {
  if (!cachedGuilds) {
    const { data } = await axios.get<IGuild[]>('https://api.pepe-is.life/guilds');
    cachedGuilds = data;
    return res.json(data);
  }

  return res.status(200).json(cachedGuilds);
};
