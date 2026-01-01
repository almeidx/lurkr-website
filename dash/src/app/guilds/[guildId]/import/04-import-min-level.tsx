import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function ImportMinLevel() {
	return (
		<div className="flex w-fit flex-col gap-2">
			<Text
				docsPath="/guides/importing-levels-from-other-bots#minimum-level-option"
				tooltip="The minimum level a member has to have to be in order to be imported. Lower levels than this number will not be imported."
			>
				Minimum level to be imported:
			</Text>

			<Input defaultValue={5} id="minLevel" max={20} min={3} placeholder="Level" required type="number" />
		</div>
	);
}
