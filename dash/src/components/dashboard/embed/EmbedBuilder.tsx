"use client";

import { Popover, PopoverDisclosure, PopoverProvider } from "@ariakit/react";
import { type SetStateAction, useMemo, useState } from "react";
import { HexColorInput } from "react-colorful";
import { toast } from "sonner";
import { getDotPath, safeParse } from "valibot";
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
import { embedSchema } from "@/utils/embed-schema.ts";
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

		if (Object.keys(embed).length === 1 && embed.color) {
			return "{}";
		}

		return JSON.stringify(embed);
	}, [embedState, fields]);

	function handleChange(key: keyof typeof embedState, value: SetStateAction<string>) {
		setEmbedState((prevState) => ({
			...prevState,
			[key]: typeof value === "function" ? value(prevState[key]) : value,
		}));
	}

	function handleCopyEmbed() {
		void navigator.clipboard.writeText(embed);
		toast.success("Copied to clipboard");
	}

	function handleOverwriteJson() {
		// oxlint-disable-next-line eslint/no-alert -- intentional prompt for pasting embed JSON
		const json = prompt("Enter the JSON you want to overwrite the embed with:", embed);

		if (json === null) {
			return;
		}

		const result = parseEmbedFromJson(json);

		if (!result.ok) {
			// oxlint-disable-next-line eslint/no-alert -- intentional validation feedback dialog
			alert(result.error);
			return;
		}

		setEmbedState(generateDefaultEmbedState(result.embed));
		setFields(result.embed.fields?.map((field) => ({ ...field, inline: field.inline ?? false })) ?? []);
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
						setValue={(value) => handleChange("title", value)}
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
					setValue={(value) => handleChange("description", value)}
					value={embedState.description}
				/>
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<Label htmlFor="embed-author-name" small sub={`Max. ${EMBED_AUTHOR_NAME_MAX_LENGTH} chars`}>
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
					setValue={(value) => handleChange("author_name", value)}
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
					<Label htmlFor="embed-footer-text" small sub={`Max. ${EMBED_FOOTER_TEXT_MAX_LENGTH} chars`}>
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
						setValue={(value) => handleChange("footer_text", value)}
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

const MAX_REPORTED_EMBED_ISSUES = 3;

function parseEmbedFromJson(json: string): { embed: Embed; ok: true } | { error: string; ok: false } {
	let parsed: unknown;

	try {
		parsed = JSON.parse(json);
	} catch {
		return { error: "Invalid JSON", ok: false };
	}

	// The schema's `object()` lets arrays through, as they have no unknown-key check to fail.
	if (Array.isArray(parsed)) {
		return { error: "Invalid embed: expected a JSON object", ok: false };
	}

	const result = safeParse(embedSchema, parsed);

	if (result.success) {
		return { embed: result.output, ok: true };
	}

	const reasons = result.issues.slice(0, MAX_REPORTED_EMBED_ISSUES).map((issue) => {
		const path = getDotPath(issue);
		return path ? `${path}: ${issue.message}` : issue.message;
	});
	const omitted = result.issues.length - reasons.length;

	if (omitted > 0) {
		reasons.push(`…and ${omitted} more`);
	}

	return { error: `Invalid embed:\n${reasons.join("\n")}`, ok: false };
}

interface EmbedBuilderProps {
	readonly defaultValue: Embed | null;
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly placeholders: PlaceholderValue[];
}
