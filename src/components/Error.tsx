import Head from "next/head";

export default function ErrorPage({ code, message, title }: ErrorPageProps) {
	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center bg-discord-dark text-center text-black">
			<Head>
				<title>{`${title} | Lurkr`}</title>
			</Head>

			<div>
				<span className="my-0 mr-5 ml-0 inline-block border-r border-solid border-white py-2 pr-6 pl-0 align-top text-2xl font-bold text-white">
					{code}
				</span>

				<div className="inline-block h-12 text-left align-middle leading-[49px]">
					<p className="m-0 p-0 text-sm font-normal leading-[inherit] text-white">{message}</p>
				</div>
			</div>
		</div>
	);
}

interface ErrorPageProps {
	code: number;
	message: string;
	title: string;
}
