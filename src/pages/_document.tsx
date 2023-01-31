import Document, { Head, Html, Main, NextScript } from "next/document";
import { appleIcons, keywords } from "~/utils/constants";

export default class MyDocument extends Document {
	public override render() {
		return (
			<Html className="scroll-smooth" lang="en">
				<Head>
					<link href="/manifest.json" rel="manifest" />
					<link href="/favicon.png" rel="shortcut icon" type="image/png" />
					<meta content="#00a81a" name="theme-color" />

					<meta content={keywords.join(", ")} name="keywords" />

					<meta content="Pepe Manager" name="title" />
					<meta content="Pepe Manager" property="og:title" />
					<meta
						content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
						name="description"
					/>
					<meta
						content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
						property="og:description"
					/>
					<meta content="website" property="og:type" />

					<link href="/apple-icon-180.png" rel="apple-touch-icon" />
					<meta content="yes" name="apple-mobile-web-app-capable" />

					<link
						href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
						rel="stylesheet"
					/>

					{appleIcons.map(({ href, media }, idx) => (
						<link href={href} key={idx} media={media} rel="apple-touch-icon" />
					))}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
