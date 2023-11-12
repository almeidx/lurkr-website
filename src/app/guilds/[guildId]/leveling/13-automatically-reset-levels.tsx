"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { AutoResetLevels } from "@/lib/guild.ts";
import { BsHammer } from "@react-icons/all-files/bs/BsHammer";
import { ImExit } from "@react-icons/all-files/im/ImExit";
import { IoBan } from "@react-icons/all-files/io5/IoBan";

export function AutomaticallyResetLevels({ defaultValue }: { readonly defaultValue: AutoResetLevels }) {
	const radio = useRadioStore({ defaultValue });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<IoBan className="mr-2 fill-icon-gradient-tertiary" />
					None
				</div>
				<Radio value={AutoResetLevels.None} id="autoResetLevels" name="autoResetLevels" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<ImExit className="mr-2 fill-icon-gradient-tertiary" />
					When the user leaves
				</div>
				<Radio value={AutoResetLevels.Leave} id="autoResetLevels" name="autoResetLevels" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<BsHammer className="mr-2 fill-icon-gradient-tertiary" style={{ transform: "scale(-1,1)" }} />
					When the user is banned
				</div>
				<Radio value={AutoResetLevels.Ban} id="autoResetLevels" name="autoResetLevels" />
			</label>

			<label className="flex items-center justify-between">
				<ImExit className="mr-2 mt-1.5 self-start fill-icon-gradient-tertiary" />
				<p className="text-lg tracking-tight text-white/75 md:text-xl">
					When the user is banned <span className="font-semibold text-white">or</span> leaves
				</p>
				<Radio value={AutoResetLevels.BanAndLeave} id="autoResetLevels" name="autoResetLevels" />
			</label>
		</RadioGroup>
	);
}
