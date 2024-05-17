"use client";

import { type KeyboardEventHandler, type PropsWithChildren, useState } from "react";
import CreatableSelect from "react-select/creatable";

const components = {
	DropdownIndicator: null,
};

// TODO: Add max prop

export function CreatableList({ children, defaultValues, inputId, placeholder, settingId }: CreatableListProps) {
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

			<label htmlFor={inputId} className="flex flex-col gap-2">
				{children}

				<CreatableSelect
					components={components}
					inputValue={inputValue}
					isClearable
					instanceId={`${inputId}-select`}
					inputId={inputId}
					isMulti
					menuIsOpen={false}
					getOptionLabel={(option) => option}
					getOptionValue={(option) => option}
					onChange={(newValue) => setValues(newValue)}
					onInputChange={(newValue) => setInputValue(newValue)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					value={values}
					styles={{
						control: (baseStyles) => ({
							...baseStyles,
							backgroundColor: "#474747",
							border: "none",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
							boxShadow: "0px 0px 10px 0px #00000080 inset",
							maxWidth: "48rem",
							padding: "0.2rem",
						}),
						menu: (baseStyles) => ({
							...baseStyles,
							backgroundColor: "#2d2d2d",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
						}),
						option: (baseStyles, state) => ({
							...baseStyles,
							backgroundColor: state.isFocused ? "#474747" : "#2d2d2d",
							color: "#e2e2e2",
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

interface CreatableListProps extends PropsWithChildren {
	readonly defaultValues: readonly string[];
	/**
	 * Id for the input where the user can type
	 */
	readonly inputId: string;
	readonly placeholder: string;
	/**
	 * Id for the input containing the channel ids (hidden)
	 */
	readonly settingId: string;
}
