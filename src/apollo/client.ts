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

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState, {}), [initialState]);
  return store;
}
