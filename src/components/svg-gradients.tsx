export function SvgGradients() {
	return (
		<>
			<svg className="absolute size-0" aria-hidden="true" focusable="false">
				<linearGradient
					id="icon-gradient-tertiary"
					x1="-4"
					y1="6"
					x2="16.8492"
					y2="-2.82183"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#d2ffae" />
					<stop offset="1" stopColor="#804994" />
				</linearGradient>
			</svg>

			<svg className="absolute size-0" aria-hidden="true" focusable="false">
				<linearGradient
					id="icon-gradient-primary"
					x1="5.00012"
					y1="30"
					x2="6.69388"
					y2="4.51736"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#ffe87c" />
					<stop offset="1" stopColor="#ff7077" />
				</linearGradient>
			</svg>

			<svg className="absolute size-0" aria-hidden="true" focusable="false">
				<defs>
					<linearGradient id="percentual-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#ffe87c" />
						<stop offset="100%" stopColor="#ff7077" />
					</linearGradient>
				</defs>
			</svg>
		</>
	);
}
