import type { Snowflake } from 'discord-api-types';
import { useCallback, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';

import {
  AutoResetLevels,
  Channel,
  DatabaseGuild,
  Multiplier,
  Role,
  UserGuild,
} from '../../../graphql/queries/UserGuild';
import Input from '../../Input';
import BasicSelect from '../BasicSelect';
import Header from '../Header';
import Label from '../Label';
import Selector from '../Selector';
import XpMultiplier from '../XpMultiplier';
import XpRole from '../XpRole';

interface LevelingProps {
  channels: Channel[];
  database: UserGuild['getDatabaseGuild'];
  roles: Role[];
}

enum ResponseType {
  CHANNEL = 'custom-channel',
  DM = 'dm',
  NONE = 'none',
  SAME_CHANNEL = 'channel',
}

const resolveXpResponseNameByType = (type: ResponseType) =>
  type === ResponseType.CHANNEL
    ? 'Custom Channels'
    : type === ResponseType.DM
    ? 'DM'
    : type === ResponseType.NONE
    ? 'None'
    : 'Same Channel';

const resolveXpResponseTypeByName = (name: string) =>
  name === 'Custom Channels'
    ? ResponseType.CHANNEL
    : name === 'DM'
    ? ResponseType.DM
    : name === 'None'
    ? ResponseType.NONE
    : ResponseType.SAME_CHANNEL;

const resolveAutoResetLevelsNameByType = (type: AutoResetLevels) =>
  type === AutoResetLevels.BAN
    ? 'Ban'
    : type === AutoResetLevels.LEAVE
    ? 'Leave'
    : type === AutoResetLevels.BOTH
    ? 'Ban & Leave'
    : 'None';

const resolveAutoResetLevelsTypeByName = (name: string) =>
  name === 'Ban & Leave'
    ? AutoResetLevels.BOTH
    : name === 'Ban'
    ? AutoResetLevels.BAN
    : name === 'Leave'
    ? AutoResetLevels.LEAVE
    : AutoResetLevels.NONE;

const resolveInitialXpResponseType = (database: DatabaseGuild | null) =>
  database
    ? database.xpResponseType
      ? /^\d+$/.test(database.xpResponseType)
        ? ResponseType.CHANNEL
        : database.xpResponseType
      : ResponseType.NONE
    : ResponseType.SAME_CHANNEL;

const resolveInitialXpResponseChannel = (database: DatabaseGuild | null) =>
  database?.xpResponseType
    ? /^\d+$/.test(database.xpResponseType)
      ? (database.xpResponseType as Snowflake)
      : null
    : null;

let timeout: NodeJS.Timeout;

export default function Leveling({ channels, database, roles }: LevelingProps) {
  const [levels, setLevels] = useState<boolean>(database?.levels ?? false);
  const [xpMessage, setXpMessage] = useState(database?.xpMessage ?? '[insert default message here]');
  const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseType(database));
  const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>('');
  const [xpRoles, setXpRoles] = useState<Record<string, Snowflake[]>>(database?.xpRoles ?? {});
  const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);
  const [xpResponseChannel, setXpResponseChannel] = useState<Snowflake | null>(
    resolveInitialXpResponseChannel(database),
  );
  const [stackXpRoles, setStackXpRoles] = useState<boolean>(database?.stackXpRoles ?? true);
  const [xpChannels, setXpChannels] = useState<Snowflake[]>(
    database?.xpWhitelistedChannels ?? database?.xpBlacklistedChannels ?? [],
  );
  const [xpChannelsType, setXpChannelsType] = useState<'whitelist' | 'blacklist'>(
    database?.xpBlacklistedChannels ? 'blacklist' : 'whitelist',
  );
  const [topXpRole, setTopXpRole] = useState<Snowflake | null>(database?.topXpRole ?? null);
  const [noXpRoles, setNoXpRoles] = useState<Snowflake[]>(database?.noXpRoles ?? []);
  const [autoResetLevels, setAutoResetLevels] = useState<AutoResetLevels>(
    database ? database.autoResetLevels : AutoResetLevels.NONE,
  );
  const [xpMultipliers, setXpMultipliers] = useState<Multiplier[]>(database?.xpMultipliers ?? []);
  const [newXpMultiplierType, setNewXpMultiplierType] = useState<Multiplier['type']>('channel');
  const [prioritiseMultiplierRoleHierarchy, setPrioritiseMultiplierRoleHierarchy] = useState(
    database?.prioritiseMultiplierRoleHierarchy ?? false,
  );

  const handleNewXpRoleCreated = useCallback(() => {
    const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));
    const level = parseInt(newXpRolesLevel, 10);

    if (newXpRolesLevel in clone || level <= 0 || level > 500) {
      if (newXpRoleSubmitRef.current) newXpRoleSubmitRef.current.style.color = '#ff0000';

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (newXpRoleSubmitRef.current) newXpRoleSubmitRef.current.style.color = '#fff';
      }, 1_000);
    } else {
      clone[level] = [];
      setXpRoles(clone);
    }
  }, [newXpRolesLevel, xpRoles, newXpRoleSubmitRef]);

  const handleXpRolesClear = useCallback(
    (level: number) => {
      const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete clone[level];
      setXpRoles(clone);
    },
    [xpRoles],
  );

  const handleXpRolesChange = useCallback(
    (roleId: Snowflake, level: number, type: 'add' | 'remove') => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const levelXpRoles = xpRoles[level.toString()] ?? [];
      const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));

      if (type === 'add') {
        levelXpRoles.push(roleId);
        clone[level] = levelXpRoles;
        return setXpRoles(clone);
      }

      const roleIndex = levelXpRoles.findIndex((i) => i === roleId);
      if (!roleIndex) return console.error("[Leveling] Couldn't find item index when user tried removing a level role");

      levelXpRoles.splice(roleIndex, 1);
      clone[level] = levelXpRoles;
      return setXpRoles(clone);
    },
    [xpRoles],
  );

  const handleXpChannelsChange = useCallback(
    (channelId: Snowflake, type: 'add' | 'remove') => {
      const clone = [...xpChannels];
      if (type === 'add') {
        return setXpChannels([...clone, channelId]);
      }

      const channelIndex = clone.findIndex((i) => channelId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      return setXpChannels(clone);
    },
    [xpChannels],
  );

  const handleNoXpRolesChange = useCallback(
    (roleId: Snowflake, type: 'add' | 'remove') => {
      const clone = [...noXpRoles];
      if (type === 'add') {
        return setNoXpRoles([...clone, roleId]);
      }

      const roleIndex = clone.findIndex((i) => roleId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      return setNoXpRoles(clone);
    },
    [noXpRoles],
  );

  return (
    <>
      <div className="flex flex-row justify-between">
        <Header description="Allow users to gain xp and level up by sending messages." title="Leveling" />

        <div>
          <div className="flex flex-row gap-x-4 items-center">
            <label className="text-white" htmlFor="levels">
              Enabled
            </label>

            <input
              checked={levels}
              className="w-4 h-4"
              type="checkbox"
              id="levels"
              onChange={() => setLevels(!levels)}
            />
          </div>
        </div>
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
              initialItem={resolveXpResponseNameByType(ResponseType.SAME_CHANNEL)}
              items={['Same Channel', 'DM', 'Custom Channel', 'None']}
              onSelect={(i) => setXpResponseType(resolveXpResponseTypeByName(i))}
            />
          </div>

          {xpResponseType === ResponseType.CHANNEL && (
            <Selector
              id="xpResponseType"
              initialItems={xpResponseChannel ? [xpResponseChannel] : []}
              items={channels}
              limit={1}
              onSelect={(channelId, type) => setXpResponseChannel(type === 'add' ? channelId : null)}
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

          {Object.keys(xpRoles).length < 100 && (
            <Input
              id="newXpRole"
              maxLength={3}
              onChange={(e) =>
                e.target.value
                  ? /^\d+$/.test(e.target.value) && setNewXpRolesLevel(e.target.value)
                  : setNewXpRolesLevel('')
              }
              onClear={() => setNewXpRolesLevel('')}
              onSubmit={handleNewXpRoleCreated}
              placeholder="Enter a level to reward roles to"
              submitRef={newXpRoleSubmitRef}
              value={newXpRolesLevel}
            />
          )}

          <div className="flex flex-col gap-2 divide-y-2 divide-gray-400">
            {Object.keys(xpRoles).map((level) => (
              <XpRole
                key={level}
                level={parseInt(level, 10)}
                initialRoles={xpRoles[level]}
                onClear={handleXpRolesClear}
                onChange={handleXpRolesChange}
                roles={roles}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-x-4 items-center">
            <Label
              htmlFor="stackXpRoles"
              name="Stack XP Roles"
              url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-role-stacking"
            />

            <input
              checked={stackXpRoles}
              className="w-4 h-4"
              type="checkbox"
              id="stackXpRoles"
              onChange={() => setStackXpRoles(!stackXpRoles)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="xpChannels"
            name={`XP ${xpChannelsType === 'blacklist' ? 'Blacklisted' : 'Whitelisted'} Channels`}
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-allowed-channels"
          />

          <div className="flex flex-row justify-start">
            <button
              className="text-white w-[fit-content] bg-discord-not-quite-black px-2 py-1.5 rounded-md shadow-sm duration-150 transition-colors active:bg-discord-dark focus:outline-none"
              onClick={() => setXpChannelsType(xpChannelsType === 'blacklist' ? 'whitelist' : 'blacklist')}
            >
              Click to use a {xpChannelsType === 'blacklist' ? 'whitelist' : 'blacklist'} instead
            </button>
          </div>

          <Selector
            id="xpChannels"
            initialItems={database?.xpBlacklistedChannels ?? database?.xpWhitelistedChannels ?? []}
            items={channels}
            limit={50}
            onSelect={handleXpChannelsChange}
            type="channel"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="topXpRole"
            name="Top XP Role"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-the-top-xp-role"
          />

          <Selector
            id="topXpRole"
            initialItems={topXpRole ? [topXpRole] : []}
            items={roles}
            limit={1}
            onSelect={(roleId, type) => setTopXpRole(type === 'add' ? roleId : null)}
            type="role"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="noXpRoles"
            name="No-XP Role"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-no-xp-roles"
          />

          <Selector
            id="noXpRoles"
            initialItems={database?.noXpRoles ?? []}
            items={roles}
            limit={30}
            onSelect={handleNoXpRolesChange}
            type="role"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="autoResetLevels"
            name="Auto Reset Levels"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#automatically-resetting-levels"
          />

          <BasicSelect
            initialItem={resolveAutoResetLevelsNameByType(autoResetLevels)}
            items={['None', 'Leave', 'Ban', 'Ban & Leave']}
            onSelect={(i) => setAutoResetLevels(resolveAutoResetLevelsTypeByName(i))}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="xpMultipliers"
            name="XP Multipliers"
            url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
          />

          {Object.keys(xpMultipliers).length < 20 && (
            <>
              <p className="text-white">Create a new multiplier</p>

              <div className="flex flex-row gap-4">
                <BasicSelect
                  initialItem={'Channel'}
                  items={
                    xpMultipliers.some((m) => m.type === 'global') ? ['Channel', 'Role'] : ['Channel', 'Global', 'Role']
                  }
                  onSelect={(item) => setNewXpMultiplierType(item.toLowerCase() as Multiplier['type'])}
                />

                <button
                  className="flex-shrink-0 h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center text-white duration-150 transition-colors"
                  onClick={() =>
                    setXpMultipliers([
                      ...xpMultipliers,
                      {
                        multiplier: 1,
                        targets: newXpMultiplierType === 'global' ? null : [],
                        type: newXpMultiplierType,
                      },
                    ])
                  }
                >
                  <IoMdSend className="fill-current text-3xl" />
                </button>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 divide-y-2 divide-gray-400">
            {xpMultipliers.map(({ multiplier, targets, type }, i) => (
              <XpMultiplier
                channels={channels}
                index={i}
                key={i}
                multiplier={multiplier}
                onClear={console.log}
                roles={roles}
                targets={targets}
                type={type}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="prioritiseMultiplierRoleHierarchy"
            name="XP Multiplier Priority"
            url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
          />

          <BasicSelect
            closeOnSelect
            initialItem={prioritiseMultiplierRoleHierarchy ? 'Role Hierarchy' : 'Multiplier Value'}
            items={['Role Hierarchy', 'Multiplier Value']}
            onSelect={(i) => setPrioritiseMultiplierRoleHierarchy(i === 'Role Hierarchy')}
          />
        </div>
      </div>
    </>
  );
}
