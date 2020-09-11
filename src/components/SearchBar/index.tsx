import React, {
  ChangeEvent, FC, useCallback, useState,
} from 'react';
import Tooltip from 'react-tooltip-lite';
import api from '../../services/api';

import { Emoji } from '../../@types';
import './styles.css';
import loadingGif from '../../assets/loading.gif';

const SearchBar: FC = () => {
  const [input, setInput] = useState('');
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);
  const [timeout, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setInput(value);
    const inputLower = value.toLowerCase();

    if (timeout) {
      clearTimeout(timeout);
      setTimer(null);
    }
    if (!inputLower) return setWantedEmojis([]);

    setTimer(
      setTimeout(() => {
        setTimer(null);
        setWantedEmojis([]);
        setLoading(true);

        api.get<Emoji[]>('search', { params: { q: inputLower } }).then((res) => {
          setLoading(false);
          setWantedEmojis(res.data);
        });
      }, 750),
    );
  }, [timeout]);

  const handleImageLoad = useCallback(() => setLoading(false), []);

  return (
    <div className='searchbar-container'>
      <input
        className='searchbar-input'
        type='text'
        value={input}
        onChange={handleInputChange}
        placeholder='Search for Pepe emojis'
      />
      <div className='searchbar-emoji-container'>
        {isLoading && <img src={loadingGif} alt='Loading' />}
        {(wantedEmojis.length && wantedEmojis.map((e) => (
          <Tooltip key={e.id} content={`:${e.name}:`} color='#fff' background='#000'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`https://discord.gg/${e.invite}`}
            >
              <img src={e.url} alt={e.name} onLoad={handleImageLoad} />
            </a>
          </Tooltip>
        ))) || (input && !isLoading && !timeout && <p>Could not find anything</p>)}
      </div>
    </div>
  );
};

export default SearchBar;
