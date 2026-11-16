import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MAX_IMPORT_MIN_LEVEL, MIN_IMPORT_MIN_LEVEL } from "./import-api.ts";

export function ImportMinLevel() {
	return (
		<div className="flex w-fit flex-col gap-2">
			<Text
				docsPath="/guides/importing-levels-from-other-bots#minimum-level-option"
				tooltip="The minimum level a member has to have to be in order to be imported. Lower levels than this number will not be imported."
			>
				Minimum level to be imported:
			</Text>

			<Input
				defaultValue={5}
				id="minLevel"
				max={MAX_IMPORT_MIN_LEVEL}
				min={MIN_IMPORT_MIN_LEVEL}
				placeholder="Level"
				required
				type="number"
			/>
		</div>
	);
}
