"use server";

export async function importBotData(_guildId: string, data: FormData) {
	const entries = Array.from(data.entries());

	const options = Object.fromEntries(entries) as IncomingData;

	const resolvedOptions = {
		bot: options.bot,
		importUntil: Number(options.importUntil),
		includeRoleRewards: options.includeRoleRewards === "on",
	};

	console.log(options, resolvedOptions);
}

// Using an interface here would make tsc complain about the missing fields from the wide type of FormData
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type IncomingData = {
	bot: "Amari" | "Atlas" | "MEE6";
	importUntil: string;
	includeRoleRewards?: "on";
};
