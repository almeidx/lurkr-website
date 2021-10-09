import { useMemo } from 'react';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import { API_BASE_URL } from '../utils/constants';

let relayEnvironment: Environment | undefined;

function createEnvironment(initialRecords?: RecordMap, cookie?: string): Environment {
  return new Environment({
    network: Network.create((operation, variables) =>
      fetch(`${API_BASE_URL}/graphql`, {
        body: JSON.stringify({
          query: operation.text,
          variables,
        }),
        credentials: 'include',
        headers: cookie
          ? {
              'Content-Type': 'application/json',
              Cookie: cookie,
            }
          : {
              'Content-Type': 'application/json',
            },
        method: 'POST',
        mode: 'cors',
      }).then((res) => res.json()),
    ),
    store: new Store(new RecordSource(initialRecords)),
  });
}

export function initEnvironment(initialRecords?: RecordMap, cookie?: string) {
  const environment = relayEnvironment ?? createEnvironment(initialRecords, cookie);

  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }
  // For SSG and SSR always create a new Relay environment
  if (typeof window === 'undefined') return environment;
  // Create the Relay environment once in the client
  if (!relayEnvironment) relayEnvironment = environment;

  return relayEnvironment;
}

export function useEnvironment(initialRecords?: RecordMap) {
  const store = useMemo(() => initEnvironment(initialRecords), [initialRecords]);
  return store;
}
