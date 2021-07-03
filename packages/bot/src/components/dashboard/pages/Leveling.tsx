import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';

import { GuildContext } from '../../../contexts/GuildContext';
import { AutoResetLevels, Channel, DatabaseGuild, Multiplier, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import { parseMultiplier } from '../../../utils/utils';
import BasicSelect from '../../Form/BasicSelect';
import Field from '../../Form/Field';
import Fieldset from '../../Form/Fieldset';
import Input from '../../Form/Input';
import Label from '../../Form/Label';
import Selector, { OnSelectFn } from '../../Form/Selector';
import Header from '../Header';
import XpMultiplier, {
  XpMultiplierOnDeleteFn,
  XpMultiplierOnItemChangeFn,
  XpMultiplierOnMultiplierChangeFn,
} from '../XpMultiplier';
import XpRole, { XpRoleOnChangeFn, XpRoleOnClearFn } from '../XpRole';

interface LevelingProps {
  channels: Channel[];
  database: DatabaseGuild | null;
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
    : DATABASE_DEFAULTS.xpResponseType;

const resolveInitialXpResponseChannel = (database: DatabaseGuild | null) =>
  database?.xpResponseType
    ? /^\d+$/.test(database.xpResponseType)
      ? (database.xpResponseType as Snowflake)
      : null
    : null;

let timeout: NodeJS.Timeout;

export default function Leveling({ channels, database, roles }: LevelingProps) {
  const [levels, setLevels] = useState<boolean>(database?.levels ?? DATABASE_DEFAULTS.levels);
  const [xpMessage, setXpMessage] = useState(database?.xpMessage ?? DATABASE_DEFAULTS.xpMessage);
  const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseType(database));
  const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>('');
  const [xpRoles, setXpRoles] = useState<Record<string, Snowflake[]>>(database?.xpRoles ?? {});
  const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);
  const [xpResponseChannel, setXpResponseChannel] = useState<Snowflake | null>(
    resolveInitialXpResponseChannel(database),
  );
  const [stackXpRoles, setStackXpRoles] = useState<boolean>(database?.stackXpRoles ?? DATABASE_DEFAULTS.stackXpRoles);
  const [xpChannels, setXpChannels] = useState<Snowflake[]>(
    database?.xpWhitelistedChannels ?? database?.xpBlacklistedChannels ?? [],
  );
  const [xpChannelsType, setXpChannelsType] = useState<'whitelist' | 'blacklist'>(
    database?.xpBlacklistedChannels ? 'blacklist' : 'whitelist',
  );
  const [topXpRole, setTopXpRole] = useState<Snowflake | null>(database?.topXpRole ?? null);
  const [noXpRoles, setNoXpRoles] = useState<Snowflake[]>(database?.noXpRoles ?? []);
  const [autoResetLevels, setAutoResetLevels] = useState<AutoResetLevels>(
    database ? database.autoResetLevels : DATABASE_DEFAULTS.autoResetLevels,
  );
  const [xpMultipliers, setXpMultipliers] = useState<(Omit<Multiplier, 'multiplier'> & { multiplier: string })[]>(
    database?.xpMultipliers.map((m) => ({ ...m, multiplier: m.multiplier.toString() })) ?? [],
  );
  const [newXpMultiplierType, setNewXpMultiplierType] = useState<Multiplier['type']>('channel');
  const [prioritiseMultiplierRoleHierarchy, setPrioritiseMultiplierRoleHierarchy] = useState(
    database?.prioritiseMultiplierRoleHierarchy ?? DATABASE_DEFAULTS.prioritiseMultiplierRoleHierarchy,
  );
  const { addChange } = useContext(GuildContext);

  const handleNewXpRoleCreated: () => unknown = useCallback(() => {
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
      addChange('xpRoles', clone);
    }
  }, [addChange, newXpRolesLevel, xpRoles, newXpRoleSubmitRef]);

  const handleXpRolesClear: XpRoleOnClearFn = useCallback(
    (level) => {
      const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete clone[level];
      setXpRoles(clone);
      addChange('xpRoles', clone);
    },
    [addChange, xpRoles],
  );

  const handleXpRolesChange: XpRoleOnChangeFn = useCallback(
    (roleId, level, type) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const levelXpRoles = xpRoles[level.toString()] ?? [];
      const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));

      if (type === 'add') {
        levelXpRoles.push(roleId);
        clone[level] = levelXpRoles;
        setXpRoles(clone);
        return addChange('xpRoles', clone);
      }

      const roleIndex = levelXpRoles.findIndex((i) => i === roleId);
      if (!roleIndex) return console.error("[Leveling] Couldn't find item index when user tried removing a level role");

      levelXpRoles.splice(roleIndex, 1);
      clone[level] = levelXpRoles;
      setXpRoles(clone);
      addChange('xpRoles', clone);
    },
    [addChange, xpRoles],
  );

  const handleXpChannelsChange: OnSelectFn = useCallback(
    (channelId, type) => {
      if (type === 'add') {
        const finalChannels = [...xpChannels, channelId];
        setXpChannels(finalChannels);
        return addChange(
          xpChannelsType === 'whitelist' ? 'xpWhitelistedChannels' : 'xpBlacklistedChannels',
          finalChannels,
        );
      }

      const clone = [...xpChannels];
      const channelIndex = clone.findIndex((i) => channelId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      setXpChannels(clone);
      addChange(xpChannelsType === 'whitelist' ? 'xpWhitelistedChannels' : 'xpBlacklistedChannels', clone);
    },
    [addChange, xpChannels, xpChannelsType],
  );

  const handleNoXpRolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        const finalRoles = [...noXpRoles, roleId];
        setNoXpRoles(finalRoles);
        return addChange('noXpRoles', finalRoles);
      }

      const clone = [...noXpRoles];
      const roleIndex = clone.findIndex((i) => roleId === i);
      if (roleIndex < 0) return;

      clone.splice(roleIndex, 1);
      setNoXpRoles(clone);
      addChange('noXpRoles', clone);
    },
    [addChange, noXpRoles],
  );

  const handleXpMultiplierDelete: XpMultiplierOnDeleteFn = useCallback(
    (index) => {
      const clone = [...xpMultipliers];
      if (!(index in clone)) {
        return console.log(
          '[Leveling] Index provided was not presented in the xp multipliers array when the user tried deleting a multiplier',
        );
      }

      clone.splice(index, 1);
      setXpMultipliers(clone);
      addChange(
        'xpMultipliers',
        clone.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN })),
      );
    },
    [addChange, xpMultipliers],
  );

  const handleXpMultiplierItemsChange: XpMultiplierOnItemChangeFn = useCallback(
    (itemId, index, type) => {
      const clone = [...xpMultipliers];
      if (!(index in clone)) {
        return console.log(
          '[Leveling] Index provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier',
        );
      }

      const multiplier = clone[index];
      if (!multiplier.targets) {
        return console.log(
          '[Leveling] The multiplier found did not have targets when the user tried changing the items of a multiplier',
        );
      }

      if (type === 'add') {
        multiplier.targets.push(itemId);
        clone[index] = multiplier;
        setXpMultipliers(clone);
        return addChange(
          'xpMultipliers',
          clone.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN })),
        );
      }

      const itemIndex = multiplier.targets.findIndex((i) => i === itemId);
      if (itemIndex < 0) {
        return console.log("[Leveling] Couldn't find item index when user tried removing an item from a xp multiplier");
      }

      multiplier.targets.splice(itemIndex, 1);
      clone[index] = multiplier;

      setXpMultipliers(clone);
      addChange(
        'xpMultipliers',
        clone.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN })),
      );
    },
    [addChange, xpMultipliers],
  );

  const handleXpMultiplierValueChange: XpMultiplierOnMultiplierChangeFn = useCallback(
    (multiplier, index) => {
      const clone = [...xpMultipliers];
      if (!(index in clone)) {
        return console.log(
          '[Leveling] Index provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier',
        );
      }

      const xpMultiplier = clone[index];
      xpMultiplier.multiplier = multiplier;

      clone[index] = xpMultiplier;
      setXpMultipliers(clone);
      addChange(
        'xpMultipliers',
        clone.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN })),
      );
    },
    [addChange, xpMultipliers],
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
              onChange={() => {
                setLevels(!levels);
                addChange('levels', !levels);
              }}
            />
          </div>
        </div>
      </div>

      <Fieldset>
        <Field>
          <Label
            htmlFor="xpMessage"
            name="XP Message"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
          />
          <Input
            id="xpMessage"
            maxLength={DATABASE_LIMITS.xpMessage.maxLength}
            onChange={({ target }) => {
              if (target.value.length > DATABASE_LIMITS.xpMessage.maxLength) return;
              setXpMessage(target.value);
              addChange('xpMessage', target.value);
            }}
            onClear={() => {
              setXpMessage('');
              addChange('xpMessage', '');
            }}
            placeholder="Enter the level up message"
            value={xpMessage}
          />
        </Field>

        <Field>
          <Label
            htmlFor="xpResponseType"
            name="XP Response Channel"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
          />
          <BasicSelect
            initialItem={resolveXpResponseNameByType(ResponseType.SAME_CHANNEL)}
            items={['Same Channel', 'DM', 'Custom Channel', 'None']}
            onSelect={(i) => {
              const type = resolveXpResponseTypeByName(i);
              setXpResponseType(type);
              if (type === ResponseType.DM || type === ResponseType.SAME_CHANNEL) addChange('xpResponseType', type);
              else if (type === ResponseType.NONE) addChange('xpResponseType', null);
            }}
          />
          <div>
            {xpResponseType === ResponseType.CHANNEL && (
              <Selector
                id="xpResposnseType"
                initialItems={xpResponseChannel ? [xpResponseChannel] : []}
                items={channels}
                limit={1}
                onSelect={(channelId, type) => {
                  const finalChannel = type === 'add' ? channelId : null;
                  setXpResponseChannel(finalChannel);
                  addChange('xpResponseType', finalChannel);
                }}
                type="channel"
              />
            )}
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpRoles"
            name="XP Roles"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-role-rewards"
          />
          <div>
            {Object.keys(xpRoles).length < 100 && (
              <Input
                id="newXpRole"
                maxLength={3}
                onChange={({ target }) =>
                  target.value ? /^\d+$/.test(target.value) && setNewXpRolesLevel(target.value) : setNewXpRolesLevel('')
                }
                onClear={() => setNewXpRolesLevel('')}
                onSubmit={handleNewXpRoleCreated}
                placeholder="Enter a level to reward roles to"
                submitRef={newXpRoleSubmitRef}
                value={newXpRolesLevel}
              />
            )}
          </div>
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
        </Field>

        <Field direction="row">
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
            onChange={() => {
              setStackXpRoles(!stackXpRoles);
              addChange('stackXpRoles', !stackXpRoles);
            }}
          />
        </Field>

        <Field>
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
            limit={DATABASE_LIMITS.xpChannels.maxLength}
            onSelect={handleXpChannelsChange}
            type="channel"
          />
        </Field>

        <Field>
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
            onSelect={(roleId, type) => {
              const finalRole = type === 'add' ? roleId : null;
              setTopXpRole(finalRole);
              addChange('topXpRole', finalRole);
            }}
            type="role"
          />
        </Field>

        <Field>
          <Label
            htmlFor="noXpRoles"
            name="No-XP Role"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-no-xp-roles"
          />
          <Selector
            id="noXpRoles"
            initialItems={database?.noXpRoles ?? []}
            items={roles}
            limit={DATABASE_LIMITS.noXpRoles.maxLength}
            onSelect={handleNoXpRolesChange}
            type="role"
          />
        </Field>

        <Field>
          <Label
            htmlFor="autoResetLevels"
            name="Auto Reset Levels"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#automatically-resetting-levels"
          />
          <BasicSelect
            initialItem={resolveAutoResetLevelsNameByType(autoResetLevels)}
            items={['None', 'Leave', 'Ban', 'Ban & Leave']}
            onSelect={(i) => {
              const value = resolveAutoResetLevelsTypeByName(i);
              setAutoResetLevels(value);
              addChange('autoResetLevels', value);
            }}
          />
        </Field>

        <Field>
          <Label
            htmlFor="xpMultipliers"
            name="XP Multipliers"
            url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
          />
          <div>
            {Object.keys(xpMultipliers).length <= 20 && (
              <>
                <p className="text-white">Create a new multiplier</p>
                <div className="flex flex-row gap-4">
                  <BasicSelect
                    initialItem={'Channel'}
                    items={
                      xpMultipliers.some((m) => m.type === 'global')
                        ? ['Channel', 'Role']
                        : ['Channel', 'Global', 'Role']
                    }
                    onSelect={(item) => setNewXpMultiplierType(item.toLowerCase() as Multiplier['type'])}
                  />
                  <button
                    className="flex-shrink-0 h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center text-white duration-150 transition-colors"
                    onClick={() => {
                      const finalMultipliers = [
                        ...xpMultipliers,
                        {
                          multiplier: '1',
                          targets: newXpMultiplierType === 'global' ? null : [],
                          type: newXpMultiplierType,
                        },
                      ];
                      setXpMultipliers(finalMultipliers);
                      addChange(
                        'xpMultipliers',
                        finalMultipliers.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN })),
                      );
                    }}
                  >
                    <IoMdSend className="fill-current text-3xl" />
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 divide-y-2 divide-gray-400">
            {xpMultipliers.map(({ multiplier, targets, type }, i) => (
              <XpMultiplier
                channels={channels}
                index={i}
                key={i}
                multiplier={multiplier}
                onDelete={handleXpMultiplierDelete}
                onItemChange={handleXpMultiplierItemsChange}
                onMultiplierChange={handleXpMultiplierValueChange}
                roles={roles}
                targets={targets}
                type={type}
              />
            ))}
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="prioritiseMultiplierRoleHierarchy"
            name="XP Multiplier Priority"
            url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
          />
          <BasicSelect
            closeOnSelect
            initialItem={prioritiseMultiplierRoleHierarchy ? 'Role Hierarchy' : 'Multiplier Value'}
            items={['Role Hierarchy', 'Multiplier Value']}
            onSelect={(i) => {
              const value = i === 'Role Hierarchy';
              setPrioritiseMultiplierRoleHierarchy(value);
              addChange('prioritiseMultiplierRoleHierarchy', value);
            }}
          />
        </Field>
      </Fieldset>
    </>
  );
}
