import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	public override render() {
		return (
			<Html lang="en">
				<Head>
					<meta content="Lurkr" name="title" />
					<link href="/favicon.png" rel="shortcut icon" type="image/png" />

					<meta
						content="The Ultimate No-Paywall & Featureful Leveling Bot. Powerful Utility and Automation for your Best Discord Server!"
						name="description"
					/>
					<meta
						content="Lurkr, Lurkr Bot, Lurkr Invite, Lurkr Discord, Emoji Manager, Emoji Manager Discord, Lurker"
						name="keywords"
					/>
					<meta content="#ff7077" name="theme-color" />
					<meta content="website" property="og:type" />
				</Head>

				<body className="scrollbar-thin scrollbar-track-discord-dark scrollbar-thumb-discord-lighter scrollbar-thumb-rounded-xl scroll-smooth">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
