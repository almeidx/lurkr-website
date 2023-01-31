import type { MouseEventHandler } from "react";

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
			className={`${type === "Role" ? "role-bullet" : ""} ${onClick ? "cursor-pointer" : ""} ${
				type === "Channel" && onClick ? "hover:text-red-400" : ""
			} z-10 flex h-6 max-w-[175px] select-none items-center rounded-full border text-xs text-white`}
			onClick={onClick}
			style={{ borderColor: roleColour }}
			{...props}
		>
			{type === "Role" && (
				<>
					{hoverX && <div className="role-x">&times;</div>}
					<div className="mr-[4px] ml-[5px] h-3 w-3 rounded-full" style={{ backgroundColor: roleColour }} />
				</>
			)}

			<div className="truncate pr-2 pb-[2px] leading-3 text-inherit">
				{type === "Channel" && <span className="pl-2">#</span>}
				{name}
			</div>
		</div>
	);
}

interface RoleChannelBulletProps {
	hoverX?: boolean;
	name: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
	roleColour?: string;
	type: "Channel" | "Role";
}
