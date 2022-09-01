import cuid from 'cuid';
import { MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BiLayerPlus } from 'react-icons/bi';

import { GuildContext } from '../../../contexts/GuildContext';
import {
  AutoResetLevels,
  DashboardChannels,
  DashboardDatabaseGuild,
  DashboardRoles,
  MultiplierType,
} from '../../../graphql/queries/DashboardGuild';
import type { Snowflake } from '../../../utils/constants';
import { getDatabaseLimit, parseIntStrict, parseMultiplier } from '../../../utils/utils';
import BasicSelect from '../../form/BasicSelect';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Subtitle from '../../form/Subtitle';
import Textarea from '../../form/Textarea';
import Toggle from '../../form/Toggle';
import Header from '../Header';
import XpDisallowedPrefix from '../XpDisallowedPrefix';
import XpMultiplier, {
  XpMultiplierOnDeleteFn,
  XpMultiplierOnItemChangeFn,
  XpMultiplierOnMultiplierChangeFn,
} from '../XpMultiplier';
import XpRole, { XpRoleOnChangeFn } from '../XpRole';

interface LevelingProps {
  channels: DashboardChannels;
  database: DashboardDatabaseGuild;
  roles: DashboardRoles;
  openMenu: () => void;
}

type RoleReward = DashboardDatabaseGuild['xpRoleRewards'][0];
type Multiplier = DashboardDatabaseGuild['xpMultipliers'][0];
type MultiplierWithStringValue = Omit<Multiplier, 'multiplier'> & { multiplier: string };

enum ResponseType {
  CHANNEL = 'custom-channel',
  DM = 'dm',
  NONE = 'none',
  SAME_CHANNEL = 'channel',
}

const resolveXpResponseTypeByName = (name: string) =>
  name === 'Custom Channel'
    ? ResponseType.CHANNEL
    : name === 'DM'
    ? ResponseType.DM
    : name === 'None'
    ? ResponseType.NONE
    : ResponseType.SAME_CHANNEL;

const resolveInitialXpResponseType = (database: DashboardDatabaseGuild) =>
  database.xpResponseType
    ? /^\d+$/.test(database.xpResponseType)
      ? 'Custom Channel'
      : database.xpResponseType === 'dm'
      ? 'DM'
      : 'Same Channel'
    : 'None';

const resolveInitialXpResponseTypeValue = (database: DashboardDatabaseGuild) =>
  database.xpResponseType
    ? /^\d+$/.test(database.xpResponseType)
      ? ResponseType.CHANNEL
      : database.xpResponseType
    : ResponseType.NONE;

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

const resolveInitialXpResponseChannel = (database: DashboardDatabaseGuild): Snowflake[] =>
  database.xpResponseType ? (/^\d+$/.test(database.xpResponseType) ? [database.xpResponseType] : []) : [];

const resolveMultiplierValues = (multipliers: MultiplierWithStringValue[]) =>
  multipliers.map((m) => ({ ...m, multiplier: parseMultiplier(m.multiplier) ?? NaN }));

let timeout: NodeJS.Timeout | undefined;

export default function Leveling({ channels, database, roles, openMenu }: LevelingProps) {
  const [xpRoleRewards, setXpRoleRewards] = useState<RoleReward[]>(database.xpRoleRewards);
  const [xpChannels, setXpChannels] = useState<Snowflake[]>(
    (database.xpWhitelistedChannels as Snowflake[] | null) ??
      (database.xpBlacklistedChannels as Snowflake[] | null) ??
      [],
  );
  const [xpMultipliers, setXpMultipliers] = useState<MultiplierWithStringValue[]>(
    database.xpMultipliers.map((m) => ({ ...m, multiplier: m.multiplier.toString() })),
  );
  const [xpResponseType, setXpResponseType] = useState<string>(resolveInitialXpResponseTypeValue(database));
  const [xpChannelsType, setXpChannelsType] = useState<'whitelist' | 'blacklist'>(
    database.xpBlacklistedChannels ? 'blacklist' : 'whitelist',
  );
  const [newXpMultiplierType, setNewXpMultiplierType] = useState<Multiplier['type']>(MultiplierType.Channel);
  const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>('');
  const [newDisallowedPrefix, setNewDisallowedPrefix] = useState<string>('');
  const [xpDisallowedPrefixes, setXpDisallowedPrefixes] = useState<string[]>(database.xpDisallowedPrefixes);
  const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);
  const newXpDisallowedPrefixSubmitRef = useRef<HTMLButtonElement>(null);
  const { addChange } = useContext(GuildContext);

  const noXpRolesLimit = getDatabaseLimit('noXpRoles', database.premium).maxLength;
  const vanityLimits = getDatabaseLimit('vanity', database.premium);
  const xpMessageLimit = getDatabaseLimit('xpMessage', database.premium).maxLength;
  const xpChannelsLimit = getDatabaseLimit('xpChannels', database.premium).maxLength;
  const xpDisallowedPrefixesLimit = getDatabaseLimit('xpDisallowedPrefixes', database.premium).maxLength;

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, [openMenu]);

  const sortedRoleRewards = useMemo(() => xpRoleRewards.sort((a, b) => a.level - b.level), [xpRoleRewards]);

  const handleNewXpRoleCreated: () => unknown = useCallback(() => {
    const clone = [...xpRoleRewards];
    const level = parseIntStrict(newXpRolesLevel);

    if (newXpRolesLevel in clone || level <= 0 || level > 500) {
      if (newXpRoleSubmitRef.current) newXpRoleSubmitRef.current.style.color = '#ed4245';

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (newXpRoleSubmitRef.current) newXpRoleSubmitRef.current.style.color = '#fff';
      }, 1_000);
    } else {
      const index = clone.findIndex((r) => r.level === level);
      if (index === -1) {
        clone.push({ level, roleIds: [] });
      }
      setXpRoleRewards(clone);
      addChange('xpRoleRewards', clone);
    }
  }, [addChange, newXpRolesLevel, xpRoleRewards, newXpRoleSubmitRef]);

  const handleXpRolesChange: XpRoleOnChangeFn = useCallback(
    (roleIds, level) => {
      const clone = [...xpRoleRewards];

      const index = clone.findIndex((r) => r.level === level);

      if (roleIds.length) {
        if (index === -1) {
          clone.push({ level, roleIds });
        } else {
          clone[index].roleIds = roleIds;
        }
      } else {
        clone.splice(index, 1);
      }

      setXpRoleRewards(clone);
      addChange('xpRoleRewards', clone);
    },
    [addChange, xpRoleRewards],
  );

  const handleXpChannelsTypeChange: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    const currentType = `${xpChannelsType}` as const;
    setXpChannelsType(currentType === 'blacklist' ? 'whitelist' : 'blacklist');

    if (currentType === 'blacklist') {
      addChange('xpBlacklistedChannels', null);
      return addChange('xpWhitelistedChannels', xpChannels);
    }

    addChange('xpWhitelistedChannels', null);
    addChange('xpBlacklistedChannels', xpChannels);
  }, [addChange, xpChannels, xpChannelsType]);

  const handleXpMultiplierDelete: XpMultiplierOnDeleteFn = useCallback(
    (id) => {
      const clone = [...xpMultipliers];
      const index = clone.findIndex((m) => m.id === id);

      if (index < 0) {
        return console.log(
          '[Leveling] Id provided was not presented in the xp multipliers array when the user tried deleting a multiplier',
        );
      }

      clone.splice(index, 1);

      setXpMultipliers(clone);
      addChange('xpMultipliers', resolveMultiplierValues(clone));
    },
    [addChange, xpMultipliers],
  );

  const handleXpMultiplierItemsChange: XpMultiplierOnItemChangeFn = useCallback(
    (itemIds, id) => {
      const clone = [...xpMultipliers];
      const index = clone.findIndex((m) => m.id === id);

      if (index < 0) {
        return console.log(
          '[Leveling] Id provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier',
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
      addChange('xpMultipliers', resolveMultiplierValues(clone));
    },
    [addChange, xpMultipliers],
  );

  const handleXpMultiplierValueChange: XpMultiplierOnMultiplierChangeFn = useCallback(
    (multiplier, id) => {
      const clone = [...xpMultipliers];
      const index = clone.findIndex((m) => m.id === id);

      if (index < 0) {
        return console.log(
          '[Leveling] Index provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier',
        );
      }

      const xpMultiplier = clone[index];
      xpMultiplier.multiplier = multiplier;

      clone[index] = xpMultiplier;

      setXpMultipliers(clone);
      addChange('xpMultipliers', resolveMultiplierValues(clone));
    },
    [addChange, xpMultipliers],
  );

  return (
    <>
      <Header
        openMenu={openMenu}
        description="Allow users to gain xp and level up by sending messages."
        id="levels"
        initialValue={database.levels}
        onChange={(v) => {
          addChange('levels', v);
        }}
        title="Leveling"
      />

      <Fieldset>
        <Field>
          <Label
            htmlFor="xpResponseType"
            name="XP Response Channel"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#where-to-send-the-level-up-message"
          />
          <div className="flex flex-row flex-wrap gap-y-2">
            <div className="w-full lg:w-1/2">
              <BasicSelect
                closeOnSelect
                initialItem={resolveInitialXpResponseType(database)}
                items={['Same Channel', 'DM', 'Custom Channel', 'None']}
                onSelect={(i) => {
                  const type = resolveXpResponseTypeByName(i);
                  setXpResponseType(type);
                  if (type === ResponseType.DM || type === ResponseType.SAME_CHANNEL) addChange('xpResponseType', type);
                  else if (type === ResponseType.NONE) addChange('xpResponseType', null);
                  else addChange('xpResponseType', '123');
                }}
              />
            </div>
            <div className="w-full lg:w-1/2 lg:pl-2">
              {xpResponseType === ResponseType.CHANNEL && (
                <Selector
                  id="xpResponseTypeChannel"
                  initialItems={resolveInitialXpResponseChannel(database)}
                  items={channels}
                  limit={1}
                  onSelect={(c) => addChange('xpResponseType', c[0] ?? null)}
                  type="channel"
                />
              )}
            </div>
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpMessage"
            name="XP Message"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#customizing-the-level-up-message"
          />
          <Textarea
            initialText={database.xpMessage}
            id="xpMessage"
            maxLength={xpMessageLimit}
            onChange={(t) => addChange('xpMessage', t)}
            placeholder="Enter the level up message"
          />
          <Subtitle text={`Maximum of ${xpMessageLimit.toLocaleString('en')} characters.`} />
        </Field>

        <Field direction="row">
          <div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
            <Label
              htmlFor="stackXpRoles"
              name="Stack XP Roles"
              url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-role-stacking"
              withMargin={false}
            />
            <Toggle
              size="small"
              id="stackXpRoles"
              initialValue={database.stackXpRoles}
              onChange={(v) => addChange('stackXpRoles', v)}
            />
          </div>
        </Field>

        <Field direction="row">
          <div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
            <Label
              htmlFor="prioritiseMultiplierRoleHierarchy"
              name="XP Multiplier Priority"
              url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers#changing-role-multiplier-hierarchy"
              withMargin={false}
            />
            <Toggle
              size="small"
              id="prioritiseMultiplierRoleHierarchy"
              initialValue={database.prioritiseMultiplierRoleHierarchy}
              onChange={(v) => addChange('prioritiseMultiplierRoleHierarchy', v)}
            />
          </div>
        </Field>

        <Field direction="row">
          <div className="flex w-full flex-row items-center justify-between gap-x-3 rounded-lg bg-discord-dark p-2 pl-4">
            <Label
              htmlFor="xpInThreads"
              name="XP In Threads"
              url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#toggling-leveling-in-threads"
              withMargin={false}
            />
            <Toggle
              size="small"
              id="xpInThreads"
              initialValue={database.xpInThreads}
              onChange={(v) => addChange('xpInThreads', v)}
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpRoleRewards"
            name="XP Role Rewards"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-role-rewards"
          />
          <div className="mb-4 divide-y-2">
            {xpRoleRewards.length < getDatabaseLimit('xpRoleRewards', database.premium).maxLength && (
              <div className="w-full">
                <Input
                  clearOnSubmit
                  id="newXpRole"
                  initialValue={''}
                  maxLength={3}
                  onChange={(t) => (t ? /^\d+$/.test(t) && setNewXpRolesLevel(t) : setNewXpRolesLevel(''))}
                  onSubmit={handleNewXpRoleCreated}
                  placeholder="Enter a level to reward roles to"
                  submitIcon={BiLayerPlus}
                  submitRef={newXpRoleSubmitRef}
                />
              </div>
            )}
          </div>
          <div className="mb-4 flex flex-col gap-y-2">
            {sortedRoleRewards.map(({ level, roleIds }) => (
              <XpRole
                key={level}
                level={level}
                initialRoles={roleIds}
                premium={database.premium}
                onChange={handleXpRolesChange}
                roles={roles}
              />
            ))}
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpMultipliers"
            name="XP Multipliers"
            url="https://docs.pepemanager.com/guides/setting-up-xp-multipliers"
          />
          <div>
            {xpMultipliers.length < getDatabaseLimit('xpMultipliers', database.premium).maxLength && (
              <>
                <p className="text-white">Create a new multiplier</p>
                <div className="mt-2 mb-4 flex flex-row gap-3">
                  <BasicSelect
                    closeOnSelect
                    initialItem="Channel"
                    items={
                      xpMultipliers.some((m) => m.type === MultiplierType.Global)
                        ? ['Channel', 'Role']
                        : ['Channel', 'Global', 'Role']
                    }
                    onSelect={(i) => setNewXpMultiplierType(i as MultiplierType)}
                  />
                  <button
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-discord-not-quite-black text-white transition-colors duration-150"
                    onClick={() => {
                      const finalMultipliers = [
                        ...xpMultipliers,
                        {
                          id: cuid(),
                          multiplier: '1',
                          targets: newXpMultiplierType !== MultiplierType.Global ? [] : null,
                          type: newXpMultiplierType,
                        },
                      ];
                      setXpMultipliers(finalMultipliers);
                      addChange('xpMultipliers', resolveMultiplierValues(finalMultipliers));
                    }}
                  >
                    <BiLayerPlus className="fill-current text-3xl" />
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            {xpMultipliers.map(({ id, multiplier, targets, type }) => (
              <XpMultiplier
                channels={channels}
                id={id}
                key={id}
                multiplier={multiplier}
                onDelete={handleXpMultiplierDelete}
                onItemChange={handleXpMultiplierItemsChange}
                onMultiplierChange={handleXpMultiplierValueChange}
                premium={database.premium}
                roles={roles}
                targets={targets as Snowflake[] | null}
                type={type}
              />
            ))}
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="xpChannels"
            name={`XP ${xpChannelsType === 'blacklist' ? 'Blacklisted' : 'Whitelisted'} Channels`}
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-allowed-channels"
          />
          <div className="mb-3 flex flex-row justify-start">
            <button
              className="w-fit rounded-md bg-discord-not-quite-black py-1.5 px-2 text-white shadow-sm transition-colors duration-150 focus:outline-none active:bg-discord-dark"
              onClick={handleXpChannelsTypeChange}
            >
              Use {xpChannelsType === 'blacklist' ? 'Whitelist' : 'Blacklist'}
            </button>
          </div>
          <Selector
            id="xpChannels"
            initialItems={
              database.xpBlacklistedChannels?.length
                ? database.xpBlacklistedChannels
                : database.xpWhitelistedChannels?.length
                ? database.xpWhitelistedChannels
                : []
            }
            items={channels}
            limit={xpChannelsLimit}
            onSelect={(c) => {
              setXpChannels(c);
              addChange(xpChannelsType === 'whitelist' ? 'xpWhitelistedChannels' : 'xpBlacklistedChannels', c);
            }}
            type="channel"
          />
          <Subtitle text={`Maximum of ${xpChannelsLimit} channels.`} />
        </Field>

        <Field>
          <Label
            htmlFor="xpDisallowedPrefixes"
            name="Disallowed Prefixes"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#blacklisting-bot-prefixes"
          />

          <div className="mb-4 divide-y-2">
            <div className="w-full">
              <Input
                clearOnSubmit
                id="newXpDisallowedPrefix"
                initialValue=""
                maxLength={12}
                onChange={(t) => setNewDisallowedPrefix(t)}
                onSubmit={() => {
                  if (
                    !xpDisallowedPrefixes.includes(newDisallowedPrefix) &&
                    xpDisallowedPrefixes.length < xpDisallowedPrefixesLimit
                  ) {
                    const newArr = [...xpDisallowedPrefixes, newDisallowedPrefix];
                    setXpDisallowedPrefixes(newArr);
                    addChange('xpDisallowedPrefixes', newArr);
                  }
                }}
                placeholder="Enter a prefix to add to the disallowed list"
                submitIcon={BiLayerPlus}
                submitRef={newXpDisallowedPrefixSubmitRef}
              />
            </div>
          </div>

          {!!xpDisallowedPrefixes.length && (
            <div className="mb-4 flex flex-row flex-wrap gap-2">
              {xpDisallowedPrefixes.map((prefix, index) => (
                <XpDisallowedPrefix
                  index={index}
                  key={prefix}
                  prefix={prefix}
                  onDelete={(index) => {
                    const clone = [...xpDisallowedPrefixes];
                    clone.splice(index, 1);
                    setXpDisallowedPrefixes(clone);
                    addChange('xpDisallowedPrefixes', clone);
                  }}
                />
              ))}
            </div>
          )}

          <Subtitle text={`Maximum of ${xpDisallowedPrefixesLimit} prefixes.`} />
        </Field>

        <Field>
          <Label
            htmlFor="topXpRole"
            name="Top XP Role"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-the-top-xp-role"
          />
          <div className="w-full sm:w-1/2 sm:min-w-[20rem]">
            <Selector
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
            id="noXpRoles"
            initialItems={(database.noXpRoles as Snowflake[] | null) ?? []}
            items={roles}
            limit={noXpRolesLimit}
            onSelect={(r) => addChange('noXpRoles', r)}
            type="role"
          />
          <Subtitle text={`Maximum of ${noXpRolesLimit} roles.`} />
        </Field>

        <Field>
          <Label
            htmlFor="autoResetLevels"
            name="Auto Reset Levels"
            url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#automatically-resetting-levels"
          />
          <BasicSelect
            closeOnSelect
            initialItem={resolveAutoResetLevelsNameByType(database.autoResetLevels)}
            items={['None', 'Leave', 'Ban', 'Ban & Leave']}
            onSelect={(i) => addChange('autoResetLevels', resolveAutoResetLevelsTypeByName(i))}
          />
        </Field>

        <Field>
          <Label
            htmlFor="vanity"
            name="Leaderboard Vanity"
            url="https://docs.pepemanager.com/guides/setting-a-leaderboard-vanity-url"
          />
          <div className="flex max-w-[20rem] flex-row gap-4">
            <Input
              id="vanity"
              initialValue={database.vanity ?? ''}
              maxLength={32}
              onChange={(t) => addChange('vanity', t)}
              placeholder="Enter the vanity used for the leveling leaderboard"
            />
          </div>
          <Subtitle text={`Between ${vanityLimits.minLength} - ${vanityLimits.maxLength} characters.`} />
        </Field>
      </Fieldset>
    </>
  );
}
