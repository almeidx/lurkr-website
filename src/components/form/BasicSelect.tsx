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
				className="flex h-12 w-full flex-row flex-wrap gap-1.5 rounded-md bg-discord-not-quite-black py-3 px-5 shadow focus:outline-none"
				onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
			>
				<span className="z-50 flex w-full items-center py-1 px-1.5 leading-3 ">{selected}</span>

				<div className="absolute right-0 my-auto mx-4 h-full text-2xl transition-colors">
					<AiFillCaretDown />
				</div>
			</div>

			<div
				className={`${
					dropdownOpen ? "" : "hidden"
				} absolute z-[100] mt-2 flex max-h-64 w-full flex-col items-center rounded-md bg-[#36393f]`}
			>
				<div className="my-2 flex h-full w-full flex-col gap-1 overflow-y-scroll">
					{items.map((name, idx) => (
						<div
							className="flex cursor-pointer items-center rounded-lg py-2 px-4 text-center hover:bg-discord-lighter"
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
