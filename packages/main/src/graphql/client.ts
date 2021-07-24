import { ApolloClient, HttpLink, HttpOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import merge from 'deepmerge';
import { useMemo } from 'react';

import { API_BASE_URL } from '../utils/constants';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient(headers?: Record<string, unknown>) {
  const baseLinkOpts: HttpOptions = {
    credentials: 'include',
    uri: `${API_BASE_URL}/graphql`,
  };

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(headers ? Object.assign(baseLinkOpts, { headers }) : baseLinkOpts),
    ssrMode: typeof window === 'undefined',
  });
}

export function initializeApollo(initialState: any = null, headers?: Record<string, unknown>) {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    const data = merge(initialState, existingCache);

    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => initializeApollo(initialState, {}), [initialState]);
}
