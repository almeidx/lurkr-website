import type { MouseEventHandler } from 'react';

interface RoleChannelBulletProps {
  type: string;
  roleColour?: string;
  hoverX?: boolean;
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function RoleChannelBullet({
  hoverX,
  name,
  roleColour,
  type,
  onClick,
  ...props
}: RoleChannelBulletProps) {
  return (
    <div
      className={`${type === 'role' ? 'role-bullet' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } z-10 flex h-6 max-w-[175px] select-none items-center rounded-full border text-xs`}
      style={{ borderColor: roleColour }}
      onClick={onClick}
      {...props}
    >
      {type === 'role' && (
        <>
          {hoverX && <div className="role-x">&times;</div>}
          <div className="mr-[4px] ml-[5px] h-3 w-3 rounded-full" style={{ backgroundColor: roleColour }} />
        </>
      )}

      <div
        className={`${
          type === 'channel' && onClick ? 'hover:text-red-400' : ''
        } truncate pr-2 pb-[2px] leading-3 text-white`}
      >
        {type === 'channel' && <span className="pl-2">#</span>}
        {name}
      </div>
    </div>
  );
}
