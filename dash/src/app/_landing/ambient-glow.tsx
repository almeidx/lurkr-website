export function AmbientGlow() {
	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 z-0"
			style={{
				background:
					"radial-gradient(ellipse 800px 400px at 10% -10%, rgba(255,112,119,0.08), transparent 60%)," +
					"radial-gradient(ellipse 700px 500px at 90% 0%, rgba(255,232,124,0.06), transparent 60%)",
			}}
		/>
	);
}
