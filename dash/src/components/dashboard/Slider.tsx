"use client";

import clsx from "clsx";
import { type ChangeEvent, type FocusEvent, type KeyboardEvent, useRef } from "react";

const GRADIENT_TRACK = ", linear-gradient(94deg, #ffe87c 0%, #ff7077 100%)";

export function Slider({ defaultValue, id, max, min, mobileStepsToHide, step, steps, text }: SliderProps) {
	const sliderRef = useRef<HTMLInputElement>(null);
	const secondaryRef = useRef<HTMLInputElement>(null);

	const initialValue = Math.min(Math.max(defaultValue, min), max);
	const initialBackground = computeBackground(initialValue, min, max);
	const initialText = text ? text.format(initialValue) : String(initialValue);

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

	function commit(raw: number, options?: { skipDisplay?: boolean }) {
		if (Number.isNaN(raw)) return;
		const clamped = Math.min(Math.max(raw, min), max);
		if (sliderRef.current) {
			sliderRef.current.value = String(clamped);
			sliderRef.current.style.background = computeBackground(clamped, min, max);
		}
		if (!options?.skipDisplay && secondaryRef.current) {
			secondaryRef.current.value = text ? text.format(clamped) : String(clamped);
		}
	}

	function handleSliderChange(event: ChangeEvent<HTMLInputElement>) {
		commit(Number(event.target.value));
	}

	function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
		const raw = event.target.value;
		if (raw === "") return;
		commit(Number(raw), { skipDisplay: true });
	}

	function handleNumberBlur(event: FocusEvent<HTMLInputElement>) {
		const raw = event.target.value;
		const val = raw === "" ? Number.NaN : Number(raw);
		const current = sliderRef.current ? Number(sliderRef.current.value) : initialValue;
		commit(Number.isNaN(val) ? current : val);
	}

	function commitTextInput(raw: string) {
		if (!text) return;
		const parsed = text.parse(raw);
		const current = sliderRef.current ? Number(sliderRef.current.value) : initialValue;
		commit(parsed == null || Number.isNaN(parsed) ? current : parsed);
	}

	function handleTextBlur(event: FocusEvent<HTMLInputElement>) {
		commitTextInput(event.target.value);
	}

	function handleTextKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") commitTextInput(event.currentTarget.value);
	}

	return (
		<div className="mb-3 flex max-w-lg items-center gap-4 px-2.5">
			<div className="flex-1">
				<input
					className="slider-thumb:size-4 h-1.5 w-full cursor-pointer appearance-none slider-thumb:appearance-none rounded-2xl slider-thumb:rounded-full slider-thumb:border-none slider-thumb:bg-primary outline-none"
					defaultValue={initialValue}
					id={id}
					max={max}
					min={min}
					name={id}
					onChange={handleSliderChange}
					ref={sliderRef}
					step={step}
					style={{ background: initialBackground }}
					type="range"
				/>

				<div className="flex justify-between px-2.5 py-0">{stepSpans}</div>
			</div>

			{text ? (
				<input
					className="w-24 rounded-lg bg-light-gray text-center text-2xl text-white/75 shadow-dim-inner"
					defaultValue={initialText}
					onBlur={handleTextBlur}
					onKeyDown={handleTextKeyDown}
					ref={secondaryRef}
					type="text"
				/>
			) : (
				<input
					className="rounded-lg bg-light-gray text-center text-2xl text-white/75 shadow-dim-inner"
					defaultValue={initialValue}
					max={max}
					min={min}
					onBlur={handleNumberBlur}
					onChange={handleNumberChange}
					ref={secondaryRef}
					step={step}
					type="number"
				/>
			)}
		</div>
	);
}

function computeBackground(value: number, min: number, max: number): string {
	const progress = ((value - min) / (max - min)) * 100;
	return `linear-gradient(to right, #00000000 ${progress}%, #474747 ${progress}%)${GRADIENT_TRACK}`;
}

interface SliderProps {
	readonly defaultValue: number;
	readonly id: string;
	readonly max: number;
	readonly min: number;
	readonly step: number;
	readonly steps: number[] | string[];
	readonly mobileStepsToHide?: number[];
	readonly text?: {
		readonly format: (value: number) => string;
		readonly parse: (text: string) => number | null;
	};
}
