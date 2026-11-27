import {
	array,
	boolean,
	integer,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	optional,
	pipe,
	string,
} from "valibot";
import {
	EMBED_AUTHOR_NAME_MAX_LENGTH,
	EMBED_DESCRIPTION_MAX_LENGTH,
	EMBED_FIELD_NAME_MAX_LENGTH,
	EMBED_FIELD_VALUE_MAX_LENGTH,
	EMBED_FOOTER_TEXT_MAX_LENGTH,
	EMBED_TITLE_MAX_LENGTH,
	EMBED_URL_MAX_LENGTH,
	EMBED_URL_MIN_LENGTH,
	MAX_EMBED_FIELDS,
} from "@/utils/embed-limits.ts";

const embedUrl = pipe(string(), minLength(EMBED_URL_MIN_LENGTH), maxLength(EMBED_URL_MAX_LENGTH));

/**
 * Validates an already decoded embed object. Decoding the submitted form value is left to the caller.
 */
export const embedSchema = object({
	author: optional(
		object({
			icon_url: optional(embedUrl),
			name: pipe(string(), minLength(1), maxLength(EMBED_AUTHOR_NAME_MAX_LENGTH)),
			url: optional(embedUrl),
		}),
	),
	color: optional(pipe(number(), integer(), minValue(0), maxValue(0xffffff))),
	description: optional(pipe(string(), maxLength(EMBED_DESCRIPTION_MAX_LENGTH))),
	fields: optional(
		pipe(
			array(
				object({
					inline: optional(boolean()),
					name: pipe(string(), minLength(1), maxLength(EMBED_FIELD_NAME_MAX_LENGTH)),
					value: pipe(string(), minLength(1), maxLength(EMBED_FIELD_VALUE_MAX_LENGTH)),
				}),
			),
			maxLength(MAX_EMBED_FIELDS),
		),
	),
	footer: optional(
		object({
			icon_url: optional(embedUrl),
			text: pipe(string(), minLength(1), maxLength(EMBED_FOOTER_TEXT_MAX_LENGTH)),
		}),
	),
	image: optional(object({ url: embedUrl })),
	thumbnail: optional(object({ url: embedUrl })),
	title: optional(pipe(string(), maxLength(EMBED_TITLE_MAX_LENGTH))),
	url: optional(embedUrl),
});
