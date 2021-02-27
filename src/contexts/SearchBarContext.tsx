import { createContext, ReactNode, useState } from 'react';

interface SearchBarContextData {
  searchTerm: string;
  isSearchLoading: boolean;
  updateSearchTerm(term: string): void;
  updateSearchLoading(value: boolean): void;
}

interface SearchBarProviderProps {
  children: ReactNode;
}

export const SearchBarContext = createContext({} as SearchBarContextData);

export default function SearchBarProvider({ children }: SearchBarProviderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  function updateSearchLoading(value: boolean) {
    setIsSearchLoading(value);
  }

  function updateSearchTerm(term: string) {
    setSearchTerm(term);
  }

  return (
    <SearchBarContext.Provider
      value={{
        searchTerm,
        isSearchLoading,
        updateSearchTerm,
        updateSearchLoading,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
}
