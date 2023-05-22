import ms from "@almeidx/ms";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
import Input from "@/form/Input";
import Message from "~/components/Message";
import Tooltip from "~/components/Tooltip";
import { parseMultiplier } from "~/utils/common";
import { getRequiredXp } from "~/utils/constants";

const averageXpPerMessage = (15 + 40) / 2;
const timePerMessage = ms("1m20s");

export default function Calculator() {
	const [level, setLevel] = useState("");
	const [currentLevel, setCurrentLevel] = useState("");
	const [multiplier, setMultiplier] = useState("");

	const multiplierValue = useMemo(() => parseMultiplier(multiplier), [multiplier]);
	const requiredXp = useMemo(
		() => getRequiredXp(Number.parseInt(level, 10)) - getRequiredXp(Number.parseInt(currentLevel, 10) || 0),
		[level, currentLevel],
	);

	const calculateAmountOfMessages = useCallback(
		() => Math.ceil(requiredXp / (averageXpPerMessage * (multiplierValue ?? 1))),
		[requiredXp, multiplierValue],
	);

	const calculateTime = useCallback(
		() => Math.ceil(calculateAmountOfMessages() * timePerMessage),
		[calculateAmountOfMessages],
	);

	return (
		<div className="flex min-h-screen-no-nav flex-col items-center bg-discord-dark">
			<Head>
				<title>Level Calculator | Lurkr</title>
			</Head>

			<header className="mx-3 my-4 flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-6">
				<h1 className="text-2xl font-bold text-white sm:text-4xl">Level Calculator</h1>
				<p className="font-light text-gray-400">Calculate how much you need to message to reach a certain level!</p>
			</header>

			<main className="flex max-w-sm flex-col gap-4 sm:max-w-2xl">
				<div className="flex flex-col gap-4 sm:flex-row">
					<Input
						id="level"
						initialValue=""
						maxLength={3}
						onChange={(text) => setLevel(text)}
						placeholder="Enter the desired level"
					/>

					<Input
						id="initialLevel"
						initialValue=""
						maxLength={3}
						onChange={(text) => setCurrentLevel(text)}
						placeholder="Enter the current level"
					/>

					<Input
						id="multiplier"
						initialValue=""
						maxLength={5}
						onChange={(text) => setMultiplier(text)}
						placeholder="Enter an XP multiplier"
					/>
				</div>

				{requiredXp <= 0 ? (
					<Message message="The current level you inputted is bigger than or equal to the level you want to achieve." />
				) : multiplier !== "" && !multiplierValue ? (
					<Message message="The multiplier value you inputted is invalid." />
				) : null}

				{level && requiredXp > 0 && (!multiplier || multiplierValue) ? (
					<div className="grid grid-rows-3 gap-3 sm:grid-cols-3 sm:grid-rows-none">
						<div className="flex flex-col gap-2 rounded-md bg-discord-not-quite-black px-4 py-3">
							<div className="flex flex-row items-center justify-between gap-2">
								<span className="text-gray-200">Approximate Messages</span>
								<Tooltip text="The amount of messages you need to write into a valid leveling enabled channel assuming all of your messages will be counted as XP gain, and assuming your XP gain is a perfect average between the lowest gain possible and the highest gain possible" />
							</div>
							<p className="text-center text-4xl font-bold text-gray-200">
								{calculateAmountOfMessages().toLocaleString("en")}
							</p>
						</div>

						<div className="flex flex-col gap-2 rounded-md bg-discord-not-quite-black px-4 py-3">
							<div className="flex flex-row items-center justify-between gap-2">
								<span className="text-gray-200">Estimated Time</span>
								<Tooltip text="The time it would take of constant chatting to reach this level, assuming you send a message every 1 minute and 20 seconds, and assuming all messages are counted as XP gain." />
							</div>
							<p className="text-center text-4xl font-bold text-gray-200">{ms(calculateTime())}</p>
						</div>

						<div className="flex flex-col gap-2 rounded-md bg-discord-not-quite-black px-4 py-3">
							<div className="flex flex-row items-center justify-between gap-2">
								<span className="text-gray-200">XP Required</span>
								<Tooltip text="The total amount of XP needed to get to this level. The XP to Level conversion is a fixed constant." />
							</div>
							<p className="text-center text-4xl font-bold text-gray-200">
								{Math.ceil(requiredXp).toLocaleString("en")}
							</p>
						</div>
					</div>
				) : null}
			</main>
		</div>
	);
}
