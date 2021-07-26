import { RelayNetworkLayer } from 'react-relay-network-modern';
import { Environment, RecordSource, Store } from 'relay-runtime';
import type { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

import { API_BASE_URL } from '../utils/constants';

export default function environment(records?: RecordMap, headers?: Record<string, string>) {
  return new Environment({
    network: new RelayNetworkLayer([
      (next) => async (req) => {
        req.fetchOpts.credentials = 'include';
        req.fetchOpts.headers = {
          ...req.fetchOpts.headers,
          ...(headers ?? {}),
          // Accept: 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': API_BASE_URL,
        };
        req.fetchOpts.method = 'POST';
        req.fetchOpts.mode = 'cors';
        req.fetchOpts.redirect = 'follow';
        req.fetchOpts.url = `${API_BASE_URL}/graphql`;

        const res = await next(req);
        return res;
      },
    ]),
    store: new Store(new RecordSource(records)),
  });
}
