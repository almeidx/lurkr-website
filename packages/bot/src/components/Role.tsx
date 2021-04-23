import styles from '../styles/components/Role.module.scss';
import type { Role as RoleInfo } from './Level';

interface RoleProps {
  level: number;
  roles: RoleInfo[];
}

const resolveColour = (colour: number) => (colour ? `#${colour.toString(16)}` : 'var(--discord-role)');

export default function Role({ level, roles }: RoleProps) {
  return (
    <div className={styles.container}>
      <span>Level {level}</span>
      <div className={styles.rolesContainer}>
        {roles.map(({ color, id, name }) => (
          <span key={id} style={{ border: `1px solid ${resolveColour(color)}`, color: resolveColour(color) }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
