import { useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useClickOutside from "../../hooks/useClickOutside";
import { resolveColour } from "../../utils/common";
import type { Snowflake } from "../../utils/constants";
import RoleChannelBullet from "../RoleChannelBullet";
import Input from "../form/Input";

interface Channel {
	id: Snowflake;
	name: string;
}

type Role = Channel & {
	color: number;
};

type Items = Channel[] | Role[];

export type OnSelectFn = (items: Snowflake[]) => unknown;

interface SelectorProps {
	disabled?: boolean;
	id: string;
	initialItems: Snowflake[];
	items: Items;
	limit: number;
	onSelect: OnSelectFn;
	type: "channel" | "role";
}

const resolveItem = (item: Channel | Role | null, type: SelectorProps["type"]) =>
	type === "channel"
		? { id: item?.id, name: item?.name } // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		: ({ color: (item as Role | null)?.color, id: item?.id, name: item?.name } as Role);

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace JSX {
	interface IntrinsicElements {
		"data-id": string;
	}
}

export default function Selector({ id, limit, items, initialItems, onSelect, type, disabled }: SelectorProps) {
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [selected, setSelected] = useState<Items>([]);
	const [options, setOptions] = useState<Items>(items);
	const [searchTerm, setSearchTerm] = useState("");
	const elementRef = useRef<HTMLDivElement>(null);
	const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

	useClickOutside(elementRef, handleClickOutside);

	const handleChannelRemove: MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			const clone = [...selected];
			let selectedIndex = -1;
			let element = event.target as HTMLElement;
			let idx = 0;

			while (idx < 5) {
				const datasetId = element.dataset.id;
				if (datasetId) {
					selectedIndex = clone.findIndex((item) => item.id === datasetId);
					break;
				}

				element = element.parentElement!;
				idx++;
			}

			if (selectedIndex < 0) {
				console.error("[Selector] Couldn't find item index when user tried removing an item");
				return;
			}

			clone.splice(selectedIndex, 1);
			onSelect(clone.map((item) => item.id));
			setSelected(clone);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selected],
	);

	const handleClickedItem: MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			if (selected.length >= limit) {
				return;
			}

			const id = (event.target as HTMLDivElement | HTMLParagraphElement).dataset.id!;
			if (selected.some((channel) => channel.id === id)) {
				return;
			}

			const item = items.find((channel) => channel.id === id);
			if (!item) {
				console.error("[Selector] Couldn't find item when user tried adding an item");
				return;
			}

			if (selected.length + 1 >= limit) {
				setDropdownOpen(false);
			}

			const newSelectedItems = [...selected, resolveItem(item, type) as Channel | Role];

			onSelect(newSelectedItems.map((channel) => channel.id));
			setSelected(newSelectedItems);
			setOptions([...options].filter((item) => item.id !== id));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selected, limit, items, options],
	);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const resolvedItems = (initialItems ?? [])
			.map((id) => resolveItem(items.find((it) => it.id === id) ?? null, type))
			.filter((item): item is Channel | Role => Boolean(item.name));

		setSelected(resolvedItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const searchableItems = items.filter((channel_) => !selected.some((channel) => channel.id === channel_.id));

		if (!searchTerm) {
			setOptions(searchableItems);
			return;
		}

		setOptions(searchableItems.filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase())));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm, selected]);

	return (
		<div className="relative" ref={elementRef}>
			<div className="flex min-h-[3rem] min-w-[6rem] flex-row flex-wrap gap-1.5 rounded-md bg-discord-not-quite-black py-3 px-5 shadow focus:outline-none">
				{selected.map((item) => (
					<RoleChannelBullet
						data-id={item.id}
						hoverX
						key={item.id}
						name={item.name}
						onClick={handleChannelRemove}
						type={type}
						{...("color" in item ? { roleColour: resolveColour(item.color) } : {})}
					/>
				))}

				{selected.length < limit && (
					<AiOutlinePlusCircle
						className={`${
							disabled ? "text-opacity-25" : "cursor-pointer hover:text-opacity-75"
						} h-6 w-6 fill-current text-white`}
						onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
					/>
				)}
			</div>

			<div
				className={`${dropdownOpen ? "" : "hidden"} absolute z-[100] mt-2 max-h-72 w-full rounded-md bg-[#36393f] pb-3`}
			>
				<div className="w-full">
					<Input
						className="p-3"
						id={id}
						initialValue={""}
						maxLength={50}
						onChange={(text) => setSearchTerm(text)}
						placeholder={`${type === "channel" ? "Channel" : "Role"} name`}
					/>
				</div>

				<div className="flex max-h-48 w-full flex-col gap-y-0.5 overflow-y-auto">
					{options.map((item) => (
						<div
							className="flex w-full cursor-pointer items-center py-3 px-6 text-left text-white hover:bg-discord-lighter"
							data-id={item.id}
							key={item.id}
							onClick={handleClickedItem}
						>
							{type === "role" && "color" in item && (
								<div
									data-id={item.id}
									className="mr-2 h-4 w-4 select-none rounded-full"
									style={{ backgroundColor: resolveColour(item.color) }}
								/>
							)}
							<div data-id={item.id} className=" select-none break-all leading-4">
								{type === "channel" && "#"}
								{item.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
