import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { IEmoji } from '../../typings';

export default async (req: NowRequest, res: NowResponse) => {
  const { q } = req.query;

  const { data } = await axios.get<IEmoji[]>('https://api.pepe-is.life/search', {
    params: { q },
  });

  return res.status(200).json(data);
};
