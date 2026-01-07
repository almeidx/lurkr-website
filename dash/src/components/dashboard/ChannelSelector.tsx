"use client";

import { type PropsWithChildren, useMemo, useState } from "react";
import Select from "react-select";
import { type Channel, ChannelType } from "@/lib/guild.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

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
	required,
}: ChannelSelectorProps) {
	const [values, setValues] = useState(defaultValues as Readonly<typeof defaultValues>);

	const channelOptions = useMemo(() => {
		const nonCategorizedName = "Non categorized";

		const categorized = channels.reduce((acc, channel) => {
			const parent = mapChannelIdsToChannels(channel.parentId, channels)[0] ?? null;

			if (channel.type !== ChannelType.GuildCategory) {
				if (acc.has(parent)) {
					acc.get(parent)!.push(channel);
				} else {
					acc.set(parent, [channel]);
				}
			}

			return acc;
		}, new Map<Channel | null, Channel[]>());

		return Array.from(categorized.entries())
			.map(([parent, items]) => ({
				label: parent?.name ?? nonCategorizedName,
				options: items,
			}))
			.sort((a, b) => {
				if (a.label === nonCategorizedName) return -1;
				if (b.label === nonCategorizedName) return 1;

				return a.label.localeCompare(b.label);
			});
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

			<label className="flex flex-col gap-2" htmlFor={inputId}>
				{children}

				<Select
					closeMenuOnSelect={false}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
					inputId={inputId}
					instanceId={`${inputId}-select`}
					isDisabled={disabled}
					isMulti
					menuPlacement={menuPlacement}
					onChange={(newValues) => {
						if (newValues.length > max) return;

						setValues(newValues);
						onChange?.(newValues);
					}}
					options={channelOptions}
					placeholder="e.g. general"
					required={required}
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
							boxShadow: "0px 0px 10px 0px #00000080 inset",
							color: "#e2e2e2",
							maxWidth: "48rem",
							minWidth: "16rem",
							padding: "0.2rem",
						}),
						input: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e2",
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
						multiValue: (baseStyles) => ({
							...baseStyles,
							backgroundColor: "transparent",
							border: "1px solid #e2e2e2bf",
							borderRadius: "20px",
							maxWidth: "50vw",
						}),
						multiValueLabel: (baseStyles) => ({
							...baseStyles,
							":before": {
								content: "'#'",
								margin: "0 0.2rem",
							},
							color: "#e2e2e2",
						}),
						multiValueRemove: (baseStyles) => ({
							...baseStyles,
							":hover": {
								backgroundColor: "#e2e2e2",
								color: "#2d2d2d",
							},
							borderBottomRightRadius: "20px",
							borderTopRightRadius: "20px",
							color: "#e2e2e2",
						}),
						option: (baseStyles) => ({
							...baseStyles,
							":hover": {
								backgroundColor: "#474747",
							},
							backgroundColor: "#2d2d2d",
							color: "#e2e2e2",
						}),
						placeholder: (baseStyles) => ({
							...baseStyles,
							color: "#e2e2e280",
						}),
					}}
					value={values}
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
	readonly required?: boolean;
}
