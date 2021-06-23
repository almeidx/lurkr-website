import type { GuildLevelRoles } from '../../graphql/queries/GuildLevels';
import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';

interface RoleProps {
  level: number;
  roles: GuildLevelRoles['roles'];
}

const resolveColour = (colour: number) => (colour ? `#${colour.toString(16)}` : DEFAULT_ROLE_COLOUR);

export default function Role({ level, roles }: RoleProps) {
  return (
    <div className="flex flex-col gap-2 mx-4 my-2" key={level}>
      <span className="text-white">Level {level}</span>
      <div className="flex flex-row flex-wrap gap-3">
        {roles.map(({ color, id, name }) => (
          <div
            className="flex flex-row justify-center items-center gap-1.5 rounded-2xl px-1.5 py-1"
            key={level}
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
