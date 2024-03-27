import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";

export function ImportUntil() {
	return (
		<div className="flex gap-2">
			<Text>and until which level to import:</Text>

			<Input id="importUntil" placeholder="Level" type="number" min={3} max={100} required />
		</div>
	);
}
