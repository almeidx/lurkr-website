import { cookies } from "next/headers";
import { COOKIE_NOTICE_ACK, COOKIE_NOTICE_COOKIE } from "../utils/constants.ts";
import { CookieNotice } from "./CookieNotice.tsx";

export async function CookieNoticeHandler() {
	const jar = await cookies();
	const cookie = jar.get(COOKIE_NOTICE_COOKIE);

	return <CookieNotice defaultHasConsented={cookie?.value === COOKIE_NOTICE_ACK} />;
}
