"use client";

import { Separator } from "@/components/Separator.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { BRAND_COLOR } from "@/utils/constants.ts";
import {
	EMBED_AUTHOR_NAME_MAX_LENGTH,
	EMBED_DESCRIPTION_MAX_LENGTH,
	EMBED_FOOTER_TEXT_MAX_LENGTH,
	EMBED_TITLE_MAX_LENGTH,
	EMBED_URL_MAX_LENGTH,
	EMBED_URL_MIN_LENGTH,
} from "@/utils/embed-limits.ts";
import { Popover, PopoverDisclosure, usePopoverStore } from "@ariakit/react/popover";
import { Colorize } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { HexColorInput } from "react-colorful";
import { ColorPicker } from "../ColorPicker.tsx";
import { Input } from "../Input.tsx";
import { Label } from "../Label.tsx";
import { type PlaceholderValue, Textarea } from "../Textarea.tsx";
import { EmbedFieldsBuilder } from "./EmbedFieldsBuilder.tsx";

export function EmbedBuilder({ defaultValue, emojis, roles, placeholders }: EmbedBuilderProps) {
	function generateDefaultEmbedState(val: Embed) {
		return {
			title: val.title ?? "",
			description: val.description ?? "",
			color: val.color ? `#${val.color.toString(16).padStart(6, "0")}` : BRAND_COLOR,
			url: val.url ?? "",
			author_name: val.author?.name ?? "",
			author_icon_url: val.author?.icon_url ?? "",
			author_url: val.author?.url ?? "",
			footer_text: val.footer?.text ?? "",
			footer_icon_url: val.footer?.icon_url ?? "",
			image_url: val.image?.url ?? "",
			thumbnail_url: val.thumbnail?.url ?? "",
		};
	}

	const [embedState, setEmbedState] = useState(() => generateDefaultEmbedState(defaultValue ?? {}));
	const [fields, setFields] = useState(
		() => defaultValue?.fields?.map((field) => ({ ...field, inline: field.inline ?? false })) ?? [],
	);

	const popover = usePopoverStore();

	const embed = useMemo(() => {
		const embed: Embed = {};

		if (embedState.title) {
			embed.title = embedState.title;
		}

		if (embedState.description) {
			embed.description = embedState.description;
		}

		if (embedState.url) {
			embed.url = embedState.url;
		}

		if (embedState.author_name) {
			embed.author = {
				name: embedState.author_name,
			};

			if (embedState.author_icon_url) {
				embed.author.icon_url = embedState.author_icon_url;
			}

			if (embedState.author_url) {
				embed.author.url = embedState.author_url;
			}
		}

		if (embedState.footer_text) {
			embed.footer = {
				text: embedState.footer_text,
			};

			if (embedState.footer_icon_url) {
				embed.footer.icon_url = embedState.footer_icon_url;
			}
		}

		if (embedState.image_url) {
			embed.image = {
				url: embedState.image_url,
			};
		}

		if (embedState.thumbnail_url) {
			embed.thumbnail = {
				url: embedState.thumbnail_url,
			};
		}

		embed.color = Number.parseInt(embedState.color.replace("#", ""), 16);

		if (fields.length) {
			embed.fields = fields.map((field) => ({
				name: field.name,
				value: field.value,
				inline: field.inline,
			}));
		}

		// Check if the only key is color
		if (Object.keys(embed).length === 1 && embed.color) {
			return "{}";
		}

		return JSON.stringify(embed);
	}, [embedState, fields]);

	function handleChange<K extends keyof typeof embedState>(key: K, value: (typeof embedState)[K]) {
		setEmbedState((prevState) => ({
			...prevState,
			[key]: typeof value === "function" ? (value as any)(prevState[key]) : value,
		}));
	}

	function handleCopyEmbed() {
		// TODO: Add user feedback
		navigator.clipboard.writeText(embed);
	}

	function handleOverwriteJson() {
		const json = prompt("Enter the JSON you want to overwrite the embed with:", embed);

		if (json === null) {
			return;
		}

		try {
			const parsed = JSON.parse(json);

			if (typeof parsed !== "object" || !parsed || Array.isArray(parsed)) {
				alert("Invalid JSON");
				return;
			}

			setEmbedState(generateDefaultEmbedState(parsed));
			setFields(parsed.fields ?? []);
		} catch (error) {
			alert("Invalid JSON");
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<input type="hidden" name="xpMessageEmbed" value={embed} />

			<div className="flex flex-col-reverse items-start justify-between gap-2 xl:flex-row">
				<div className="flex flex-col gap-2">
					<Label htmlFor="embed-color" small>
						Color
					</Label>

					<div className="flex items-center gap-2">
						<PopoverDisclosure className="h-10 rounded-lg bg-light-gray px-3 py-2 disabled:opacity-50" store={popover}>
							<Colorize />
						</PopoverDisclosure>

						<HexColorInput
							className="w-52 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner disabled:opacity-50 md:w-64"
							color={embedState.color}
							prefixed
							onChange={(color) => handleChange("color", color)}
							id="embed-color"
							name="embed-color"
						/>

						<div aria-hidden="true" className="size-7 rounded-lg" style={{ backgroundColor: embedState.color }} />
					</div>

					<Popover store={popover} className="my-4">
						<ColorPicker onChange={(color) => handleChange("color", color)} value={embedState.color} />
					</Popover>
				</div>

				<div className="flex gap-2">
					<button
						className="rounded-lg border border-white/25 bg-light-gray px-3 py-2 transition-colors hover:bg-light-gray/50"
						onClick={handleCopyEmbed}
						type="button"
					>
						Copy Embed
					</button>

					<button
						className="rounded-lg border border-white/25 bg-light-gray px-3 py-2 transition-colors hover:bg-light-gray/50"
						onClick={handleOverwriteJson}
						type="button"
					>
						Overwrite JSON
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label sub={`Max. ${EMBED_TITLE_MAX_LENGTH} chars`} htmlFor="embed-title" small>
						Title
					</Label>

					<Textarea
						placeholder="Enter title"
						emojis={emojis}
						id="embed-title"
						max={EMBED_TITLE_MAX_LENGTH}
						min={1}
						roles={roles}
						placeholders={placeholders}
						value={embedState.title}
						setValue={(event: string) => handleChange("title", event)}
						emulateInput
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-url" small>
						URL
					</Label>

					<Input
						id="embed-url"
						placeholder="Enter URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.url}
						onChange={(event) => handleChange("url", event.target.value)}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label sub={`Max. ${EMBED_DESCRIPTION_MAX_LENGTH} chars`} htmlFor="embed-description" small>
					Description
				</Label>

				<Textarea
					placeholder="Enter description"
					emojis={emojis}
					id="embed-description"
					max={EMBED_DESCRIPTION_MAX_LENGTH}
					min={1}
					roles={roles}
					placeholders={placeholders}
					value={embedState.description}
					setValue={(event: string) => handleChange("description", event)}
				/>
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<Label sub="Max. 256 chars" htmlFor="embed-author-name" small>
					Author Name
				</Label>

				<Textarea
					placeholder="Enter author name"
					emojis={emojis}
					id="embed-author-name"
					max={EMBED_AUTHOR_NAME_MAX_LENGTH}
					min={1}
					roles={roles}
					placeholders={placeholders}
					value={embedState.author_name}
					setValue={(event: string) => handleChange("author_name", event)}
					emulateInput
				/>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-author-icon" small>
						Author Icon
					</Label>

					<Input
						id="embed-author-icon"
						placeholder="Enter author icon URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.author_icon_url}
						onChange={(event) => handleChange("author_icon_url", event.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-author-url" small>
						Author URL
					</Label>

					<Input
						id="embed-author-url"
						placeholder="Enter author URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.author_url}
						onChange={(event) => handleChange("author_url", event.target.value)}
					/>
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label sub="Max. 2048 chars" htmlFor="embed-footer-text" small>
						Footer Text
					</Label>

					<Textarea
						placeholder="Enter footer text"
						emojis={emojis}
						id="embed-footer-text"
						max={EMBED_FOOTER_TEXT_MAX_LENGTH}
						min={1}
						roles={roles}
						placeholders={placeholders}
						value={embedState.footer_text}
						setValue={(event: string) => handleChange("footer_text", event)}
						emulateInput
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-footer-icon" small>
						Footer Icon
					</Label>

					<Input
						id="embed-footer-icon"
						placeholder="Footer icon URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.footer_icon_url}
						onChange={(event) => handleChange("footer_icon_url", event.target.value)}
					/>
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-image-url" small>
						Image URL
					</Label>

					<Input
						id="embed-image-url"
						placeholder="Enter image URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.image_url}
						onChange={(event) => handleChange("image_url", event.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-thumbnail-url" small>
						Thumbnail URL
					</Label>

					<Input
						id="embed-thumbnail-url"
						placeholder="Enter thumbnail URL"
						minLength={EMBED_URL_MIN_LENGTH}
						maxLength={EMBED_URL_MAX_LENGTH}
						value={embedState.thumbnail_url}
						onChange={(event) => handleChange("thumbnail_url", event.target.value)}
					/>
				</div>
			</div>

			<Separator />

			<EmbedFieldsBuilder
				fields={fields}
				setFields={setFields}
				emojis={emojis}
				roles={roles}
				placeholders={placeholders}
			/>
		</div>
	);
}

interface EmbedBuilderProps {
	readonly defaultValue: Embed | null;
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly placeholders: PlaceholderValue[];
}
