import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function ImportMinLevel() {
	return (
		<div className="flex w-fit flex-col gap-2">
			<Text
				tooltip="The minimum level a member has to have to be in order to be imported. Lower levels than this number will not be imported."
				docsPath="/guides/importing-levels-from-other-bots#until-option"
			>
				Minimum level to be imported:
			</Text>

			<Input id="until" placeholder="Level" type="number" min={3} max={20} defaultValue={5} required />
		</div>
	);
}
