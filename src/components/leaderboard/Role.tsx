import type { GuildLevelsRoleInfo } from '../../graphql/queries/GuildLevels';
import { resolveColour } from '../../utils/utils';
import RoleChannelBullet from '../RoleChannelBullet';

interface RoleProps {
  level: number;
  roles: GuildLevelsRoleInfo[];
}

export default function Role({ level, roles }: RoleProps) {
  return (
    <div className="flex flex-col gap-2 mx-4 my-2" key={level}>
      <span className="text-white">Level {level}</span>
      <div className="flex flex-row flex-wrap gap-1.5 shrink-0">
        {roles.map(({ color, id, name }) => (
          <RoleChannelBullet type="role" key={id} roleColour={resolveColour(color)} name={name} />
        ))}
      </div>
    </div>
  );
}
