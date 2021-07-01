import type { Snowflake } from 'discord-api-types';
import { useState } from 'react';

import type { Channel, DatabaseGuild } from '../../../graphql/queries/UserGuild';
import { DATABASE_DEFAULTS } from '../../../utils/constants';
import Header from '../Header';
import Label from '../Label';
import Selector from '../Selector';

interface EmojiListProps {
  channels: Channel[];
  database: DatabaseGuild | null;
}

export default function EmojiList({ channels, database }: EmojiListProps) {
  const [emojiList, setEmojiList] = useState<boolean>(database?.emojiList ?? DATABASE_DEFAULTS.emojiList);
  const [, setEmojiListChannel] = useState<Snowflake | null>(database?.emojiListChannel ?? null);

  return (
    <>
      <div className="flex flex-row justify-between">
        <Header description="Automatically populate a channel with all the emojis in your server." title="Emoji List" />

        <div>
          <div className="flex flex-row gap-x-4 items-center">
            <label className="text-white" htmlFor="emojiList">
              Enabled
            </label>

            <input
              checked={emojiList}
              className="w-4 h-4"
              type="checkbox"
              id="emojiList"
              onChange={() => setEmojiList(!emojiList)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="emojiListChannel"
            name="Emoji List Channel"
            url="https://docs.pepemanager.com/guides/automatically-controlled-emoji-list"
          />

          <Selector
            id="emojiListChannel"
            limit={1}
            initialItems={database?.emojiListChannel ? [database.emojiListChannel] : []}
            items={channels}
            onSelect={(channelId, type) => setEmojiListChannel(type === 'add' ? channelId : null)}
            type="channel"
          />
        </div>
      </div>
    </>
  );
}
