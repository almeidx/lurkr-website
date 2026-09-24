/**
 * Temporary "New" launch badge for freshly released dashboard pages.
 * Removal: delete this file and its `badge={<NewBadge />}` usages in
 * dashboard-menu.tsx.
 */
export function NewBadge() {
	return (
		<span className="rounded-full bg-linear-(--lurkr-gradient) px-2 py-0.5 font-bold text-[10px] text-black uppercase leading-none">
			New
		</span>
	);
}
