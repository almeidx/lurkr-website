import { Button } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { RiMoreFill } from "@remixicon/react";

export function TableRowActions({ openDeleteDialog, openGuildAccessDialog }: TableRowActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="group aspect-square p-1.5 hover:border hover:border-gray-300 data-state=open:border-gray-300 data-state=open:bg-gray-50 data-state=open:dark:border-gray-700 data-state=open:dark:bg-gray-900 hover:dark:border-gray-700"
					type="button"
				>
					<RiMoreFill
						className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-data-state=open:text-gray-700 group-data-state=open:dark:text-gray-300 group-hover:dark:text-gray-300"
						aria-hidden
					/>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="min-w-40">
				<DropdownMenuItem onClick={openGuildAccessDialog}>Guild access</DropdownMenuItem>
				<DropdownMenuItem className="text-red-600 dark:text-red-500" onClick={() => openDeleteDialog()}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface TableRowActionsProps {
	openDeleteDialog: () => void;
	openGuildAccessDialog: () => void;
}
