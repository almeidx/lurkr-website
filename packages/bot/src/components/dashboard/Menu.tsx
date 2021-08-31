import type { Snowflake } from 'discord-api-types';
import cloneDeep from 'lodash.clonedeep';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEventHandler, useCallback, useContext, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { FaPatreon, FaShapes, FaTrophy } from 'react-icons/fa';
import { HiEmojiHappy } from 'react-icons/hi';
import { ImCog } from 'react-icons/im';
import { RiSave3Fill, RiTimerFlashFill } from 'react-icons/ri';
import { useMutation } from 'relay-hooks';

import type {
  DatabaseGuildChanges,
  updateDatabaseGuildMutation,
  updateDatabaseGuildMutationVariables,
} from '../../__generated__/updateDatabaseGuildMutation.graphql';
import { GuildContext, Section } from '../../contexts/GuildContext';
import updateDatabaseGuild from '../../graphql/mutations/updateDatabaseGuild';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';

interface MenuProps {
  closeMenu(): void;
  guild: {
    icon: string | null;
    id: Snowflake;
    name: string;
  };
  menuOpen: boolean;
  premium: boolean;
}

interface MenuItem {
  Icon: IconType;
  id: Section;
  name: string;
}

const menuItems: MenuItem[] = [
  { Icon: ImCog, id: 'general', name: 'Settings' },
  { Icon: BsFillShiftFill, id: 'leveling', name: 'Leveling' },
  { Icon: BsPersonPlusFill, id: 'autorole', name: 'Autorole' },
  { Icon: FaTrophy, id: 'milestones', name: 'Milestones' },
  { Icon: HiEmojiHappy, id: 'emojiList', name: 'Emoji List' },
  { Icon: RiTimerFlashFill, id: 'mentionCooldown', name: 'Mention Cooldown' },
  { Icon: FaShapes, id: 'miscellaneous', name: 'Miscellaneous' },
];

// @ts-expect-error
export const isValidSection = (str: string): str is Section => menuItems.map((i) => i.id).includes(str);

const saveButtonDefaultColour = '#3ea25e';

let timeout: NodeJS.Timeout | void;

export default function Menu({ closeMenu, guild, menuOpen, premium }: MenuProps) {
  const [saveButtonText, setSaveButtonText] = useState('Save');
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const isSaving = useRef<boolean>(false);

  const { changes, clearChanges, errors, guildId, section, updateSection } = useContext(GuildContext);
  const [updateDatabase] = useMutation<updateDatabaseGuildMutation>(updateDatabaseGuild, {});
  const router = useRouter();

  const saveButtonDisabled = (Object.keys(changes).length || isSaving.current) && !errors.length;

  const handleSaveButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    if (isSaving.current || errors.length) return;

    if (saveButtonRef.current) {
      saveButtonRef.current.style.background = '#158d3b';
      setSaveButtonText('Saving...');
    }

    const clone = cloneDeep<Partial<DatabaseGuildChanges>>(changes);
    if (!Object.keys(clone).length || !guildId) return;

    const dataForMutation = cloneDeep<updateDatabaseGuildMutationVariables['data']>(clone);

    if (dataForMutation.autoRoleTimeout === 0) dataForMutation.autoRoleTimeout = null;
    else if (dataForMutation.autoRoleTimeout) dataForMutation.autoRoleTimeout *= 60_000;

    if (dataForMutation.mentionCooldown) dataForMutation.mentionCooldown *= 60_000;

    if ('xpMultipliers' in clone && clone.xpMultipliers) {
      // @ts-expect-error: The 'clone' type isn't actually DatabaseGuildChanges, the Multipliers have _id's here
      dataForMutation.xpMultipliers = clone.xpMultipliers.map(({ _id, ...rest }) => rest);
    }

    let hasFailed = false;

    try {
      await updateDatabase({ variables: { data: dataForMutation, id: guildId } });
    } catch (error) {
      // @ts-expect-error
      console.error(error, error.networkError, error.networkError?.result?.errors);
      hasFailed = true;
    } finally {
      if (saveButtonRef.current) {
        saveButtonRef.current.style.background = hasFailed ? '#ed4245' : saveButtonDefaultColour;
      }

      setSaveButtonText(hasFailed ? 'Failed to save' : 'Saved!');
      if (!hasFailed) clearChanges();

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        setSaveButtonText('Save');
        if (saveButtonRef.current && hasFailed) saveButtonRef.current.style.background = saveButtonDefaultColour;
        isSaving.current = false;
      }, 3_000);
    }
  }, [changes, clearChanges, errors, guildId, saveButtonRef, updateDatabase]);

  return (
    <aside
      className={`${
        !menuOpen ? 'hidden' : ''
      } w-full sm:w-96 min-w-[300px] mt-20 sm:mt-0 absolute top-0 left-0 sm:block sm:relative bg-discord-dark`}
    >
      <div className="sticky top-0 sm:py-6">
        <header className="flex flex-col sm:flex-row items-center px-6 py-4 mb-6 gap-4 bg-discord-slightly-darker sm:bg-discord-dark">
          {guild.icon ? (
            <img
              alt={`${guild.name} server icon`}
              className="rounded-full"
              height={64}
              src={guildIconCdn(guild.id, guild.icon, 64)}
              width={64}
            />
          ) : (
            <Image className="rounded-full" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
          )}

          <div className="flex flex-col gap-2">
            <h2 className="text-white w-full text-center break-words sm:text-base">{guild.name}</h2>

            <span
              className={`flex flex-row justify-center items-center gap-2 ${
                premium ? 'bg-[#ff424d] hover:bg-[#c0323a]' : 'bg-[#c0323a] hover:bg-[#802127]'
              } transition-colors duration-100 py-1 px-2 w-full text-center text-white rounded-lg cursor-pointer`}
              onClick={() => window.open('https://docs.pepemanager.com/information/patreon-perks')}
            >
              <FaPatreon />
              {premium ? 'Premium' : 'Get Premium'}
            </span>
          </div>
        </header>

        <section className="flex flex-col sm:max-w-[14rem] gap-y-3 px-6 sm:p-0 sm:pr-4 sm:ml-auto">
          <button
            className={`flex flex-row items-center gap-2 py-2 px-4 w-full text-center duration-200 transition-colors bg-[${saveButtonDefaultColour}] hover:bg-[#25c959] text-white focus:outline-none rounded-lg cursor-pointer`}
            disabled={!Object.keys(changes).length || isSaving.current || !!errors.length}
            onClick={handleSaveButtonClick}
            ref={saveButtonRef}
            style={{
              backgroundColor: saveButtonDisabled ? saveButtonDefaultColour : '#40444b',
              cursor: saveButtonDisabled ? 'pointer' : 'not-allowed',
              opacity: saveButtonDisabled ? '1' : '0.3',
            }}
          >
            <RiSave3Fill className="fill-current" />
            {saveButtonText}
          </button>

          {menuItems.map(({ Icon, id, name }, i) => (
            <button
              className={`${
                section === id ? 'sm:bg-gray-500 ' : ''
              }flex flex-row items-center gap-2 py-2 px-4 w-full text-center duration-200 hover:bg-discord-lighter text-white focus:outline-none rounded-lg cursor-pointer`}
              key={i}
              onClick={() => {
                updateSection(id);
                void router.push(`/guilds/${guildId}?p=${id}`, `/guilds/${guildId}?p=${id}`, { shallow: true });
                closeMenu();
              }}
            >
              <Icon className="fill-current" />
              {name}
            </button>
          ))}
        </section>
      </div>
    </aside>
  );
}
