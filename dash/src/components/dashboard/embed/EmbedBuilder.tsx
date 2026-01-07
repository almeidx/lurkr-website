"use client";

import { Popover, PopoverDisclosure, PopoverProvider } from "@ariakit/react";
import { useMemo, useState } from "react";
import { HexColorInput } from "react-colorful";
import { toast } from "sonner";
import { Colorize } from "@/components/icons/mdi/colorize.tsx";
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
import { ColorPicker } from "../ColorPicker.tsx";
import { Input } from "../Input.tsx";
import { Label } from "../Label.tsx";
import { type PlaceholderValue, Textarea } from "../Textarea.tsx";
import { EmbedFieldsBuilder } from "./EmbedFieldsBuilder.tsx";

export function EmbedBuilder({ defaultValue, emojis, roles, placeholders }: EmbedBuilderProps) {
	function generateDefaultEmbedState(val: Embed) {
		return {
			author_icon_url: val.author?.icon_url ?? "",
			author_name: val.author?.name ?? "",
			author_url: val.author?.url ?? "",
			color: val.color ? `#${val.color.toString(16).padStart(6, "0")}` : BRAND_COLOR,
			description: val.description ?? "",
			footer_icon_url: val.footer?.icon_url ?? "",
			footer_text: val.footer?.text ?? "",
			image_url: val.image?.url ?? "",
			thumbnail_url: val.thumbnail?.url ?? "",
			title: val.title ?? "",
			url: val.url ?? "",
		};
	}

	const [embedState, setEmbedState] = useState(() => generateDefaultEmbedState(defaultValue ?? {}));
	const [fields, setFields] = useState(
		() => defaultValue?.fields?.map((field) => ({ ...field, inline: field.inline ?? false })) ?? [],
	);

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
				inline: field.inline,
				name: field.name,
				value: field.value,
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
		navigator.clipboard.writeText(embed);
		toast.success("Copied to clipboard");
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
		} catch (_error) {
			alert("Invalid JSON");
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<input name="xpMessageEmbed" type="hidden" value={embed} />

			<div className="flex flex-col-reverse items-start justify-between gap-2 xl:flex-row">
				<div className="flex flex-col gap-2">
					<Label htmlFor="embed-color" small>
						Color
					</Label>

					<PopoverProvider>
						<div className="flex items-center gap-2">
							<PopoverDisclosure className="h-10 rounded-lg bg-light-gray px-3 py-2">
								<Colorize />
							</PopoverDisclosure>

							<HexColorInput
								className="w-52 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-64"
								color={embedState.color}
								id="embed-color"
								name="embed-color"
								onChange={(color) => handleChange("color", color)}
								prefixed
							/>

							<div aria-hidden className="size-7 rounded-lg" style={{ backgroundColor: embedState.color }} />
						</div>

						<Popover className="my-4">
							<ColorPicker onChange={(color) => handleChange("color", color)} value={embedState.color} />
						</Popover>
					</PopoverProvider>
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
					<Label htmlFor="embed-title" small sub={`Max. ${EMBED_TITLE_MAX_LENGTH} chars`}>
						Title
					</Label>

					<Textarea
						emojis={emojis}
						emulateInput
						id="embed-title"
						max={EMBED_TITLE_MAX_LENGTH}
						min={1}
						placeholder="Enter title"
						placeholders={placeholders}
						roles={roles}
						setValue={(event: string) => handleChange("title", event)}
						value={embedState.title}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-url" small>
						URL
					</Label>

					<Input
						id="embed-url"
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("url", event.target.value)}
						placeholder="Enter URL"
						value={embedState.url}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="embed-description" small sub={`Max. ${EMBED_DESCRIPTION_MAX_LENGTH} chars`}>
					Description
				</Label>

				<Textarea
					emojis={emojis}
					id="embed-description"
					max={EMBED_DESCRIPTION_MAX_LENGTH}
					min={1}
					placeholder="Enter description"
					placeholders={placeholders}
					roles={roles}
					setValue={(event: string) => handleChange("description", event)}
					value={embedState.description}
				/>
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<Label htmlFor="embed-author-name" small sub="Max. 256 chars">
					Author Name
				</Label>

				<Textarea
					emojis={emojis}
					emulateInput
					id="embed-author-name"
					max={EMBED_AUTHOR_NAME_MAX_LENGTH}
					min={1}
					placeholder="Enter author name"
					placeholders={placeholders}
					roles={roles}
					setValue={(event: string) => handleChange("author_name", event)}
					value={embedState.author_name}
				/>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-author-icon" small>
						Author Icon
					</Label>

					<Input
						id="embed-author-icon"
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("author_icon_url", event.target.value)}
						placeholder="Enter author icon URL"
						value={embedState.author_icon_url}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-author-url" small>
						Author URL
					</Label>

					<Input
						id="embed-author-url"
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("author_url", event.target.value)}
						placeholder="Enter author URL"
						value={embedState.author_url}
					/>
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-footer-text" small sub="Max. 2048 chars">
						Footer Text
					</Label>

					<Textarea
						emojis={emojis}
						emulateInput
						id="embed-footer-text"
						max={EMBED_FOOTER_TEXT_MAX_LENGTH}
						min={1}
						placeholder="Enter footer text"
						placeholders={placeholders}
						roles={roles}
						setValue={(event: string) => handleChange("footer_text", event)}
						value={embedState.footer_text}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-footer-icon" small>
						Footer Icon
					</Label>

					<Input
						id="embed-footer-icon"
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("footer_icon_url", event.target.value)}
						placeholder="Footer icon URL"
						value={embedState.footer_icon_url}
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
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("image_url", event.target.value)}
						placeholder="Enter image URL"
						value={embedState.image_url}
					/>
				</div>

				<div className="flex flex-col gap-2 md:basis-1/2">
					<Label htmlFor="embed-thumbnail-url" small>
						Thumbnail URL
					</Label>

					<Input
						id="embed-thumbnail-url"
						maxLength={EMBED_URL_MAX_LENGTH}
						minLength={EMBED_URL_MIN_LENGTH}
						onChange={(event) => handleChange("thumbnail_url", event.target.value)}
						placeholder="Enter thumbnail URL"
						value={embedState.thumbnail_url}
					/>
				</div>
			</div>

			<Separator />

			<EmbedFieldsBuilder
				emojis={emojis}
				fields={fields}
				placeholders={placeholders}
				roles={roles}
				setFields={setFields}
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
