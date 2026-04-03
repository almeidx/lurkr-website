"use client";

import { type KeyboardEventHandler, type PropsWithChildren, useState } from "react";
import type { StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import { baseSelectStyles, selectControlStyles, selectMenuStyles } from "./select-styles.ts";

const creatableComponents = {
	DropdownIndicator: null,
};

const creatableSelectStyles: StylesConfig<string, true> = {
	...baseSelectStyles,
	control: (baseStyles) => ({
		...selectControlStyles(baseStyles),
		minWidth: undefined,
	}),
	menu: (baseStyles) => ({
		...selectMenuStyles(baseStyles),
		maxWidth: undefined,
		minWidth: undefined,
	}),
	multiValueLabel: (baseStyles) => ({
		...baseStyles,
		color: "#e2e2e2",
	}),
};

export function CreatableList({ children, defaultValues, inputId, max, placeholder, settingId }: CreatableListProps) {
	const [inputValue, setInputValue] = useState("");
	const [values, setValues] = useState<readonly string[]>(defaultValues);

	const handleKeyDown: KeyboardEventHandler = (event) => {
		if (!inputValue) return;

		switch (event.key) {
			case "Enter":
			case "Tab": {
				setValues((prev) => Array.from(new Set([...prev, inputValue])));
				setInputValue("");
				event.preventDefault();
			}
		}
	};

	return (
		<>
			<input className="hidden size-0" name={settingId} readOnly type="hidden" value={JSON.stringify(values)} />

			<label className="flex flex-col gap-2" htmlFor={inputId}>
				{children}

				<CreatableSelect
					components={creatableComponents}
					getOptionLabel={(option) => option}
					getOptionValue={(option) => option}
					inputId={inputId}
					inputValue={inputValue}
					instanceId={`${inputId}-select`}
					isClearable
					isMulti
					menuIsOpen={false}
					onChange={(newValue) => {
						if (newValue.length > max) return;

						setValues(newValue);
					}}
					onInputChange={(newValue) => setInputValue(newValue)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					styles={creatableSelectStyles}
					value={values}
				/>
			</label>
		</>
	);
}

interface CreatableListProps extends PropsWithChildren {
	readonly defaultValues: readonly string[];
	/**
	 * Id for the input where the user can type
	 */
	readonly inputId: string;
	readonly max: number;
	readonly placeholder: string;
	/**
	 * Id for the input containing the channel ids (hidden)
	 */
	readonly settingId: string;
}
