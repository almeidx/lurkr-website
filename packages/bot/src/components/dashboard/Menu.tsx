import { useMutation } from '@apollo/client';
import type { Snowflake } from 'discord-api-types';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MouseEventHandler, RefObject, useCallback, useContext, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { FaShapes } from 'react-icons/fa';
import { GoMilestone } from 'react-icons/go';
import { HiEmojiHappy } from 'react-icons/hi';
import { ImCog } from 'react-icons/im';
import { RiSave3Fill, RiTimerFlashFill } from 'react-icons/ri';

import { GuildContext, Section } from '../../contexts/GuildContext';
import updateDatabaseGuild, {
  UpdateDatabaseGuild,
  UpdateDatabaseGuildVariables,
} from '../../graphql/mutations/updateDatabaseGuild';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';

interface MenuProps {
  guild: {
    icon: string | null;
    id: Snowflake;
    name: string;
  };
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
  { Icon: GoMilestone, id: 'milestones', name: 'Milestones' },
  { Icon: HiEmojiHappy, id: 'emojiList', name: 'Emoji List' },
  { Icon: RiTimerFlashFill, id: 'mentionCooldown', name: 'Mention Cooldown' },
  { Icon: FaShapes, id: 'miscellaneous', name: 'Miscellaneous' },
];

// @ts-expect-error
export const isValidSection = (str: string): str is Section => menuItems.map((i) => i.id).includes(str);

const saveButtonDefaultColour = '#3ea25e';

let timeout: NodeJS.Timeout;

const updateButtonTextTemporarily = (
  text: string,
  colour: string,
  buttonRef: RefObject<HTMLButtonElement>,
  setText: (str: string) => unknown,
): void => {
  if (buttonRef.current) buttonRef.current.style.background = colour;
  setText(text);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    setText('Save');
    if (buttonRef.current) buttonRef.current.style.background = saveButtonDefaultColour;
  }, 3_000);
};

export default function Menu({ guild }: MenuProps) {
  const router = useRouter();
  const { changes, guildId, section, updateSection } = useContext(GuildContext);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [updateDatabase] = useMutation<UpdateDatabaseGuild, UpdateDatabaseGuildVariables>(updateDatabaseGuild, {});
  const [saveButtonText, setSaveButtonText] = useState('Save');
  const isSaving = useRef<boolean>(false);

  const handleSaveButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback(async () => {
    if (isSaving.current) return;

    if (saveButtonRef.current) {
      saveButtonRef.current.style.background = '#158d3b';
      setSaveButtonText('Saving...');
    }

    const clone = JSON.parse(JSON.stringify(changes));
    if (!Object.keys(clone).length || !guildId) return;

    try {
      await updateDatabase({ variables: { data: clone, id: guildId } });
      updateButtonTextTemporarily('Saved!', saveButtonDefaultColour, saveButtonRef, (str: string) =>
        setSaveButtonText(str),
      );
    } catch (error) {
      console.log(error);
      updateButtonTextTemporarily('Failed to save', '#ed4245', saveButtonRef, (str: string) => setSaveButtonText(str));
    } finally {
      isSaving.current = false;
    }
  }, [changes, guildId, updateDatabase, saveButtonRef]);

  return (
    <aside className="w-96 min-w-[300px] px-6 hidden sm:block">
      <div className="sticky top-0 md:pt-6">
        <header className="flex flex-row items-center mb-8 mt-8 sm:mt-0 gap-4">
          {guild.icon ? (
            <img
              alt={`${guild.name} server icon`}
              className="rounded-full"
              height={48}
              src={guildIconCdn(guild.id, guild.icon, 64)}
              width={48}
            />
          ) : (
            <Image className="rounded-full" height={48} src={FALLBACK_AVATAR_PATH} width={48} />
          )}

          <p className="text-white truncate">{guild.name}</p>
        </header>

        <section className="flex flex-col gap-y-3 pl-12">
          <button
            className={`flex flex-row items-center gap-2 py-2 px-4 w-full text-center duration-200 transition-colors bg-[${saveButtonDefaultColour}] hover:bg-[#25c959] text-white focus:outline-none  rounded-lg cursor-pointer`}
            onClick={handleSaveButtonClick}
            ref={saveButtonRef}
            style={{
              backgroundColor: Object.keys(changes).length ? saveButtonDefaultColour : '#40444b',
              cursor: Object.keys(changes).length ? 'pointer' : 'not-allowed',
              opacity: Object.keys(changes).length ? '1' : '0.3',
            }}
            disabled={!Object.keys(changes).length}
          >
            <RiSave3Fill className="fill-current" />
            {saveButtonText}
          </button>

          {menuItems.map(({ Icon, id, name }, i) => (
            <button
              className={`${
                section === id ? 'bg-gray-500' : ''
              } flex flex-row items-center gap-2 py-2 px-4 w-full text-center duration-200 hover:bg-discord-lighter text-white focus:outline-none rounded-lg cursor-pointer`}
              key={i}
              onClick={() => {
                updateSection(id);
                void router.push(`/guilds/${guildId}?p=${id}`, `/guilds/${guildId}?p=${id}`, { shallow: true });
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
