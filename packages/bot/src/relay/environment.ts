import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import { API_BASE_URL } from '../utils/constants';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function environment(records?: RecordMap, headers?: Record<string, string>) {
  return new Environment({
    network: Network.create(async (operation, variables) => {
      // const res = await axios
      //   .post(
      //     `${API_BASE_URL}/graphql`,
      //     {
      //       query: operation.text,
      //       variables,
      //     },
      //     {
      //       headers: {
      //         ...(headers ?? {}),
      //         // Accept: 'application/json',
      //         'Access-Control-Allow-Credentials': 'true',
      //         'Access-Control-Allow-Origin': API_BASE_URL,
      //       },
      //       withCredentials: true,
      //     },
      //   )
      //   .catch(({ request, ...err }) => {
      //     throw new Error(inspect(err.toJSON()));
      //   });

      // return res.data;

      console.log(headers);

      return fetch(`${API_BASE_URL}/graphql`, {
        body: JSON.stringify({
          query: operation.text,
          variables,
        }),
        credentials: 'include',
        headers: headers?.cookie
          ? {
              'Content-Type': 'application/json',
              Cookie: headers.cookie,
            }
          : {
              'Content-Type': 'application/json',
            },
        method: 'POST',
        mode: 'cors',
      }).then((r) => r.json());
    }),
    store: new Store(new RecordSource(records)),
  });
}
