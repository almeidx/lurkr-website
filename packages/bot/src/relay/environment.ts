import axios from 'axios';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import { API_BASE_URL } from '../utils/constants';

export default function environment(records?: RecordMap, headers?: Record<string, string>) {
  return new Environment({
    network: Network.create(async (operation, variables) => {
      const res = await axios.post(
        `${API_BASE_URL}/graphql`,
        {
          query: operation.text,
          variables,
        },
        {
          headers: {
            ...(headers ?? {}),
            // Accept: 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': API_BASE_URL,
          },
          withCredentials: true,
        },
      );

      if (res.status !== 200) {
        // @ts-expect-error
        throw new Error(res.response);
      }

      return res.data;
    }),
    store: new Store(new RecordSource(records)),
  });
}
