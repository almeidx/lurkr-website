import { cookies } from "next/headers";
import { WRAPPED_2025_NOTICE_COOKIE } from "@/utils/constants.ts";
import { WrappedNotice } from "./wrapped-notice.tsx";

export async function WrappedNoticeContainer() {
	const cookieJar = await cookies();

	if (cookieJar.get(WRAPPED_2025_NOTICE_COOKIE)?.value === "true") {
		return null;
	}

	const date = new Date();
	const currentMonth = date.getMonth();

	if (currentMonth !== 11 && currentMonth !== 0) {
		return null;
	}

	return <WrappedNotice />;
}
