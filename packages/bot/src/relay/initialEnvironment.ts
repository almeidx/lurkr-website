import 'regenerator-runtime/runtime';

import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-modern';
import type RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import { Environment, RecordSource, Store } from 'relay-runtime';

import { API_BASE_URL } from '../utils/constants';

export default function makeEnvironment(relayServerSSR: RelayServerSSR) {
  return new Environment({
    network: new RelayNetworkLayer([relayServerSSR.getMiddleware(), urlMiddleware({ url: `${API_BASE_URL}/graphql` })]),
    store: new Store(new RecordSource()),
  });
}
