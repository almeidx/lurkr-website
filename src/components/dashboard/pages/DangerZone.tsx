/* eslint-disable unicorn/consistent-function-scoping, promise/prefer-await-to-then */

import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "@/dashboard/Header";
import Button from "@/form/Button";
import Field from "@/form/Field";
import Fieldset from "@/form/Fieldset";
import Label from "@/form/Label";
import type { GuildSettings } from "~/contexts/GuildContext";
import { API_BASE_URL } from "~/utils/constants";

export default function DangerZone({ settings, openMenu }: MentionCooldownProps) {
	const router = useRouter();

	useEffect(() => window.scroll({ behavior: "auto", left: 0, top: 0 }), [openMenu]);

	const handleDeleteGuild = () => {
		fetch(`${API_BASE_URL}/guilds/${settings.id}`, { credentials: "include", method: "DELETE" })
			.then((res) => {
				if (res.status === 204) {
					void router.push("/guilds");
				} else {
					// TODO: Show failure message
				}
			})
			.catch(() => {
				//
			});
	};

	return (
		<>
			<Header description="Dangerous settings." openMenu={openMenu} title="Danger Zone" />

			<Fieldset>
				<Field>
					<Label htmlFor="resetSettings" name="Reset Settings" url="https://docs.pepemanager.com/" />

					<p className="mb-2 rounded-lg text-white">
						This will reset all settings to their default values. Additionally, it will remove all leveling data, member
						counts, and milestones.
					</p>
					<p className="mb-2 rounded-lg text-red-500">
						CAUTION: This action is irreversible. Please make sure you want to do this before proceeding.
					</p>

					<Button onClick={handleDeleteGuild} red withConfirmation>
						Reset Settings
					</Button>
				</Field>
			</Fieldset>
		</>
	);
}

interface MentionCooldownProps {
	openMenu(): void;
	settings: GuildSettings;
}
