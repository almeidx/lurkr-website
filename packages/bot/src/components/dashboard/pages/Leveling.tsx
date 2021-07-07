import type { Snowflake } from 'discord-api-types';
import { MouseEventHandler, useCallback, useContext, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';

import { GuildContext } from '../../../contexts/GuildContext';
import { AutoResetLevels, Channel, DatabaseGuild, Multiplier, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import { parseMultiplier } from '../../../utils/utils';
import BasicSelect from '../../form/BasicSelect';
import Checkbox from '../../form/Checkbox';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Textarea from '../../form/Textarea';
import Header from '../Header';
import XpMultiplier, {
  XpMultiplierOnDeleteFn,
  XpMultiplierOnItemChangeFn,
  XpMultiplierOnMultiplierChangeFn,
} from '../XpMultiplier';
import XpRole, { XpRoleOnChangeFn } from '../XpRole';

interface LevelingProps {
  channels: Channel[];
  database: DatabaseGuild;
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
    ? 'Custom Channel'
    : type === ResponseType.DM
    ? 'DM'
    : type === ResponseType.NONE
    ? 'None'
    : 'Same Channel';

const resolveXpResponseTypeByName = (name: string) =>
  name === 'Custom Channel'
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

const resolveInitialXpResponseType = (database: DatabaseGuild) =>
  database.xpResponseType
    ? /^\d+$/.test(database.xpResponseType)
      ? ResponseType.CHANNEL
      : database.xpResponseType
    : ResponseType.NONE;

const resolveInitialXpResponseChannel = (database: DatabaseGuild): Snowflake[] =>
  database.xpResponseType ? (/^\d+$/.test(database.xpResponseType) ? [database.xpResponseType as Snowflake] : []) : [];

const resolveMultiplier = (multipliers: (Omit<Multiplier, 'multiplier'> & { multiplier: string })[]) =>
  multipliers.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN }));

const prioritiseMultiplierValues = ['Role Hierarchy', 'Multiplier Value'];

let timeout: NodeJS.Timeout;

export default function Leveling({ channels, database, roles }: LevelingProps) {
  const [featureEnabled, setFeatureEnabled] = useState<boolean>(database.levels);
  const [xpRoles, setXpRoles] = useState<Record<string, Snowflake[]>>(database.xpRoles);
  const [xpChannels, setXpChannels] = useState<Snowflake[]>(
    database.xpWhitelistedChannels ?? database.xpBlacklistedChannels ?? [],
  );
  const [xpMultipliers, setXpMultipliers] = useState<(Omit<Multiplier, 'multiplier'> & { multiplier: string })[]>(
    database.xpMultipliers.map((m) => ({ ...m, multiplier: m.multiplier.toString() })),
  );
  const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseType(database));
  const [xpChannelsType, setXpChannelsType] = useState<'whitelist' | 'blacklist'>(
    database.xpBlacklistedChannels ? 'blacklist' : 'whitelist',
  );
  const [newXpMultiplierType, setNewXpMultiplierType] = useState<Multiplier['type']>('channel');
  const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>('');
  const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);
  const { addChange, changes, removeChange } = useContext(GuildContext);

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

  const handleXpRolesChange: XpRoleOnChangeFn = useCallback(
    (roleIds, level) => {
      const clone: Record<string, Snowflake[]> = JSON.parse(JSON.stringify(xpRoles));

      if (roleIds.length) clone[level] = roleIds;
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      else delete clone[level];

      setXpRoles(clone);
      addChange('xpRoles', clone);
    },
    [addChange, xpRoles],
  );

  const handleXpChannelsTypeChange: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    const currentType = `${xpChannelsType}` as const;
    setXpChannelsType(currentType === 'blacklist' ? 'whitelist' : 'blacklist');

    const clone: Partial<DatabaseGuild> = JSON.parse(JSON.stringify(changes));

    if (currentType === 'blacklist') {
      if ('xpBlacklistedChannels' in clone) removeChange('xpBlacklistedChannels');
      return addChange('xpWhitelistedChannels', xpChannels);
    }

    if ('xpWhitelistedChannels' in clone) removeChange('xpWhitelistedChannels');
    addChange('xpBlacklistedChannels', xpChannels);
  }, [addChange, changes, removeChange, xpChannels, xpChannelsType]);

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
      addChange('xpMultipliers', resolveMultiplier(clone));
    },
    [addChange, xpMultipliers],
  );

  const handleXpMultiplierItemsChange: XpMultiplierOnItemChangeFn = useCallback(
    (itemIds, index) => {
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

      multiplier.targets = itemIds;
      clone[index] = multiplier;
      setXpMultipliers(clone);
      addChange('xpMultipliers', resolveMultiplier(clone));
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
      addChange('xpMultipliers', resolveMultiplier(clone));
    },
    [addChange, xpMultipliers],
  );

  return (
    <>
      <div className="flex flex-row justify-between">
        <Header description="Allow users to gain xp and level up by sending messages." title="Leveling" />

        <div>
          <div className="flex flex-row gap-x-3 items-center">
            <label className="text-white" htmlFor="levels">
              Enabled
            </label>

            <Checkbox
              id="levels"
              initialValue={database.levels}
              onChange={(v) => {
                addChange('levels', v);
                setFeatureEnabled(!featureEnabled);
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
          <Textarea
            initialText={database.xpMessage}
            id="xpMessage"
            maxLength={DATABASE_LIMITS.xpMessage.maxLength}
            onChange={(t) => addChange('xpMessage', t)}
            placeholder="Enter the level up message"
            disabled={!featureEnabled}
          />
        </Field>

        <Field>
          <Label
            htmlFor="xpResponseType"
            name="XP Response Channel"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
          />

          <div className="flex flex-row gap-x-4">
            <BasicSelect
              disabled={!featureEnabled}
              closeOnSelect
              initialItem={resolveXpResponseNameByType(ResponseType.SAME_CHANNEL)}
              items={['Same Channel', 'DM', 'Custom Channel', 'None']}
              onSelect={(i) => {
                const type = resolveXpResponseTypeByName(i);
                setXpResponseType(type);
                if (type === ResponseType.DM || type === ResponseType.SAME_CHANNEL) addChange('xpResponseType', type);
                else if (type === ResponseType.NONE) addChange('xpResponseType', null);
                else addChange('xpResponseType', '123');
              }}
            />
            {xpResponseType === ResponseType.CHANNEL && (
              <Selector
                disabled={!featureEnabled}
                id="xpResponseTypeChannel"
                initialItems={resolveInitialXpResponseChannel(database)}
                items={channels}
                limit={1}
                onSelect={(c) => addChange('xpResponseType', c[0] ?? null)}
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
          <div className="mb-4">
            {Object.keys(xpRoles).length < 100 && (
              <div className="max-w-[21rem]">
                <Input
                  disabled={!featureEnabled}
                  id="newXpRole"
                  initialValue={''}
                  maxLength={3}
                  onChange={(t) => (t ? /^\d+$/.test(t) && setNewXpRolesLevel(t) : setNewXpRolesLevel(''))}
                  onSubmit={handleNewXpRoleCreated}
                  placeholder="Enter a level to reward roles to"
                  submitRef={newXpRoleSubmitRef}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 divide-y-2 divide-gray-400">
            {Object.keys(xpRoles).map((level) => (
              <XpRole
                key={level}
                level={parseInt(level, 10)}
                initialRoles={xpRoles[level]}
                onChange={handleXpRolesChange}
                roles={roles}
              />
            ))}
          </div>
        </Field>

        <Field direction="row">
          <div className="flex flex-row gap-x-3 items-center">
            <Checkbox
              disabled={!featureEnabled}
              id="stackXpRoles"
              initialValue={database.stackXpRoles}
              onChange={(v) => addChange('stackXpRoles', v)}
            />

            <Label
              htmlFor="stackXpRoles"
              name="Stack XP Roles"
              url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-role-stacking"
              withMargin={false}
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpChannels"
            name={`XP ${xpChannelsType === 'blacklist' ? 'Blacklisted' : 'Whitelisted'} Channels`}
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-allowed-channels"
          />
          <div className="flex flex-row justify-start mb-3">
            <button
              disabled={!featureEnabled}
              className="text-white disabled:text-opacity-25 w-[fit-content] bg-discord-not-quite-black px-2 py-1.5 rounded-md shadow-sm duration-150 transition-colors active:bg-discord-dark focus:outline-none"
              onClick={handleXpChannelsTypeChange}
            >
              Click to use a {xpChannelsType === 'blacklist' ? 'whitelist' : 'blacklist'} instead
            </button>
          </div>
          <Selector
            disabled={!featureEnabled}
            id="xpChannels"
            initialItems={database.xpBlacklistedChannels ?? database.xpWhitelistedChannels ?? []}
            items={channels}
            limit={DATABASE_LIMITS.xpChannels.maxLength}
            onSelect={(c) => {
              setXpChannels(c);
              addChange(xpChannelsType === 'whitelist' ? 'xpWhitelistedChannels' : 'xpBlacklistedChannels', c);
            }}
            type="channel"
          />
        </Field>

        <Field>
          <Label
            htmlFor="topXpRole"
            name="Top XP Role"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-the-top-xp-role"
          />
          <div className="max-w-[20rem]">
            <Selector
              disabled={!featureEnabled}
              id="topXpRole"
              initialItems={database.topXpRole ? [database.topXpRole] : []}
              items={roles}
              limit={1}
              onSelect={(r) => addChange('topXpRole', r[0] ?? null)}
              type="role"
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="noXpRoles"
            name="No-XP Roles"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-no-xp-roles"
          />
          <Selector
            disabled={!featureEnabled}
            id="noXpRoles"
            initialItems={database.noXpRoles ?? []}
            items={roles}
            limit={DATABASE_LIMITS.noXpRoles.maxLength}
            onSelect={(r) => addChange('noXpRoles', r)}
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
            disabled={!featureEnabled}
            initialItem={resolveAutoResetLevelsNameByType(database.autoResetLevels)}
            items={['None', 'Leave', 'Ban', 'Ban & Leave']}
            onSelect={(i) => addChange('autoResetLevels', resolveAutoResetLevelsTypeByName(i))}
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
                <div className="flex flex-row gap-3 mt-2 mb-4">
                  <BasicSelect
                    disabled={!featureEnabled}
                    initialItem={'Channel'}
                    items={
                      xpMultipliers.some((m) => m.type === 'global')
                        ? ['Channel', 'Role']
                        : ['Channel', 'Global', 'Role']
                    }
                    onSelect={(item) => setNewXpMultiplierType(item.toLowerCase() as Multiplier['type'])}
                  />
                  <button
                    disabled={!featureEnabled}
                    className="flex-shrink-0 h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center text-white disabled:text-opacity-25 duration-150 transition-colors"
                    onClick={() => {
                      const finalMultipliers = [
                        ...xpMultipliers,
                        {
                          multiplier: '1',
                          targets: newXpMultiplierType !== 'global' ? [] : null,
                          type: newXpMultiplierType,
                        },
                      ];
                      setXpMultipliers(finalMultipliers);
                      addChange('xpMultipliers', resolveMultiplier(finalMultipliers));
                    }}
                  >
                    <IoMdSend className="fill-current text-3xl" />
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-y-2 divide-y-2 divide-gray-400">
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
            disabled={!featureEnabled}
            initialItem={prioritiseMultiplierValues[database.prioritiseMultiplierRoleHierarchy ? 1 : 0]}
            items={prioritiseMultiplierValues}
            onSelect={(i) => addChange('prioritiseMultiplierRoleHierarchy', i === prioritiseMultiplierValues[0])}
          />
        </Field>
      </Fieldset>
    </>
  );
}
