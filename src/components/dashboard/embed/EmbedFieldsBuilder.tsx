import "client-only";
// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.

import { Separator } from "@/components/Separator.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { EMBED_FIELD_NAME_MAX_LENGTH, EMBED_FIELD_VALUE_MAX_LENGTH, MAX_EMBED_FIELDS } from "@/utils/embed-limits.ts";
import { Close } from "@mui/icons-material";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { Input } from "../Input.tsx";
import { Label } from "../Label.tsx";
import { type PlaceholderValue, Textarea } from "../Textarea.tsx";

export function EmbedFieldsBuilder({ fields, setFields, emojis, roles, placeholders }: EmbedFieldsBuilderProps) {
	function handleAddNewField() {
		if (fields.length >= MAX_EMBED_FIELDS) {
			return;
		}

		setFields((prevState) => [...prevState, { name: "", value: "", inline: false }]);
	}

	function handleFieldChange<K extends keyof (typeof fields)[number]>(
		index: number,
		key: K,
		value: (typeof fields)[number][K],
	) {
		setFields((prevState) =>
			prevState.map((field, i) => {
				if (i === index) {
					return { ...field, [key]: typeof value === "function" ? (value as any)(field[key]) : value };
				}

				return field;
			}),
		);
	}

	function handleDeleteField(index: number) {
		setFields((prevState) => prevState.filter((_, i) => i !== index));
	}

	return (
		<div className="flex flex-col gap-2">
			<Label sub={`Max. ${MAX_EMBED_FIELDS}`} htmlFor="embed-fields" small>
				Fields
			</Label>

			<button
				className="rounded-lg border border-white/25 bg-light-gray px-3 py-2 transition-colors hover:bg-light-gray/50 disabled:cursor-not-allowedç disabled:opacity-50"
				type="button"
				onClick={handleAddNewField}
				disabled={fields.length >= MAX_EMBED_FIELDS}
			>
				Add new field
			</button>

			<div className="flex flex-col gap-2">
				{fields.map((field, index, self) => (
					<Fragment
						// biome-ignore lint/suspicious/noArrayIndexKey: There is no unique identifier for the fields
						key={`field-${index}`}
					>
						<div className="flex flex-col gap-4">
							<div className="flex gap-4">
								<div className="flex flex-1 flex-col gap-2">
									<div className="flex gap-2">
										<Label
											sub={`Max. ${EMBED_FIELD_NAME_MAX_LENGTH} chars`}
											htmlFor={`embed-field-name-${index}`}
											small
										>
											Field Name
										</Label>

										<button type="button" onClick={() => handleDeleteField(index)}>
											<Close className="text-red" />
										</button>
									</div>

									<Input
										id={`embed-field-name-${index}`}
										placeholder="Enter field name"
										value={field.name}
										min={1}
										maxLength={EMBED_FIELD_NAME_MAX_LENGTH}
										required
										onChange={(event) => handleFieldChange(index, "name", event.target.value)}
									/>
								</div>

								<div className="flex flex-col gap-4">
									<Label htmlFor={`embed-field-inline-${index}`} small>
										Inline
									</Label>

									<Toggle
										id={`embed-field-inline-${index}`}
										checked={field.inline}
										onChange={(event) => handleFieldChange(index, "inline", event.target.checked)}
									/>
								</div>
							</div>

							<div className="flex basis-1/2 flex-col gap-2">
								<Label sub={`Max. ${EMBED_FIELD_VALUE_MAX_LENGTH} chars`} htmlFor={`embed-field-value-${index}`} small>
									Field Value
								</Label>

								<Textarea
									placeholder="Enter field value"
									emojis={emojis}
									id={`embed-field-value-${index}`}
									max={EMBED_FIELD_VALUE_MAX_LENGTH}
									min={1}
									required
									roles={roles}
									placeholders={placeholders}
									value={field.value}
									setValue={(event: string) => handleFieldChange(index, "value", event)}
								/>
							</div>
						</div>

						{index !== self.length - 1 ? <Separator /> : null}
					</Fragment>
				))}
			</div>
		</div>
	);
}

interface EmbedFieldsBuilderProps {
	readonly fields: NonNullableFields;
	readonly setFields: Dispatch<SetStateAction<NonNullableFields>>;
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly placeholders: PlaceholderValue[];
}

type NonNullableFields = Required<NonNullable<Embed["fields"]>[number]>[];
