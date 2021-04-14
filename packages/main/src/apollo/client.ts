import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import merge from 'deepmerge';
import { useMemo } from 'react';

import { API_BASE_URL } from '../utils/constants';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient(headers: any) {
  let link;
  if (headers) {
    link = new HttpLink({
      credentials: 'include',
      headers,
      uri: `${API_BASE_URL}/graphql`,
    });
  } else {
    link = new HttpLink({
      credentials: 'include',
      uri: `${API_BASE_URL}/graphql`,
    });
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
    ssrMode: typeof window === 'undefined',
  });
}

export function initializeApollo(initialState: any | null = null, headers: any | null = null) {
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
  const store = useMemo(() => initializeApollo(initialState, {}), [initialState]);
  return store;
}
