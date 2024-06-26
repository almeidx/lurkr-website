"use client";

import clsx from "clsx";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

export function Slider({ defaultValue, id, max, min, step, steps, mobileStepsToHide }: SliderProps) {
	const [value, setValue] = useState(defaultValue);
	const ref = useRef<HTMLInputElement>(null);

	const stepSpans = steps.map((step, idx) => (
		<span
			key={`${id}-${step}`}
			className={clsx(
				"h-2.5 w-px justify-center bg-white leading-10",
				// The back and forward with the hidden class is due to the aside menu appearing on the md: breakpoint
				mobileStepsToHide?.includes(idx) ? "hidden lg:flex xs:flex md:hidden" : "flex",
			)}
		>
			{step}
		</span>
	));

	useEffect(() => updateGradientBackground(value));

	function updateGradientBackground(value: number): void {
		if (ref.current) {
			const progress = (value / max) * 100;
			ref.current.style.background = `linear-gradient(to right, #00000000 ${progress}%, #474747 ${progress}%), linear-gradient(94deg, #ffe87c 0%, #ff7077 100%)`;
		}
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const val = Number(event.target.value);
		setValue(val);

		updateGradientBackground(val);
	}

	return (
		<div className="mb-3 flex max-w-lg items-center gap-4 px-2.5">
			<div className="flex-1">
				<input
					className="h-1.5 w-full cursor-pointer appearance-none rounded-2xl outline-none slider-thumb:size-4 slider-thumb:appearance-none slider-thumb:rounded-full slider-thumb:border-none slider-thumb:bg-primary"
					ref={ref}
					type="range"
					min={min}
					max={max}
					id={id}
					name={id}
					step={step}
					value={value}
					onChange={handleChange}
				/>

				<div className="flex justify-between px-2.5 py-0">{stepSpans}</div>
			</div>

			<input
				className="rounded-lg bg-light-gray text-center text-2xl text-white/75 shadow-dim-inner"
				value={value}
				type="number"
				min={min}
				max={max}
				step={step}
				onChange={handleChange}
			/>
		</div>
	);
}

interface SliderProps {
	readonly defaultValue: number;
	readonly id: string;
	readonly max: number;
	readonly min: number;
	readonly step: number;
	readonly steps: number[] | string[];
	readonly mobileStepsToHide?: number[];
}
