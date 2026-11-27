import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";

export function LevelingChannelMode({ defaultValue }: { readonly defaultValue: XpChannelMode }) {
	return (
		// `key` is required here to prevent rollback to previous setting after saving
		<RadioGroup
			aria-label="Leveling channel mode"
			className="w-fit gap-4"
			defaultValue={defaultValue}
			key={defaultValue}
			name="xpChannelMode"
		>
			<Radio value={XpChannelMode.Whitelist}>Allow leveling only in these channels…</Radio>
			<Radio value={XpChannelMode.Blacklist}>Allow leveling in all channels except…</Radio>
		</RadioGroup>
	);
}
