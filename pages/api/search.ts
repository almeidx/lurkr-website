import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { IEmoji } from '../../@types';

export default async (request: NowRequest, response: NowResponse) => {
  const { q } = request.query;

  const res = await axios.get<IEmoji[]>('https://api.pepe-is.life/search', {
    params: {
      q,
    },
  });

  return response.status(200).json(res.data);
};
