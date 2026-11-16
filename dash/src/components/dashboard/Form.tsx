"use client";

import { createContext, type PropsWithChildren, use, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardPage } from "@/components/dashboard/DashboardPage.tsx";
import { SaveButton } from "@/components/dashboard/SaveButton.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import type { GuildSettings, SaveResult } from "@/lib/guild.ts";

type SuccessfulSave = Extract<SaveResult, { ok: true }>;

const LastSaveContext = createContext<SuccessfulSave | null>(null);

/** The last successful save of the surrounding `Form`, if there was one. */
export function useLastSave(): SuccessfulSave | null {
	return use(LastSaveContext);
}

export function Form({ title, action, children, description, settingId, defaultValue }: FormProps) {
	const [state, formAction, isPending] = useActionState(action, null);

	useEffect(() => {
		if (state?.ok === false) {
			console.error("Failed to save settings", state.error);
			toast.error("Failed to save settings", { description: state.error });
		}
	}, [state]);

	return (
		<DashboardPage description={description} title={title}>
			<form action={formAction} className="mb-12 flex flex-col gap-4">
				<div className="flex flex-col gap-5 md:flex-row">
					{settingId ? (
						<div className="flex w-fit gap-4 rounded-lg border border-[#ffe87c80] bg-[#ffe87c26] px-4 py-2">
							<p>Turn this system on or off</p>

							<Toggle id={settingId} initialValue={defaultValue} />
						</div>
					) : null}

					<SaveButton pending={isPending} success={state?.ok ?? null} />
				</div>

				<LastSaveContext value={state?.ok ? state : null}>{children}</LastSaveContext>
			</form>
		</DashboardPage>
	);
}

type FormProps = PropsWithChildren<{
	action(previousState: SaveResult | null, form: FormData): Promise<SaveResult>;
	readonly defaultValue?: boolean;
	readonly description?: string;
	readonly settingId?: keyof GuildSettings;
	readonly title: string;
}>;
