"use client";

import clsx from "clsx";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

export function Slider({ defaultValue, id, max, min, step, steps, mobileStepsToHide }: SliderProps) {
	const [value, setValue] = useState(defaultValue);
	const ref = useRef<HTMLInputElement>(null);

	const stepSpans = steps.map((step, idx) => (
		<span
			className={clsx(
				"h-2.5 w-px justify-center bg-white leading-10",
				// The back and forward with the hidden class is due to the aside menu appearing on the md: breakpoint
				mobileStepsToHide?.includes(idx) ? "xs:flex hidden md:hidden lg:flex" : "flex",
			)}
			key={`${id}-${step}`}
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
					className="slider-thumb:size-4 h-1.5 w-full cursor-pointer appearance-none slider-thumb:appearance-none rounded-2xl slider-thumb:rounded-full slider-thumb:border-none slider-thumb:bg-primary outline-none"
					id={id}
					max={max}
					min={min}
					name={id}
					onChange={handleChange}
					ref={ref}
					step={step}
					type="range"
					value={value}
				/>

				<div className="flex justify-between px-2.5 py-0">{stepSpans}</div>
			</div>

			<input
				className="rounded-lg bg-light-gray text-center text-2xl text-white/75 shadow-dim-inner"
				max={max}
				min={min}
				onChange={handleChange}
				step={step}
				type="number"
				value={value}
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
