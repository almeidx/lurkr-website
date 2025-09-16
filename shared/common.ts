export function getNextConfigHeaders({
	extraImgSrc = [],
	extraConnectSrc = [],
}: {
	extraImgSrc?: string[];
	extraConnectSrc?: string[];
} = {}) {
	const isProduction = process.env.NODE_ENV === "production";

	const cspHeader = `
		default-src 'self';
		script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${isProduction ? "" : "'unsafe-eval'"} static.cloudflareinsights.com;
		style-src 'self' 'unsafe-inline';
		img-src 'self' ${extraImgSrc.join(" ")} blob: data:;
		font-src 'self';
		object-src 'none';
		base-uri 'self';
		form-action 'self';
		connect-src 'self' ${extraConnectSrc.join(" ")};
		frame-ancestors 'none';
		upgrade-insecure-requests;
	`;

	const ppHeader = `
		accelerometer=(),
		camera=(),
		geolocation=(),
		gyroscope=(),
		magnetometer=(),
		microphone=(),
		payment=(),
		usb=()
	`;

	return [
		{
			headers: [
				{
					key: "Content-Security-Policy",
					value: trimHeaderValue(cspHeader),
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "Referrer-Policy",
					value: "strict-origin-when-cross-origin",
				},
				{
					key: "Permissions-Policy",
					value: trimHeaderValue(ppHeader),
				},
			],
			source: "/(.*)",
		},
	];
}

function trimHeaderValue(value: string) {
	return value.replaceAll(/\t|^\s+|\s+$/g, "").replaceAll(/\n|\s{2,}/g, " ");
}
