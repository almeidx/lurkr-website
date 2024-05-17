"use client";

import { type Channel, ChannelType } from "@/lib/guild.ts";
import { type PropsWithChildren, useMemo, useState } from "react";
import Select from "react-select";

export function ChannelSelector({
	channels,
	children,
	defaultValues,
	disabled,
	inputId,
	max,
	menuPlacement = "auto",
	onChange,
	settingId,
}: ChannelSelectorProps) {
	const [values, setValues] = useState(defaultValues as Readonly<typeof defaultValues>);

	const channelOptions = useMemo(() => {
		const categorized = channels.reduce((acc, channel) => {
			const parent = channel.parentId ? channels.find(({ id }) => id === channel.parentId) ?? null : null;

			if (acc.has(parent)) {
				acc.get(parent)!.push(channel);
			} else if (channel.type !== ChannelType.GuildCategory) {
				acc.set(parent, [channel]);
			}

			return acc;
		}, new Map<Channel | null, Channel[]>());

		return Array.from(categorized.entries()).map(([parent, items]) => ({
			label: parent?.name ?? "Non categorized",
			options: items,
		}));
	}, [channels]);

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
					options={channelOptions}
					isMulti
					placeholder="e.g. general"
					value={values}
					isDisabled={disabled}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
					onChange={(newValues) => {
						if (newValues.length > max) return;

						setValues(newValues);
						onChange?.(newValues);
					}}
					closeMenuOnSelect={false}
					menuPlacement={menuPlacement}
					styles={{
						container: (baseStyles) => ({
							...baseStyles,
							opacity: disabled ? 0.5 : 1,
						}),
						control: (baseStyles) => ({
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
						menu: (baseStyles) => ({
							...baseStyles,
							backgroundColor: "#2d2d2d",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
							maxWidth: "48rem",
							minWidth: "16rem",
							zIndex: "999999",
						}),
						option: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e2",
							backgroundColor: "#2d2d2d",
							":hover": {
								backgroundColor: "#474747",
							},
						}),
						multiValue: (baseStyles) => ({
							...baseStyles,
							backgroundColor: "transparent",
							border: "1px solid #e2e2e2bf",
							borderRadius: "20px",
						}),
						multiValueLabel: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e2",
							":before": {
								content: "'#'",
								margin: "0 0.2rem",
							},
						}),
						input: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e2",
						}),
						multiValueRemove: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e2",
							borderTopRightRadius: "20px",
							borderBottomRightRadius: "20px",
							":hover": {
								backgroundColor: "#e2e2e2",
								color: "#2d2d2d",
							},
						}),
						placeholder: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e280",
						}),
					}}
				/>
			</label>
		</>
	);
}

interface ChannelSelectorProps extends PropsWithChildren {
	readonly channels: Channel[];
	readonly defaultValues: Channel[];
	readonly disabled?: boolean;
	/**
	 * Id for the input where the user can type
	 */
	readonly inputId: string;
	readonly max: number;
	readonly menuPlacement?: "auto" | "top" | "bottom";
	onChange?(newValues: readonly Channel[]): void;
	/**
	 * Id for the input containing the channel ids (hidden)
	 */
	readonly settingId: string;
}
