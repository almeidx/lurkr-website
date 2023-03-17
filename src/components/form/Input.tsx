import { useState, type Ref } from "react";
import type { IconType } from "react-icons";
import { IoMdSend } from "react-icons/io";
import { MdClear } from "react-icons/md";

export default function Input(props: InputProps | InputWithSubmitProps): JSX.Element {
	const [value, setValue] = useState<string>(props.initialValue);
	const Icon = "submitIcon" in props ? props.submitIcon! : IoMdSend;

	return (
		<div className={`flex w-full ${props.className ?? ""}`}>
			<div className="relative w-full grow">
				<input
					className={`bg-discord-not-quite-black text-white ${
						props.prefix ? "pl-[30px]" : "pl-5"
					} w-full rounded-md py-3 pr-5 shadow placeholder:text-opacity-75 focus:outline-none disabled:select-none disabled:text-opacity-25`}
					disabled={props.disabled}
					id={props.id}
					maxLength={props.maxLength}
					onChange={({ target }) => {
						if (props.disabled) {
							return;
						}

						if (target.value.length > props.maxLength) {
							return;
						}

						setValue(target.value);
						props.onChange(target.value);
					}}
					placeholder={props.placeholder}
					value={value}
				/>

				{props.prefix && (
					<label className={`absolute left-0 py-3 pl-[20px] text-white${value.length > 0 ? "" : "text-opacity-50"}`}>
						{props.prefix}
					</label>
				)}
				{value && !props.noClearButton && (
					<label
						className="absolute right-0 my-auto mx-4 h-full cursor-pointer py-3 text-2xl text-discord-red transition-colors active:text-red-600"
						onClick={() => {
							setValue("");
							props.onChange("");
						}}
					>
						<MdClear />
					</label>
				)}
			</div>

			{"onSubmit" in props && (
				<button
					className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-discord-not-quite-black text-white transition-colors duration-150 hover:text-opacity-75 disabled:select-none"
					disabled={props.disabled}
					onClick={(event) => {
						event.preventDefault();

						if (props.clearOnSubmit) {
							setValue("");
						}

						props.onSubmit();
					}}
					ref={props.submitRef}
					type="button"
				>
					<Icon className="fill-current text-3xl" />
				</button>
			)}
		</div>
	);
}

interface InputProps {
	className?: string;
	clearOnSubmit?: boolean;
	disabled?: boolean;
	id: string;
	initialValue: string;
	maxLength: number;
	noClearButton?: boolean;
	onChange(text: string): unknown;
	placeholder: string;
	prefix?: string;
}

type InputWithSubmitProps = InputProps & {
	onSubmit(): unknown;
	submitIcon?: IconType;
	submitRef: Ref<HTMLButtonElement>;
};
