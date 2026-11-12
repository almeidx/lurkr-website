"use client";

import { createContext, type PropsWithChildren, use, useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { GenericIssue } from "valibot";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import type { GuildSettings, SaveNotice } from "@/lib/guild.ts";
import type { ServerActionError } from "@/utils/server-action-error.ts";

const SaveNoticeContext = createContext<SaveNotice | null>(null);

/** The notice of the last save of the surrounding `Form`, if it had one. */
export function useSaveNotice(): SaveNotice | null {
	return use(SaveNoticeContext);
}

export function Form({ title, action, children, description, settingId, defaultValue }: FormProps) {
	const [state, formAction, isPending] = useActionState(action, null);

	const saveNotice = typeof state === "object" && state !== null && "success" in state ? state : null;

	useEffect(() => {
		if (state === false) {
			toast.error("Failed to save settings", {
				description: "There is likely an issue with your configuration.",
			});
		} else if (state && typeof state === "object" && "error" in state) {
			console.error("Failed to save settings", state);

			let errorMessage: string;

			if (state.issues) {
				const issues = JSON.parse(state.issues) as GenericIssue[];
				errorMessage = issues
					.map((issue) => {
						const key = issue.path?.[0]?.key;
						const label =
							typeof key === "string" ? key : typeof key === "symbol" ? (key.description ?? "Unknown") : "Unknown";
						return `${label}: ${issue.message}`;
					})
					.join("\n");
			} else if (state.issue) {
				errorMessage = state.issue;
			} else {
				errorMessage = "An unknown error occurred.";
			}

			toast.error("Failed to save settings", { description: errorMessage });
		}
	}, [state]);

	return (
		// If this form is updated, the change must be replicated with the one on
		// /app/(dashboard)/guilds/[guildId]/import/01-leveling-import.tsx
		<div className="flex w-full flex-col gap-5 p-4">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">{title}</h2>
				{description && <p className="text-white/75">{description}</p>}
			</div>

			<form action={formAction} className="mb-12 flex flex-col gap-4">
				<div className="flex flex-col gap-5 md:flex-row">
					{settingId ? (
						<div className="flex w-fit gap-4 rounded-lg border border-[#ffe87c80] bg-[#ffe87c26] px-4 py-2">
							<p>Turn this system on or off</p>

							<Toggle id={settingId} initialValue={defaultValue} />
						</div>
					) : null}

					<SaveButton pending={isPending} success={state === null ? null : state === true || saveNotice !== null} />
				</div>

				<SaveNoticeContext value={saveNotice}>{children}</SaveNoticeContext>
			</form>
		</div>
	);
}

type FormProps = PropsWithChildren<{
	action(
		currentState: unknown,
		data: FormData,
	): Promise<boolean | SaveNotice | { error: ServerActionError; issues?: string; issue?: string }>;
	readonly defaultValue?: boolean;
	readonly description?: string;
	readonly settingId?: keyof GuildSettings;
	readonly title: string;
}>;
