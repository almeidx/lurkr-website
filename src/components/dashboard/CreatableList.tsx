"use client";

import { type KeyboardEventHandler, type PropsWithChildren, useState } from "react";
import type { CSSObjectWithLabel } from "react-select";
import CreatableSelect from "react-select/creatable";

const components = {
	DropdownIndicator: null,
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
					// TODO: Remove explicit types once react-select has been updated
					getOptionLabel={(option: string) => option}
					getOptionValue={(option: string) => option}
					onChange={(newValue: string[]) => {
						if (newValue.length > max) return;

						setValues(newValue);
					}}
					onInputChange={(newValue: string) => setInputValue(newValue)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					value={values}
					styles={{
						control: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#474747",
							border: "none",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
							boxShadow: "0px 0px 10px 0px #00000080 inset",
							maxWidth: "48rem",
							padding: "0.2rem",
						}),
						menu: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#2d2d2d",
							borderRadius: "0.375rem",
							color: "#e2e2e2",
						}),
						option: (baseStyles: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
							...baseStyles,
							backgroundColor: state.isFocused ? "#474747" : "#2d2d2d",
							color: "#e2e2e2",
						}),
						multiValue: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "transparent",
							border: "1px solid #e2e2e2bf",
							borderRadius: "20px",
							maxWidth: "50vw",
						}),
						multiValueLabel: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e2",
						}),
						input: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e2",
						}),
						multiValueRemove: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e2",
							borderTopRightRadius: "20px",
							borderBottomRightRadius: "20px",
							":hover": {
								backgroundColor: "#e2e2e2",
								color: "#2d2d2d",
							},
						}),
						placeholder: (baseStyles: CSSObjectWithLabel) => ({
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
	readonly max: number;
	readonly placeholder: string;
	/**
	 * Id for the input containing the channel ids (hidden)
	 */
	readonly settingId: string;
}
