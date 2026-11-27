import type { ReactNode } from "react";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

/**
 * A role picker for a setting capped by a premium limit. The limit's key is also the form field the roles are
 * submitted in.
 */
export function LimitedRoleSelector(props: LimitedRoleSelectorProps) {
	const { defaultValues, inputId, label, limit, menuPlacement, premium, roles, unit } = props;

	const labelElement = <Label sub={limitLabel(limit, unit)}>{label}</Label>;

	return (
		<RoleSelector
			defaultValues={mapRoleIdsToRoles(defaultValues, roles)}
			inputId={inputId}
			max={limitFor(limit, premium)}
			menuPlacement={menuPlacement}
			roles={roles}
			settingId={limit}
		>
			{"docsPath" in props ? (
				<div className="flex items-center">
					{labelElement}

					<DocsBubble path={props.docsPath} tooltip={props.tooltip} />
				</div>
			) : (
				labelElement
			)}
		</RoleSelector>
	);
}

type LimitedRoleSelectorProps =
	| BaseLimitedRoleSelectorProps
	| (BaseLimitedRoleSelectorProps & {
			readonly docsPath: string;
			readonly tooltip: string;
	  });

interface BaseLimitedRoleSelectorProps {
	readonly defaultValues: Snowflake[];
	/** Id for the input where the user can type */
	readonly inputId: string;
	readonly label: ReactNode;
	readonly limit: "autoRole" | "milestonesRoles" | "noRoleRewardRoles" | "noTopXpRoles" | "noXpRoles";
	readonly menuPlacement?: "auto" | "top" | "bottom";
	readonly premium: boolean;
	readonly roles: Role[];
	/** What is being counted, e.g. `"roles"`. */
	readonly unit?: string;
}
