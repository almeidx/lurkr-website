"use client";

import { Rocket } from "@gravity-ui/icons";
import { Alert, Avatar, CloseButton } from "@heroui/react";
import Cookies from "js-cookie";
import { useState } from "react";
import { WRAPPED_2025_NOTICE_COOKIE } from "@/utils/constants.ts";

export function WrappedNotice() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) {
		return null;
	}

	function dismiss() {
		Cookies.set(WRAPPED_2025_NOTICE_COOKIE, "true", { expires: 90 });
		setIsVisible(false);
	}

	return (
		<div className="mx-4 mt-6 max-w-3xl md:mx-0">
			<div className="rounded-2xl bg-linear-to-r from-[#ff7077] to-[#ffe87c] p-px">
				<Alert className="rounded-[15px]">
					<Alert.Indicator>
						<Avatar>
							<Rocket className="size-6" />
						</Avatar>
					</Alert.Indicator>
					<Alert.Content>
						<Alert.Title className="bg-linear-to-r from-[#ff7077] to-[#ffe87c] bg-clip-text font-bold text-lg text-transparent">
							Lurkr Wrapped 2025 is here!
						</Alert.Title>
						<Alert.Description className="text-white/90">
							Run <code className="rounded-md bg-white/10 px-2 py-0.5 font-medium font-mono">/wrapped</code> in your
							server to check out your year in review!
						</Alert.Description>
					</Alert.Content>
					<CloseButton onPress={dismiss} />
				</Alert>
			</div>
		</div>
	);
}
