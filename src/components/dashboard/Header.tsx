import { useState, type ReactNode } from "react";
import { BiArrowBack } from "react-icons/bi";
import Toggle from "@/form/Toggle";

export default function Header(props: HeaderProps | HeaderWithToggleProps) {
	const [enabled, setEnabled] = useState<boolean>("initialValue" in props && props.initialValue);

	return (
		<>
			<BiArrowBack
				className="z-50 mb-4 ml-4 inline-block h-6 w-6 cursor-pointer text-white sm:hidden"
				// eslint-disable-next-line react/jsx-handler-names
				onClick={props.openMenu}
			/>

			<div className="mx-4 flex justify-between">
				<div className="flex flex-row flex-wrap items-center gap-3 md:gap-6">
					<h1 className="text-2xl font-bold text-white sm:text-4xl">{props.title}</h1>

					{"extras" in props && props.extras}
				</div>

				{"initialValue" in props && (
					<div className="flex flex-row items-center gap-x-3">
						<label className="text-white" htmlFor={props.id}>
							{enabled ? "Enabled" : "Disabled"}
						</label>

						<Toggle
							id={props.id}
							initialValue={props.initialValue}
							onChange={(state) => {
								setEnabled(state);
								props.onChange(state);
							}}
							size="small"
						/>
					</div>
				)}
			</div>

			<p className="my-3 mx-4 font-light text-gray-400">{props.description}</p>
		</>
	);
}

interface HeaderProps {
	description: string;
	extras?: ReactNode;
	openMenu(): void;
	title: string;
}

interface HeaderWithToggleProps extends HeaderProps {
	id: string;
	initialValue: boolean;
	onChange(value: boolean): unknown;
	openMenu(): void;
}
