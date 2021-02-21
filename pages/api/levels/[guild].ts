import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { ILevel } from '../../../typings';

export default async (request: NowRequest, response: NowResponse) => {
  const {
    query: { guild },
  } = request;

  const res = await axios.get<ILevel[]>(`https://api.pepe-is.life/levels/${guild as string}`);

  return response.status(200).json(res.data);
};
