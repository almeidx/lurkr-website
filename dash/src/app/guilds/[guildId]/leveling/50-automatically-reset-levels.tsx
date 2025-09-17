import { Checkbox } from "@/components/dashboard/Checkbox.tsx";
import { AutoResetLevels } from "@/lib/guild.ts";

export function AutomaticallyResetLevels({ defaultValue }: { readonly defaultValue: AutoResetLevels }) {
	return (
		<div className="space-y-2">
			<label className="flex items-center gap-2" htmlFor="autoResetLevelsLeave">
				<Checkbox
					defaultValue={defaultValue === AutoResetLevels.Leave || defaultValue === AutoResetLevels.BanAndLeave}
					id="autoResetLevelsLeave"
				/>

				<p className="text-lg text-white/75 tracking-tight md:text-xl">When the user leaves</p>
			</label>

			<label className="flex items-center gap-2" htmlFor="autoResetLevelsBan">
				<Checkbox
					defaultValue={defaultValue === AutoResetLevels.Ban || defaultValue === AutoResetLevels.BanAndLeave}
					id="autoResetLevelsBan"
				/>

				<p className="text-lg text-white/75 tracking-tight md:text-xl">When the user is banned</p>
			</label>
		</div>
	);
}
