import type { MouseEventHandler } from "react";
import { CiHashtag } from "react-icons/ci";
import { HiSpeakerphone } from "react-icons/hi";
import { HiSpeakerWave } from "react-icons/hi2";
import { TbMessages } from "react-icons/tb";
import { ChannelType } from "~/contexts/GuildContext";

export default function RoleChannelBullet({
	channelType,
	hoverX,
	name,
	roleColour,
	type,
	onClick,
	...props
}: RoleChannelBulletProps) {
	return (
		<div
			className={`${type === "Role" ? "group" : ""} ${onClick ? "cursor-pointer" : ""} ${
				type === "Channel" && onClick ? "hover:text-red-400" : ""
			} z-10 flex h-6 max-w-[175px] select-none items-center rounded-full border text-xs text-white`}
			onClick={onClick}
			style={{ borderColor: roleColour }}
			{...props}
		>
			{type === "Role" && (
				<>
					{hoverX && (
						<div className="absolute ml-[4.5px] hidden text-xs leading-3 text-black group-hover:block">&times;</div>
					)}
					<div className="ml-[5px] mr-1 size-3 rounded-full" style={{ backgroundColor: roleColour }} />
				</>
			)}

			<div className="flex gap-1.5 truncate pb-[2px] pr-2 leading-3 text-inherit">
				{type === "Channel" ? (
					channelType === ChannelType.GuildText ? (
						<CiHashtag className="ml-2" />
					) : channelType === ChannelType.GuildVoice ? (
						<HiSpeakerWave className="ml-2" />
					) : channelType === ChannelType.GuildAnnouncement ? (
						<HiSpeakerphone className="ml-2" />
					) : channelType === ChannelType.GuildForum ? (
						<TbMessages className="ml-2" />
					) : null
				) : null}
				{name}
			</div>
		</div>
	);
}

interface RoleChannelBulletProps {
	readonly channelType?: ChannelType;
	readonly hoverX?: boolean;
	readonly name: string;
	readonly onClick?: MouseEventHandler<HTMLDivElement>;
	readonly roleColour?: string;
	readonly type: "Channel" | "Role";
}
