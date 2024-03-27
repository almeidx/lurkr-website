export const enum Time {
	Seconds = 1_000,
	Minutes = Seconds * 60,
	Hours = Minutes * 60,
	Days = Hours * 24,
	Weeks = Days * 7,
	Years = Days * 365.241_25,
	Months = Years / 12,
}
