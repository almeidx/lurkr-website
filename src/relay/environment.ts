import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import { API_BASE_URL } from '../utils/constants';

export default function environment(records?: RecordMap, headers?: Record<string, string>) {
  return new Environment({
    network: Network.create(async (operation, variables) => {
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
