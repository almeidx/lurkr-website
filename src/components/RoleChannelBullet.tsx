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
      } flex max-w-[175px] items-center h-6 z-10 border rounded-full text-xs select-none`}
      style={{ borderColor: roleColour }}
      onClick={onClick}
      {...props}
    >
      {type === 'role' && (
        <>
          {hoverX && <div className="role-x">&times;</div>}
          <div className="mr-[4px] ml-[5px] w-3 h-3 rounded-full" style={{ backgroundColor: roleColour }} />
        </>
      )}

      <div
        className={`${
          type === 'channel' && onClick ? 'hover:text-red-400' : ''
        } text-white leading-3 truncate pr-2 pb-[2px]`}
      >
        {type === 'channel' && <span className="pl-2">#</span>}
        {name}
      </div>
    </div>
  );
}
