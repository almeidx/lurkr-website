"use client";

// Modified version of https://ariakit.org/examples/combobox-textarea

import type { Emoji, Role } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { emojiImage } from "@/utils/discord-cdn.ts";
import { Combobox, ComboboxItem, ComboboxPopover, useComboboxStore } from "@ariakit/react/combobox";
import clsx from "clsx";
import { matchSorter } from "match-sorter";
import Image from "next/image";
import {
	type ChangeEvent,
	type KeyboardEvent,
	useDeferredValue,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import getCaretCoordinates from "textarea-caret";

const triggers = ["@", ":", "{"];

export function Textarea({
	id,
	emojis,
	max,
	min,
	placeholder,
	placeholders,
	roles,
	value,
	setValue,
	emulateInput,
	required,
}: TextareaWithAutocompleteProps) {
	const ref = useRef<HTMLTextAreaElement>(null);
	const [trigger, setTrigger] = useState<string | null>(null);
	const [caretOffset, setCaretOffset] = useState<number | null>(null);

	const combobox = useComboboxStore();

	const searchValue = combobox.useState("value");
	const mounted = combobox.useState("mounted");
	const deferredSearchValue = useDeferredValue(searchValue);

	const matches = matchSorter(getList(trigger, emojis, roles, placeholders), deferredSearchValue, {
		baseSort: (a, b) => (a.index < b.index ? -1 : 1),
		keys: ["name"],
	}).slice(0, 10);

	const hasMatches = Boolean(matches.length);

	useLayoutEffect(() => {
		combobox.setOpen(hasMatches);
	}, [combobox, hasMatches]);

	useLayoutEffect(() => {
		if (caretOffset !== null) {
			ref.current?.setSelectionRange(caretOffset, caretOffset);
		}
	}, [caretOffset]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intended
	useEffect(combobox.render, [combobox, value]);

	function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			combobox.hide();
		}
	}

	function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const trigger = getTrigger(event.target);
		const searchValue = getSearchValue(event.target);

		if (trigger) {
			setTrigger(trigger);
			combobox.show();
		} else if (!searchValue) {
			setTrigger(null);
			combobox.hide();
		}

		setValue(event.target.value);
		combobox.setValue(searchValue);
	}

	function onItemClick(value: Emoji | PlaceholderValue | Role | undefined) {
		return () => {
			const textarea = ref.current;
			if (!textarea || !value) return;

			const offset = getTriggerOffset(textarea);

			const displayValue = getValue(value, trigger);
			if (!displayValue) return;

			setTrigger(null);
			setValue(replaceValue(offset, searchValue, displayValue));

			const nextCaretOffset = offset + displayValue.length + 1;
			setCaretOffset(nextCaretOffset);
		};
	}

	return (
		<>
			<Combobox
				store={combobox}
				autoSelect
				value={value}
				showOnChange={false}
				showOnKeyPress={false}
				showOnClick={false}
				setValueOnChange={false}
				render={
					<textarea
						id={id}
						name={id}
						maxLength={max}
						minLength={min}
						ref={ref}
						rows={emulateInput ? 1 : 4}
						className={clsx(
							"w-full max-w-3xl rounded-lg bg-light-gray px-3 py-2 leading-relaxed shadow-dim-inner",
							emulateInput ? "h-10 resize-none overflow-y-hidden" : "max-h-64 min-h-10 resize-y",
						)}
						placeholder={placeholder}
						required={required}
						onScroll={combobox.render}
						onPointerDown={combobox.hide}
						onChange={onChange}
						onKeyDown={onKeyDown}
					/>
				}
			/>
			{mounted && (
				<ComboboxPopover
					store={combobox}
					hidden={!hasMatches}
					fitViewport
					getAnchorRect={() => (ref.current ? getAnchorRect(ref.current) : null)}
					className="z-[10000] rounded-lg border border-white/30 bg-darker px-2 py-1"
				>
					{matches.map((value) => (
						<ComboboxItem
							key={value.id}
							value={value.name}
							focusOnHover
							onClick={onItemClick(value)}
							className="flex items-center gap-2 data-[active-item]:bg-black"
							data-id={value.id}
						>
							{trigger === ":" ? (
								<Image
									src={emojiImage(value.id, (value as Emoji).animated)}
									alt={`${value.name} emoji image`}
									width={16}
									height={16}
									className="size-4"
									unoptimized
								/>
							) : trigger === "@" ? (
								<div
									className="size-4 rounded-full"
									style={{
										backgroundColor: decimalRoleColorToHex((value as Role).color),
									}}
								/>
							) : null}
							<span>{value.name}</span>
						</ComboboxItem>
					))}
				</ComboboxPopover>
			)}
		</>
	);
}

interface TextareaWithAutocompleteProps {
	readonly emojis: Emoji[];
	readonly id: string;
	readonly max: number;
	readonly min: number;
	readonly placeholder: string;
	readonly placeholders: PlaceholderValue[];
	readonly roles: Role[];
	setValue(value: string | ((prevValue: string) => string)): void;
	readonly value: string;
	readonly emulateInput?: boolean;
	readonly required?: boolean;
}

function getTriggerOffset(element: HTMLTextAreaElement) {
	const { value, selectionStart } = element;
	for (let idx = selectionStart; idx >= 0; idx--) {
		const char = value[idx];
		if (char && triggers.includes(char)) {
			return idx;
		}
	}

	return -1;
}

function getTrigger(element: HTMLTextAreaElement) {
	const { value, selectionStart } = element;

	const previousChar = value[selectionStart - 1];
	if (!previousChar) return null;

	return triggers.includes(previousChar) ? previousChar : null;
}

function getSearchValue(element: HTMLTextAreaElement) {
	const offset = getTriggerOffset(element);
	if (offset === -1) return "";

	return element.value.slice(offset + 1, element.selectionStart);
}

function getAnchorRect(element: HTMLTextAreaElement) {
	const offset = getTriggerOffset(element);

	const { left, top, height } = getCaretCoordinates(element, offset + 1);
	const { x, y } = element.getBoundingClientRect();

	return {
		x: left + x - element.scrollLeft,
		y: top + y - element.scrollTop,
		height,
	};
}

function replaceValue(offset: number, searchValue: string, displayValue: string) {
	return (prevValue: string) => {
		return `${prevValue.slice(0, offset)}${displayValue} ${prevValue.slice(offset + searchValue.length + 1)}`;
	};
}

function getList(
	trigger: string | null,
	emojis: Emoji[],
	roles: Role[],
	placeholders: PlaceholderValue[],
): Emoji[] | PlaceholderValue[] | Role[] {
	switch (trigger) {
		case "@":
			return roles;
		case ":":
			return emojis;
		case "{":
			return placeholders;
		default:
			return [];
	}
}

function getValue(value: Emoji | PlaceholderValue | Role, trigger: string | null) {
	switch (trigger) {
		case "@":
			return `<@&${(value as Role).id}>`;

		case ":": {
			const { animated, id, name } = value as Emoji;
			return `<${animated ? "a" : ""}:${name}:${id}>`;
		}

		case "{":
			return (value as PlaceholderValue).id;

		default:
			return undefined;
	}
}

export interface PlaceholderValue {
	id: string;
	name: string;
}
