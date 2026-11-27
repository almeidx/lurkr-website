import "client-only";
// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { Close } from "@/components/icons/mdi/close.tsx";
import { Separator } from "@/components/Separator.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { EMBED_FIELD_NAME_MAX_LENGTH, EMBED_FIELD_VALUE_MAX_LENGTH, MAX_EMBED_FIELDS } from "@/utils/embed-limits.ts";
import { Input } from "../Input.tsx";
import { Label } from "../Label.tsx";
import { type PlaceholderValue, Textarea } from "../Textarea.tsx";

export function EmbedFieldsBuilder({ fields, setFields, emojis, roles, placeholders }: EmbedFieldsBuilderProps) {
	function handleAddNewField() {
		if (fields.length >= MAX_EMBED_FIELDS) {
			return;
		}

		setFields((prevState) => [...prevState, { inline: false, name: "", value: "" }]);
	}

	function handleFieldChange(index: number, update: (field: NonNullableFields[number]) => NonNullableFields[number]) {
		setFields((prevState) => prevState.map((field, i) => (i === index ? update(field) : field)));
	}

	function handleDeleteField(index: number) {
		setFields((prevState) => prevState.filter((_, i) => i !== index));
	}

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="embed-fields" small sub={`Max. ${MAX_EMBED_FIELDS}`}>
				Fields
			</Label>

			<button
				className="rounded-lg border border-white/25 bg-light-gray px-3 py-2 transition-colors hover:bg-light-gray/50 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={fields.length >= MAX_EMBED_FIELDS}
				onClick={handleAddNewField}
				type="button"
			>
				Add new field
			</button>

			<div className="flex flex-col gap-2">
				{fields.map((field, index, self) => (
					<Fragment
						// oxlint-disable-next-line react/no-array-index-key -- fields have no unique identifier
						key={`field-${index}`}
					>
						<div className="flex flex-col gap-4">
							<div className="flex gap-4">
								<div className="flex flex-1 flex-col gap-2">
									<div className="flex gap-2">
										<Label
											htmlFor={`embed-field-name-${index}`}
											small
											sub={`Max. ${EMBED_FIELD_NAME_MAX_LENGTH} chars`}
										>
											Field Name
										</Label>

										<button onClick={() => handleDeleteField(index)} type="button">
											<Close className="text-red" />
										</button>
									</div>

									<Input
										id={`embed-field-name-${index}`}
										maxLength={EMBED_FIELD_NAME_MAX_LENGTH}
										min={1}
										onChange={(event) => handleFieldChange(index, (field) => ({ ...field, name: event.target.value }))}
										placeholder="Enter field name"
										required
										value={field.name}
									/>
								</div>

								<div className="flex flex-col gap-4">
									<Label htmlFor={`embed-field-inline-${index}`} small>
										Inline
									</Label>

									<Toggle
										checked={field.inline}
										id={`embed-field-inline-${index}`}
										onChange={(event) =>
											handleFieldChange(index, (field) => ({ ...field, inline: event.target.checked }))
										}
									/>
								</div>
							</div>

							<div className="flex basis-1/2 flex-col gap-2">
								<Label htmlFor={`embed-field-value-${index}`} small sub={`Max. ${EMBED_FIELD_VALUE_MAX_LENGTH} chars`}>
									Field Value
								</Label>

								<Textarea
									emojis={emojis}
									id={`embed-field-value-${index}`}
									max={EMBED_FIELD_VALUE_MAX_LENGTH}
									min={1}
									placeholder="Enter field value"
									placeholders={placeholders}
									required
									roles={roles}
									setValue={(value) =>
										handleFieldChange(index, (field) => ({
											...field,
											value: typeof value === "function" ? value(field.value) : value,
										}))
									}
									value={field.value}
								/>
							</div>
						</div>

						{index === self.length - 1 ? null : <Separator />}
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
