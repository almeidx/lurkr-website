export default function NotFound() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4">
			<h1 className="font-bold text-9xl tracking-widest">404</h1>
			<span className="text-lg text-white/75 tracking-tight md:text-xl">Whoops… Page not found.</span>
			<span className="text-sm text-white/50">Try one of the items from the sidebar</span>
		</div>
	);
}
