import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function ImportUntil() {
	return (
		<div className="flex w-fit flex-col gap-2">
			<Text>Import all users until level:</Text>

			<Input id="until" placeholder="Level" type="number" min={3} max={20} defaultValue={5} required />
		</div>
	);
}
