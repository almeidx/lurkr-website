import { FaGlobe, FaUserFriends } from 'react-icons/fa';
import { IoMdChatbubbles } from 'react-icons/io';

import type { Multiplier as IMultiplier } from '../../graphql/queries/DashboardGuild';
import type { Channel, Role } from '../../graphql/queries/GuildLevels';
import { resolveColour } from '../../utils/utils';
import RoleChannelBullet from '../RoleChannelBullet';

interface MultiplierProps extends Omit<IMultiplier, '_id'> {
  items: Channel[] | Role[] | null;
}

export default function Multiplier({ items, multiplier, targets, type }: MultiplierProps) {
  const Icon = type === 'channel' ? IoMdChatbubbles : type === 'role' ? FaUserFriends : FaGlobe;

  return (
    <div className="flex flex-col gap-2 mx-4 my-2">
      <span className="text-white flex flex-row items-center text-center gap-2">
        <Icon />
        {type[0].toUpperCase() + type.slice(1)} - x{multiplier}
      </span>

      {type !== 'global' && targets && items && (
        <div className="flex flex-row flex-wrap gap-1.5 shrink-0">
          {type === 'channel'
            ? targets.map((id) => {
                const item = items.find((item) => item.id === id) as Channel | void;
                if (!item) return null;
                return <RoleChannelBullet key={id} name={item.name} type={type} />;
              })
            : targets.map((id) => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                const item = items.find((item) => item.id === id) as Role | void;
                if (!item) return null;
                return (
                  <RoleChannelBullet key={id} name={item.name} type={type} roleColour={resolveColour(item.color)} />
                );
              })}
        </div>
      )}
    </div>
  );
}
