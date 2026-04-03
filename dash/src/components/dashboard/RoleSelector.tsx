"use client";

import { type PropsWithChildren, useState } from "react";
import Select, { components, type GroupBase, type OptionProps, type StylesConfig } from "react-select";
import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { baseSelectStyles } from "./select-styles.ts";

const roleSelectStyles: StylesConfig<RoleWithResolvedColor, true> = {
	...baseSelectStyles,
	multiValue: (baseStyles, state) => ({
		...baseStyles,
		backgroundColor: "transparent",
		border: `1px solid ${state.data.resolvedColor}`,
		borderRadius: "20px",
		maxWidth: "50vw",
	}),
	multiValueLabel: (baseStyles, state) => ({
		...baseStyles,
		":before": {
			backgroundColor: state.data.resolvedColor,
			borderRadius: "50%",
			content: "''",
			display: "block",
			flexShrink: "0",
			height: "14px",
			margin: "0 0.1rem",
			width: "14px",
		},
		alignItems: "center",
		color: "#e2e2e2",
		display: "flex",
		gap: "0.2rem",
	}),
	multiValueRemove: (baseStyles, state) => ({
		...baseStyles,
		":hover": {
			backgroundColor: state.data.resolvedColor,
			color: "#2d2d2d",
		},
		borderBottomRightRadius: "20px",
		borderTopRightRadius: "20px",
		color: "#e2e2e2",
	}),
};

const selectComponents = { Option } as const;

export function RoleSelector({
	children,
	defaultValues,
	inputId,
	max,
	menuPlacement = "auto",
	onChange,
	roles,
	settingId,
}: RoleSelectorProps) {
	const [values, setValues] = useState(defaultValues as Readonly<typeof defaultValues>);

	const roleOptions = roles.map((role) => ({
		...role,
		resolvedColor: decimalRoleColorToHex(role.color),
	}));

	return (
		<>
			<input
				className="hidden size-0"
				name={settingId}
				readOnly
				type="hidden"
				value={values.map(({ id }) => id).join(",")}
			/>

			<label className="flex flex-col gap-2" htmlFor={inputId}>
				{children}

				<Select
					closeMenuOnSelect={false}
					components={selectComponents}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
					inputId={inputId}
					instanceId={`${inputId}-select`}
					isMulti
					menuPlacement={menuPlacement}
					onChange={(newValues) => {
						if (newValues.length > max) return;

						setValues(newValues);
						onChange?.(newValues);
					}}
					options={roleOptions}
					placeholder="e.g. Member"
					styles={roleSelectStyles}
					value={values}
				/>
			</label>
		</>
	);
}

function Option<
	IsMulti extends boolean = false,
	Group extends GroupBase<RoleWithResolvedColor> = GroupBase<RoleWithResolvedColor>,
>({ children, ...props }: OptionProps<RoleWithResolvedColor, IsMulti, Group>) {
	return (
		<components.Option {...props}>
			<span className="flex flex-1 items-center gap-2 text-left">
				<div className="size-3.5 rounded-full" style={{ backgroundColor: props.data.resolvedColor }} />

				<span className="flex w-full items-center">{children}</span>
			</span>
		</components.Option>
	);
}

interface RoleSelectorProps extends PropsWithChildren {
	readonly defaultValues: RoleWithResolvedColor[];
	/**
	 * Id for the input where the user can type
	 */
	readonly inputId: string;
	readonly max: number;
	readonly menuPlacement?: "auto" | "top" | "bottom";
	onChange?(newValues: readonly RoleWithResolvedColor[]): void;
	readonly roles: Role[];
	/**
	 * Id for the input containing the channel ids (hidden)
	 */
	readonly settingId: string;
}

export type RoleWithResolvedColor = Role & { readonly resolvedColor: string };
