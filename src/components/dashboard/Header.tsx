import Link from "next/link";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import type { Snowflake } from "../../utils/constants";
import Toggle from "../form/Toggle";

interface HeaderProps {
	description: string;
	guildId: Snowflake;
	openMenu(): void;
	title: string;
}

type HeaderWithToggleProps = HeaderProps & {
	id: string;
	initialValue: boolean;
	onChange(value: boolean): unknown;
	openMenu(): void;
};

export default function Header(props: HeaderProps | HeaderWithToggleProps) {
	const [enabled, setEnabled] = useState<boolean>("initialValue" in props && props.initialValue);

	return (
		<>
			<BiArrowBack
				// eslint-disable-next-line @typescript-eslint/unbound-method
				onClick={props.openMenu}
				className="z-[99999] mb-4 ml-4 inline-block h-6 w-6 cursor-pointer text-white sm:hidden"
			/>

			<div className="mx-4 flex justify-between">
				<div className="flex flex-row flex-wrap items-center gap-3 md:gap-6">
					<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">{props.title}</h1>

					{"id" in props && props.id === "levels" && (
						<Link href={`/levels/${props.guildId}`}>
							<a className="flex h-fit items-center justify-center rounded-lg bg-discord-green py-1 px-3 text-center text-white">
								Go to Leaderboard
							</a>
						</Link>
					)}
				</div>

				{"initialValue" in props && (
					<>
						<div className="flex flex-row items-center gap-x-3">
							<label className="text-white" htmlFor={props.id}>
								{enabled ? "Enabled" : "Disabled"}
							</label>

							<Toggle
								id={props.id}
								initialValue={props.initialValue}
								size="small"
								onChange={(state) => {
									setEnabled(state);
									props.onChange(state);
								}}
							/>
						</div>
					</>
				)}
			</div>

			<p className="my-3 mx-4 font-light text-gray-400">{props.description}</p>
		</>
	);
}
