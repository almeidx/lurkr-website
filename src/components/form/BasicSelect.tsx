"use client";

import { useCallback, useRef, useState, type MouseEventHandler } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import useClickOutside from "~/hooks/useClickOutside";

export default function BasicSelect({
	closeOnSelect = false,
	initialItem,
	items,
	disabled,
	onSelect,
}: BasicSelectProps) {
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [selected, setSelected] = useState<string>(initialItem);
	const elementRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

	useClickOutside(elementRef, handleClickOutside);

	const handleItemChange: MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			const index = Number.parseInt((event.target as HTMLDivElement | HTMLParagraphElement).dataset.id ?? "NaN", 10);
			const item = items[index];

			if (disabled) {
				return;
			}

			if (!item) {
				console.warn("[BasicSelect] Couldn't find the item when user tried changing item");
				return;
			}

			onSelect(item);
			setSelected(item);
			if (closeOnSelect) {
				setDropdownOpen(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items],
	);

	return (
		<div className={`relative w-full text-white ${disabled ? "text-opacity-25" : "cursor-pointer"}`} ref={elementRef}>
			<div
				className="bg-discord-not-quite-black flex h-12 w-full flex-row flex-wrap gap-1.5 rounded-md px-5 py-3 shadow focus:outline-none"
				onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
			>
				<span className="z-20 flex w-full items-center px-1.5 py-1 leading-3 ">{selected}</span>

				<div className="absolute right-0 mx-4 my-auto h-full text-2xl transition-colors">
					<AiFillCaretDown />
				</div>
			</div>

			<div
				className={`${
					dropdownOpen ? "" : "hidden"
				} absolute z-30 mt-2 flex max-h-64 w-full flex-col items-center rounded-md bg-[#36393f]`}
			>
				<div className="my-2 flex h-full w-full flex-col gap-1 overflow-y-scroll">
					{items.map((name, idx) => (
						<div
							className="hover:bg-discord-lighter flex cursor-pointer items-center rounded-lg px-4 py-2 text-center"
							data-id={idx.toString()}
							key={idx.toString()}
							onClick={handleItemChange}
						>
							<p data-id={idx.toString()}>{name}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

interface BasicSelectProps {
	closeOnSelect?: boolean;
	disabled?: boolean;
	initialItem: string;
	items: string[];
	onSelect(item: string): unknown;
}
