"use client";

import type { Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { type PropsWithChildren, useState } from "react";
import Select, { type CSSObjectWithLabel, type GroupBase, type OptionProps, components } from "react-select";

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

			<label htmlFor={inputId} className="flex flex-col gap-2">
				{children}

				<Select
					instanceId={`${inputId}-select`}
					inputId={inputId}
					options={roleOptions}
					getOptionLabel={(option: RoleWithResolvedColor) => option.name}
					getOptionValue={(option: RoleWithResolvedColor) => option.id}
					isMulti
					placeholder="e.g. Member"
					value={values}
					onChange={(newValues: readonly RoleWithResolvedColor[]) => {
						if (newValues.length > max) return;

						setValues(newValues);
						onChange?.(newValues);
					}}
					closeMenuOnSelect={false}
					menuPlacement={menuPlacement}
					components={{ Option }}
					styles={{
						control: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#474747",
							border: "none",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
							boxShadow: "0px 0px 10px 0px #00000080 inset",
							maxWidth: "48rem",
							minWidth: "16rem",
							padding: "0.2rem",
						}),
						menu: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#2d2d2d",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
							maxWidth: "48rem",
							minWidth: "16rem",
						}),
						option: (baseStyles: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
							...baseStyles,
							backgroundColor: state.isFocused ? "#474747" : "#2d2d2d",
							color: "#e2e2e2",
						}),
						multiValue: (baseStyles: CSSObjectWithLabel, state: { data: { resolvedColor: string } }) => ({
							...baseStyles,
							backgroundColor: "transparent",
							border: `1px solid ${state!.data!.resolvedColor}`,
							borderRadius: "20px",
							maxWidth: "50vw",
						}),
						multiValueLabel: (baseStyles: CSSObjectWithLabel, state: { data: { resolvedColor: string } }) => ({
							...baseStyles,
							color: "#e2e2e2",

							display: "flex",
							alignItems: "center",
							gap: "0.2rem",

							":before": {
								display: "block",
								content: "''",
								margin: "0 0.1rem",
								width: "14px",
								height: "14px",
								backgroundColor: state!.data!.resolvedColor,
								borderRadius: "50%",
								flexShrink: "0",
							},
						}),
						input: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e2",
						}),
						multiValueRemove: (baseStyles: CSSObjectWithLabel, state: { data: { resolvedColor: string } }) => ({
							...baseStyles,
							color: "#e2e2e2",
							borderTopRightRadius: "20px",
							borderBottomRightRadius: "20px",
							":hover": {
								backgroundColor: state!.data!.resolvedColor,
								color: "#2d2d2d",
							},
						}),
						placeholder: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e280",
						}),
					}}
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
