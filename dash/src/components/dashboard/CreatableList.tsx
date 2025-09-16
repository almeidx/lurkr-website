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

			<label className="flex flex-col gap-2" htmlFor={inputId}>
				{children}

				<CreatableSelect
					components={components}
					getOptionLabel={(option: string) => option}
					getOptionValue={(option: string) => option}
					inputId={inputId}
					inputValue={inputValue}
					instanceId={`${inputId}-select`}
					isClearable
					// TODO: Remove explicit types once react-select has been updated
					isMulti
					menuIsOpen={false}
					onChange={(newValue: readonly string[]) => {
						if (newValue.length > max) return;

						setValues(newValue);
					}}
					onInputChange={(newValue: string) => setInputValue(newValue)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					styles={{
						control: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#474747",
							border: "none",
							borderRadius: "0.375rem",
							boxShadow: "0px 0px 10px 0px #00000080 inset",
							color: "#e2e2e2",
							maxWidth: "48rem",
							padding: "0.2rem",
						}),
						input: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e2",
						}),
						menu: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							backgroundColor: "#2d2d2d",
							borderRadius: "0.375rem",
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
						multiValueRemove: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							":hover": {
								backgroundColor: "#e2e2e2",
								color: "#2d2d2d",
							},
							borderBottomRightRadius: "20px",
							borderTopRightRadius: "20px",
							color: "#e2e2e2",
						}),
						option: (baseStyles: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
							...baseStyles,
							backgroundColor: state.isFocused ? "#474747" : "#2d2d2d",
							color: "#e2e2e2",
						}),
						placeholder: (baseStyles: CSSObjectWithLabel) => ({
							...baseStyles,
							color: "#e2e2e280",
						}),
					}}
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
