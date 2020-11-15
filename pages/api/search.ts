import { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import { Emoji } from '../../@types';

export default async (request: NowRequest, response: NowResponse) => {
  const { q } = request.query;

  const res = await axios.get<Emoji[]>('https://api.pepe-is.life/search', {
    params: {
      q,
    },
  });

  return response.status(200).json(res.data);
}
