"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ChevronRight, Trophy, Zap } from "lucide-react";

export function FeatureExampleTabs({
	tab1,
	tab2,
}: {
	tab1?: any;
	tab2?: any;
}) {
	return (
		<Tabs.Root className="mt-14 grid grid-cols-12 gap-8" defaultValue="tab1" orientation="vertical">
			<Tabs.List
				className="col-span-full flex w-full flex-col gap-8 md:order-2 md:col-span-5"
				aria-label="Select feature"
			>
				<Tabs.Trigger
					className="group relative flex flex-1 flex-col items-start justify-start rounded-xl p-6 text-left shadow-lg ring-1 ring-gray-200 dark:ring-white/5 dark:data-[state=active]:shadow-indigo-900/30"
					value="tab1"
				>
					<div className="-left-[36px] absolute top-1/2 hidden group-data-[state=active]:flex">
						<ChevronRight width={20} height={20} className="stroke-gray-950 dark:stroke-gray-900" />
					</div>
					<div className="flex items-center gap-4">
						<div className="aspect-square w-fit rounded-lg bg-white p-2 text-gray-700 ring-1 ring-black/10 transition-all group-data-[state=active]:text-indigo-600 group-data-[state=active]:shadow-indigo-500/20 group-data-[state=active]:shadow-md dark:bg-gray-950 dark:text-gray-400 dark:ring-white/10 dark:group-data-[state=active]:text-indigo-400 dark:group-data-[state=active]:shadow-indigo-600/50">
							<Trophy aria-hidden="true" className="size-5" />
						</div>
						<p className="font-semibold text-gray-700 tracking-tight transition-all group-data-[state=active]:text-indigo-600 sm:text-lg dark:text-gray-400 dark:group-data-[state=active]:text-indigo-400">
							Level & Rank System
						</p>
					</div>
					<p className="mt-4 text-gray-600 leading-7 dark:text-gray-400">
						Watch your members progress through ranks as they chat. Customize XP rates, level-up messages, and role
						rewards to create an engaging experience.
					</p>
				</Tabs.Trigger>
				<Tabs.Trigger
					className="group relative flex flex-1 flex-col items-start justify-start rounded-xl p-6 text-left shadow-lg ring-1 ring-gray-200 dark:ring-white/5 dark:data-[state=active]:shadow-indigo-900/30"
					value="tab2"
				>
					<div className="-left-[36px] absolute top-1/2 hidden sm:group-data-[state=active]:flex">
						<ChevronRight width={20} height={20} className="stroke-gray-950 dark:stroke-gray-900" />
					</div>
					<div className="flex items-center gap-4">
						<div className="data-state aspect-square w-fit rounded-lg bg-white p-2 text-gray-700 ring-1 ring-black/10 transition-all group-data-[state=active]:text-indigo-600 group-data-[state=active]:shadow-indigo-500/20 group-data-[state=active]:shadow-md dark:bg-gray-950 dark:text-gray-400 dark:ring-white/10 dark:group-data-[state=active]:text-indigo-400 dark:group-data-[state=active]:shadow-indigo-600/50">
							<Zap aria-hidden="true" className="size-5" />
						</div>
						<p className="font-semibold text-gray-700 tracking-tight transition-all group-data-[state=active]:text-indigo-600 sm:text-lg dark:text-gray-400 dark:group-data-[state=active]:text-indigo-400">
							XP Multipliers
						</p>
					</div>
					<p className="mt-4 text-gray-600 leading-7 dark:text-gray-400">
						Boost activity with customizable XP multipliers. Create special events, boost specific channels, or reward
						active hours to keep your community engaged.
					</p>
				</Tabs.Trigger>
			</Tabs.List>
			<div className="col-span-full md:col-span-7">
				<Tabs.Content value="tab1">{tab1}</Tabs.Content>
				<Tabs.Content value="tab2">{tab2}</Tabs.Content>
			</div>
		</Tabs.Root>
	);
}
