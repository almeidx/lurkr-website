// Tremor Table [v1.0.0]

import React from "react";
import { cx } from "@/lib/utils.ts";

const TableRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, forwardedRef) => (
		<div
			ref={forwardedRef}
			// Activate if table is used in a float environment
			// className="flow-root"
		>
			<div
				// make table scrollable on mobile
				className={cx("w-full overflow-auto whitespace-nowrap", className)}
				{...props}
			>
				{children}
			</div>
		</div>
	),
);

TableRoot.displayName = "TableRoot";

const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
	({ className, ...props }, forwardedRef) => (
		<table
			className={cx(
				// base
				"w-full caption-bottom border-b",
				// border color
				"border-gray-200 dark:border-gray-800",
				className,
			)}
			ref={forwardedRef}
			tremor-id="tremor-raw"
			{...props}
		/>
	),
);

Table.displayName = "Table";

const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, forwardedRef) => <thead className={cx(className)} ref={forwardedRef} {...props} />,
);

TableHead.displayName = "TableHead";

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, forwardedRef) => (
		<th
			className={cx(
				// base
				"border-b px-4 py-3.5 text-left font-semibold text-sm",
				// text color
				"text-gray-900 dark:text-gray-50",
				// border color
				"border-gray-200 dark:border-gray-800",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	),
);

TableHeaderCell.displayName = "TableHeaderCell";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, forwardedRef) => (
		<tbody
			className={cx(
				// base
				"divide-y",
				// divide color
				"divide-gray-200 dark:divide-gray-800",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	),
);

TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
	({ className, ...props }, forwardedRef) => (
		<tr
			className={cx(
				"[&_td:last-child]:pr-4 [&_th:last-child]:pr-4",
				"[&_td:first-child]:pl-4 [&_th:first-child]:pl-4",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	),
);

TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
	({ className, ...props }, forwardedRef) => (
		<td
			className={cx(
				// base
				"p-4 text-sm",
				// text color
				"text-gray-600 dark:text-gray-400",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	),
);

TableCell.displayName = "TableCell";

const TableFoot = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
	({ className, ...props }, forwardedRef) => {
		return (
			<tfoot
				className={cx(
					// base
					"border-t text-left font-medium",
					// text color
					"text-gray-900 dark:text-gray-50",
					// border color
					"border-gray-200 dark:border-gray-800",
					className,
				)}
				ref={forwardedRef}
				{...props}
			/>
		);
	},
);

TableFoot.displayName = "TableFoot";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
	({ className, ...props }, forwardedRef) => (
		<caption
			className={cx(
				// base
				"mt-3 px-3 text-center text-sm",
				// text color
				"text-gray-500 dark:text-gray-500",
				className,
			)}
			ref={forwardedRef}
			{...props}
		/>
	),
);

TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFoot, TableHead, TableHeaderCell, TableRoot, TableRow };
