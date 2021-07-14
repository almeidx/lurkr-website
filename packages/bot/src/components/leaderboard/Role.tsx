import type { GuildLevelRoles } from '../../graphql/queries/GuildLevels';
import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';
import { resolveColour } from '../../utils/utils';

interface RoleProps {
  level: number;
  roles: GuildLevelRoles['roles'];
}

export default function Role({ level, roles }: RoleProps) {
  return (
    <div className="flex flex-col gap-2 mx-4 my-2" key={level}>
      <span className="text-white">Level {level}</span>
      <div className="flex flex-row flex-wrap gap-1.5">
        {roles.map(({ color, id, name }) => (
          <div
            className={`flex max-w-[250px] items-center h-6 z-50 border rounded-full text-xs`}
            style={{ borderColor: color ? resolveColour(color) : DEFAULT_ROLE_COLOUR }}
            key={id}
          >
            <div className="w-3 h-3 ml-[5px] mr-[4px] rounded-full" style={{ backgroundColor: resolveColour(color) }} />
            <div className={`text-white leading-3 truncate pr-2 pb-[2px]`}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
