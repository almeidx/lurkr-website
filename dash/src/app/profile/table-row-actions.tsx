"use client";

import { Ellipsis } from "@gravity-ui/icons";
import { Button, Dropdown, Label } from "@heroui/react";

export function TableRowActions({ openDeleteDialog, openGuildAccessDialog }: TableRowActionsProps) {
	function handleAction(key: string | number) {
		// Delay opening the dialog so the dropdown popover's CSS exit transition
		// completes first — otherwise both overlays coexist in the DOM.
		setTimeout(() => {
			if (key === "guild-access") openGuildAccessDialog();
			else if (key === "delete") openDeleteDialog();
		}, 150);
	}

	return (
		<Dropdown>
			<Button aria-label="Actions" className="size-8 min-w-0 p-0" variant="ghost">
				<Ellipsis className="size-4" />
			</Button>
			<Dropdown.Popover>
				<Dropdown.Menu onAction={handleAction}>
					<Dropdown.Item id="guild-access" textValue="Guild access">
						<Label>Guild access</Label>
					</Dropdown.Item>
					<Dropdown.Item id="delete" textValue="Delete" variant="danger">
						<Label>Delete</Label>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
}

interface TableRowActionsProps {
	openDeleteDialog: () => void;
	openGuildAccessDialog: () => void;
}
