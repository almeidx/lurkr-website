export function SvgGradients() {
	return (
		<>
			<svg aria-hidden className="absolute size-0" focusable="false">
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="icon-gradient-tertiary"
					x1="-4"
					x2="16.8492"
					y1="6"
					y2="-2.82183"
				>
					<stop stopColor="#d2ffae" />
					<stop offset="1" stopColor="#804994" />
				</linearGradient>
			</svg>

			<svg aria-hidden className="absolute size-0" focusable="false">
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="icon-gradient-primary"
					x1="5.00012"
					x2="6.69388"
					y1="30"
					y2="4.51736"
				>
					<stop stopColor="#ffe87c" />
					<stop offset="1" stopColor="#ff7077" />
				</linearGradient>
			</svg>

			<svg aria-hidden className="absolute size-0" focusable="false">
				<defs>
					<linearGradient id="percentual-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
						<stop offset="0%" stopColor="#ffe87c" />
						<stop offset="100%" stopColor="#ff7077" />
					</linearGradient>
				</defs>
			</svg>
		</>
	);
}
