import HeroImage from "@/components/clap/hero-image.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CirclePlay } from "lucide-react";
import Link from "next/link";

const youtubeVideoId = "Iv2ULENM90Y";

export function Hero() {
	return (
		<section
			aria-labelledby="hero-title"
			className="mt-32 flex flex-col items-center justify-center text-center sm:mt-40"
		>
			<h1
				id="hero-title"
				className="inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-7xl dark:from-gray-50 dark:to-gray-300"
				style={{ animationDuration: "700ms" }}
			>
				Level up your server <br /> finally, for free
			</h1>

			<p
				className="mt-6 max-w-xl animate-slide-up-fade text-gray-700 text-lg dark:text-gray-400"
				style={{ animationDuration: "900ms" }}
			>
				Lurkr is the ultimate no-paywall & featureful leveling Discord bot. <br />
				Transfer your existing leveling data to Lurkr to get started!
			</p>

			<div
				className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
				style={{ animationDuration: "1100ms" }}
			>
				<Button className="h-10 font-semibold">
					<Link href="#">Start leveling</Link>
				</Button>

				<Button
					asChild
					variant="light"
					className="group gap-x-2 bg-transparent font-semibold hover:bg-transparent dark:bg-transparent hover:dark:bg-transparent"
				>
					<Link
						href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
						className="ring-1 ring-gray-200 sm:ring-0 dark:ring-gray-900"
						target="_blank"
					>
						<span className="mr-1 flex size-6 items-center justify-center rounded-full bg-gray-50 transition-all group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
							<CirclePlay aria-hidden="true" className="size-5 shrink-0 text-gray-900 dark:text-gray-50" />
						</span>
						Watch video
					</Link>
				</Button>
			</div>

			<div
				className="relative mx-auto mt-20 ml-3 h-fit max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
				style={{ animationDuration: "1400ms" }}
			>
				<HeroImage />

				<div
					className="-bottom-20 -mx-10 absolute inset-x-0 h-2/4 bg-gradient-to-t from-white via-white to-transparent lg:h-1/4 dark:from-gray-950 dark:via-gray-950"
					aria-hidden="true"
				/>
			</div>
		</section>
	);
}
