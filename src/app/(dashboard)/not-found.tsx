import "@/app/globals.css";

import { Text } from "@/components/dashboard/Text.tsx";

export default function NotFound() {
	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">404</h1>
			<Text>Whoops… Page not found.</Text>
		</div>
	);
}
