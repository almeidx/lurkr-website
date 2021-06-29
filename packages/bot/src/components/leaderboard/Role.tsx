import type { GuildLevelRoles } from '../../graphql/queries/GuildLevels';
import { resolveColour } from '../../utils/utils';

interface RoleProps {
  level: number;
  roles: GuildLevelRoles['roles'];
}

export default function Role({ level, roles }: RoleProps) {
  return (
    <div className="flex flex-col gap-2 mx-4 my-2" key={level}>
      <span className="text-white">Level {level}</span>
      <div className="flex flex-row flex-wrap gap-3">
        {roles.map(({ color, id, name }) => (
          <div
            className="flex flex-row justify-center items-center gap-1.5 rounded-2xl px-1.5 py-1"
            key={`${level}-${id}`}
            style={{ border: `1px solid ${resolveColour(color)}` }}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: resolveColour(color) }} />

            <span className="truncate text-center" key={id} style={{ color: resolveColour(color) }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
