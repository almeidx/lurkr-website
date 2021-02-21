import type { NowRequest, NowResponse } from '@vercel/node';
import axios from 'axios';
import type { ILevel } from '../../../typings';

export default async (req: NowRequest, res: NowResponse) => {
  const {
    query: { guild },
  } = req;

  const { data } = await axios.get<ILevel[]>(`https://api.pepe-is.life/levels/${guild as string}`);
  return res.status(200).json(data);
};
