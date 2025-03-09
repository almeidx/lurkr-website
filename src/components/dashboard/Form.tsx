"use client";

import { Toggle } from "@/components/Toggle.tsx";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import type { GuildSettings } from "@/lib/guild.ts";
import { type PropsWithChildren, useActionState, useEffect } from "react";

export function Form({ title, action, children, description, settingId, defaultValue }: FormProps) {
	const [state, formAction, isPending] = useActionState(action, null);

	useEffect(() => {
		if (state === false) {
			alert("Failed to save settings. There is likely an issue with your configuration.");
		}
	}, [state]);

	return (
		// If this form is updated, the change must be replicated with the one on
		// /app/(dashboard)/guilds/[guildId]/import/01-leveling-import.tsx
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">{title}</h2>
				{description && <p className="text-white/75">{description}</p>}
			</div>

			<form action={formAction} className="mb-12 flex flex-col gap-4">
				<div className="flex flex-col gap-5 md:flex-row">
					{settingId ? (
						<div className="flex w-fit gap-4 rounded-lg border border-[#ffe87c80] bg-[#ffe87c26] px-4 py-2">
							<p>Turn this system on or off</p>

							<Toggle initialValue={defaultValue!} id={settingId} />
						</div>
					) : null}

					<SaveButton pending={isPending} success={state} />
				</div>

				{children}
			</form>
		</div>
	);
}

type FormProps = PropsWithChildren<{
	action(currentState: unknown, data: FormData): Promise<boolean>;
	readonly defaultValue?: boolean;
	readonly description?: string;
	readonly settingId?: keyof GuildSettings;
	readonly title: string;
}>;
