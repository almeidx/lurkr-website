import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	public override render() {
		return (
			<Html className="scroll-smooth" lang="en">
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
						rel="stylesheet"
					/>

					<meta content="Lurkr" name="title" />
					<link href="/favicon.png" rel="shortcut icon" type="image/png" />

					<meta
						content="A Discord bot with focus on automation, leveling, emoji management, and image manipulation"
						property="description"
					/>
					<meta
						content="Lurkr, Lurkr Bot, Lurkr Invite, Lurkr Discord, Emoji Manager, Emoji Manager Discord, Lurker"
						name="keywords"
					/>
					<meta content="#ff7077" name="theme-color" />
					<meta content="website" property="og:type" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
