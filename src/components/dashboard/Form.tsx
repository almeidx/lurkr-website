import { Toggle } from "@/components/Toggle.tsx";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import type { GuildSettings } from "@/lib/guild.ts";
import type { PropsWithChildren } from "react";

export function Form({ title, action, children, settingId, defaultValue, withSaveButton = true }: FormProps) {
	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<h2 className="pl-10 text-2xl font-semibold md:pl-0">{title}</h2>

			<form action={action} className="mb-12 flex flex-col gap-4">
				{settingId ? (
					<div className="flex gap-5">
						<div className="flex gap-8 rounded-lg border border-[#FFE87C80] bg-[#FFE87C26] px-4 py-2">
							<p>Turn this system on or off</p>

							<Toggle initialValue={defaultValue!} id={settingId} />
						</div>

						<SaveButton />
					</div>
				) : withSaveButton ? (
					<SaveButton />
				) : null}

				{children}
			</form>
		</div>
	);
}

type FormProps = PropsWithChildren<{
	action(data: FormData): void;
	readonly defaultValue?: boolean;
	readonly settingId?: keyof GuildSettings;
	readonly title: string;
	readonly withSaveButton?: boolean;
}>;
