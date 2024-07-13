"use client";

import { Toggle } from "@/components/Toggle.tsx";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import type { GuildSettings } from "@/lib/guild.ts";
import { type PropsWithChildren, useActionState, useEffect, useState } from "react";

export function Form({
	title,
	action,
	children,
	description,
	settingId,
	defaultValue,
	withSaveButton = true,
}: FormProps) {
	const [buttonId, setButtonId] = useState(() => crypto.randomUUID());
	const [state, formAction, isPending] = useActionState(action, null);

	useEffect(() => {
		if (state === false) {
			alert("Failed to save settings. There is likely an issue with your configuration.");
		}
	}, [state]);

	useEffect(() => {
		if (isPending) {
			setButtonId(crypto.randomUUID());
		}
	}, [isPending]);

	return (
		// If this form is updated, the change must be replicated with the one on
		// /app/guilds/[guildId]/import/01-leveling-import.tsx component
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">{title}</h2>
				{description && <p className="text-white/75">{description}</p>}
			</div>

			<form action={formAction} className="mb-12 flex flex-col gap-4">
				{settingId ? (
					<div className="flex flex-col gap-5 md:flex-row">
						<div className="flex w-fit gap-4 rounded-lg border border-[#ffe87c80] bg-[#ffe87c26] px-4 py-2">
							<p>Turn this system on or off</p>

							<Toggle initialValue={defaultValue!} id={settingId} />
						</div>

						{/* The key is being used here to reset the dependency array of the useEffect used in the SaveButton component */}
						<SaveButton pending={isPending} success={state} key={buttonId} />
					</div>
				) : withSaveButton ? (
					<SaveButton pending={isPending} success={state} key={buttonId} />
				) : null}

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
	readonly withSaveButton?: boolean;
}>;
