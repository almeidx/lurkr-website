export default function ErrorPage({ code, message }: ErrorPageProps) {
	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-center justify-center text-center text-black">
			<div>
				<span className="my-0 ml-0 mr-5 inline-block border-r border-solid border-white py-2 pl-0 pr-6 align-top text-2xl font-bold text-white">
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
}
