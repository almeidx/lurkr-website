import type { CSSObjectWithLabel, StylesConfig } from "react-select";

export function selectControlStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		backgroundColor: "#474747",
		border: "none",
		borderRadius: "0.375rem",
		boxShadow: "0px 0px 10px 0px #00000080 inset",
		color: "#e2e2e2",
		maxWidth: "48rem",
		minWidth: "16rem",
		padding: "0.2rem",
	};
}

export function selectInputStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		color: "#e2e2e2",
	};
}

export function selectMenuStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		backgroundColor: "#2d2d2d",
		borderRadius: "0.375rem",
		color: "#e2e2e2",
		maxWidth: "48rem",
		minWidth: "16rem",
	};
}

export function selectMultiValueStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		backgroundColor: "transparent",
		border: "1px solid #e2e2e2bf",
		borderRadius: "20px",
		maxWidth: "50vw",
	};
}

export function selectMultiValueRemoveStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		":hover": {
			backgroundColor: "#e2e2e2",
			color: "#2d2d2d",
		},
		borderBottomRightRadius: "20px",
		borderTopRightRadius: "20px",
		color: "#e2e2e2",
	};
}

export function selectOptionStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		":hover": {
			backgroundColor: "#474747",
		},
		backgroundColor: "#2d2d2d",
		color: "#e2e2e2",
	};
}

export function selectPlaceholderStyles(baseStyles: CSSObjectWithLabel) {
	return {
		...baseStyles,
		color: "#e2e2e280",
	};
}

export const baseSelectStyles: StylesConfig<any, true> = {
	control: selectControlStyles,
	input: selectInputStyles,
	menu: selectMenuStyles,
	multiValue: selectMultiValueStyles,
	multiValueRemove: selectMultiValueRemoveStyles,
	option: selectOptionStyles,
	placeholder: selectPlaceholderStyles,
};
