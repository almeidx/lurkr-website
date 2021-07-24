import { ApolloClient, HttpLink, HttpOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import deepMerge from 'deepmerge';
import { useMemo } from 'react';

import { API_BASE_URL } from '../utils/constants';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient(headers?: Record<string, unknown>) {
  const baseLinkOpts: HttpOptions = {
    credentials: 'include',
    // https://github.com/apollographql/apollo-feature-requests/issues/153#issuecomment-476832408
    fetch: (uri, options) => {
      return fetch(uri, options).then((response) => {
        if (response.status >= 500) {
          // or handle 400 errors
          return Promise.reject(response.status);
        }
        return response;
      });
    },
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    uri: `${API_BASE_URL}/graphql`,
  };

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(headers ? deepMerge({ headers }, baseLinkOpts) : baseLinkOpts),
    ssrMode: typeof window === 'undefined',
  });
}

export function initializeApollo(initialState: any = null, headers?: Record<string, unknown>) {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  if (initialState) {
    const existingCache = _apolloClient.extract();
    const data = deepMerge(initialState, existingCache);

    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => initializeApollo(initialState, {}), [initialState]);
}
