import { Toggle } from "@/components/Toggle.tsx";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import type { GuildSettings } from "@/lib/guild.ts";
import type { PropsWithChildren } from "react";

export function Form({
	title,
	action,
	children,
	description,
	settingId,
	defaultValue,
	withSaveButton = true,
}: FormProps) {
	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">{title}</h2>
				{description && <p className="text-white/75">{description}</p>}
			</div>

			<form action={action} className="mb-12 flex flex-col gap-4">
				{settingId ? (
					<div className="flex flex-col gap-5 md:flex-row">
						<div className="flex w-fit gap-4 rounded-lg border border-[#ffe87c80] bg-[#ffe87c26] px-4 py-2">
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
	readonly description?: string;
	readonly settingId?: keyof GuildSettings;
	readonly title: string;
	readonly withSaveButton?: boolean;
}>;
