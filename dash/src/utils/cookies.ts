export async function getCookie(cookieName: string): Promise<string | null> {
	const jar = await getCookieJar();
	return jar[cookieName] ?? null;
}

async function getCookieJar() {
	if (typeof window === "undefined") {
		// Server-side request
		const { cookies } = await import("next/headers");

		const store = await cookies();
		const jar = store.getAll();

		return Object.fromEntries(jar.map((cookie) => [cookie.name, cookie.value]));
	}

	// Client-side request
	const { default: Cookies } = await import("js-cookie");
	const jar = Cookies.get();

	return jar ?? {};
}
