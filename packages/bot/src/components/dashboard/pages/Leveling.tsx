import type { Snowflake } from 'discord-api-types';
import { useState } from 'react';

import type { Channel, DatabaseGuild, Role, UserGuild } from '../../../graphql/queries/UserGuild';
import Input from '../../Input';
import BasicSelect from '../BasicSelect';
import Header from '../Header';
import Label from '../Label';
import Selector from '../Selector';

interface LevelingProps {
  channels: Channel[];
  database: UserGuild['getDatabaseGuild'];
  roles: Role[];
}

enum ResponseType {
  Channel = 'custom-channel',
  DM = 'dm',
  None = 'none',
  SameChannel = 'channel',
}

const resolveXpResponseTypeNameByType = (type: ResponseType) =>
  type === ResponseType.Channel
    ? 'Custom Channels'
    : type === ResponseType.DM
    ? 'DM'
    : type === ResponseType.None
    ? 'None'
    : 'Same Channel';

const resolveXpResponseTypeByName = (name: string) =>
  name === 'Custom Channels'
    ? ResponseType.Channel
    : name === 'DM'
    ? ResponseType.DM
    : name === 'None'
    ? ResponseType.None
    : ResponseType.SameChannel;

const resolveInitialXpResponseType = (database: DatabaseGuild | null) =>
  database
    ? database.xpResponseType
      ? /^\d+$/.test(database.xpResponseType)
        ? ResponseType.Channel
        : database.xpResponseType
      : ResponseType.None
    : ResponseType.SameChannel;

export default function Leveling({ channels, database }: LevelingProps) {
  const [xpMessage, setXpMessage] = useState(database?.xpMessage ?? '[insert default message here]');
  const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseType(database));
  const [xpResponseChannel, setXpResponseChannel] = useState<Snowflake | null>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (database?.xpResponseType && /^\d+$/.test(database.xpResponseType) && (database.xpResponseType as Snowflake)) ||
      null,
  );
  // const [xpRoles, setXpRoles] = useState<Record<Snowflake, Snowflake[]>>(database?.xpRoles ?? {});

  return (
    <>
      <div className="flex flex-row justify-between">
        <Header description="Allow users to gain xp and level up by sending messages." title="Leveling" />

        <div className="text-white">Enable</div>
      </div>

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="xpMessage"
            name="XP Message"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
          />

          <Input
            id="xpMessage"
            maxLength={1_000}
            onChange={(e) => e.target.value.length <= 1_000 && setXpMessage(e.target.value)}
            onClear={() => setXpMessage('')}
            placeholder="Enter the XP message"
            value={xpMessage}
          />
        </div>

        <div className="flex flex-row gap-3">
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="xpResponseType"
              name="XP Response Channel"
              url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
            />

            <BasicSelect
              initialItem={resolveXpResponseTypeNameByType(ResponseType.SameChannel)}
              items={['Same Channel', 'DM', 'Custom Channel', 'None']}
              onSelect={(i) => setXpResponseType(resolveXpResponseTypeByName(i))}
            />
          </div>

          {xpResponseType === ResponseType.Channel && (
            <Selector
              initialItems={xpResponseChannel ? [xpResponseChannel] : []}
              items={channels}
              limit={1}
              onSelect={(itemId, type) => setXpResponseChannel(type === 'add' ? itemId : null)}
              type="channel"
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="xpRoles"
            name="XP Roles"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-role-rewards"
          />

          <div className="flex flex-col gap-2 border-x-2 border-gray-400">
            {/* {Object.keys(xpRoles).map(() => (
              // this needs to be a separate component
               <div className="flex flex-row gap-3 px-3 py-2">
                 <span className="text-white" id={`level-${level}`}>
                   {level}
                 </span>

                 <Input
                   id={`level-${level}`}
                   maxLength={25}
                   placeholder={`Enter the role rewards for level ${level}`}
                   value={}
                 />
               </div>
            ))} */}
          </div>
        </div>
      </div>
    </>
  );
}
