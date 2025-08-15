// Tremor Calendar [v1.0.0]

/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: Lib stuff */

"use client";

import { RiArrowLeftDoubleLine, RiArrowLeftSLine, RiArrowRightDoubleLine, RiArrowRightSLine } from "@remixicon/react";
import { addYears, format, isSameMonth } from "date-fns";
import * as React from "react";
import {
	DayPicker,
	type DayPickerRangeProps,
	type DayPickerSingleProps,
	type DayProps,
	type Matcher,
	useDayPicker,
	useDayRender,
	useNavigation,
} from "react-day-picker";
import { cx, focusRing } from "@/lib/utils.ts";

interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	icon: React.ElementType;
	disabled?: boolean;
}

const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
	({ onClick, icon, disabled, ...props }: NavigationButtonProps, forwardedRef) => {
		const Icon = icon;
		return (
			<button
				className={cx(
					"flex size-8 shrink-0 select-none items-center justify-center rounded-sm border p-1 outline-hidden transition sm:size-[30px]",
					// text color
					"text-gray-600 hover:text-gray-800",
					"dark:text-gray-400 dark:hover:text-gray-200",
					// border color
					"border-gray-300 dark:border-gray-800",
					// background color
					"hover:bg-gray-50 active:bg-gray-100",
					"dark:active:bg-gray-800 dark:hover:bg-gray-900",
					// disabled
					"disabled:pointer-events-none",
					"disabled:border-gray-200 dark:disabled:border-gray-800",
					"disabled:text-gray-400 dark:disabled:text-gray-600",
					focusRing,
				)}
				disabled={disabled}
				onClick={onClick}
				ref={forwardedRef}
				type="button"
				{...props}
			>
				<Icon className="size-full shrink-0" />
			</button>
		);
	},
);

NavigationButton.displayName = "NavigationButton";

type OmitKeys<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P];
};

type KeysToOmit = "showWeekNumber" | "captionLayout" | "mode";

type SingleProps = OmitKeys<DayPickerSingleProps, KeysToOmit>;
type RangeProps = OmitKeys<DayPickerRangeProps, KeysToOmit>;

type CalendarProps =
	| ({
			mode: "single";
	  } & SingleProps)
	| ({
			mode?: undefined;
	  } & SingleProps)
	| ({
			mode: "range";
	  } & RangeProps);

const Calendar = ({
	mode = "single",
	weekStartsOn = 1,
	numberOfMonths = 1,
	enableYearNavigation = false,
	disableNavigation,
	locale,
	className,
	classNames,
	...props
}: CalendarProps & { enableYearNavigation?: boolean }) => {
	return (
		<DayPicker
			className={cx(className)}
			classNames={{
				cell: cx("relative p-0 text-center focus-within:relative", "text-gray-900 dark:text-gray-50"),
				day: cx(
					"size-9 rounded-sm text-sm focus:z-10",
					"text-gray-900 dark:text-gray-50",
					"hover:bg-gray-200 dark:hover:bg-gray-700",
					focusRing,
				),
				day_disabled: "text-gray-300! dark:text-gray-700! line-through disabled:hover:bg-transparent",
				day_hidden: "invisible",
				day_outside: "text-gray-400 dark:text-gray-600",
				day_range_end: "rounded-l-none rounded-r!",
				day_range_middle: cx(
					"rounded-none!",
					"aria-selected:bg-gray-100! aria-selected:text-gray-900!",
					"dark:aria-selected:bg-gray-900! dark:aria-selected:text-gray-50!",
				),
				day_range_start: "rounded-r-none rounded-l!",
				day_selected: cx(
					"rounded-sm",
					"aria-selected:bg-blue-500 aria-selected:text-white",
					"dark:aria-selected:bg-blue-500 dark:aria-selected:text-white",
				),
				day_today: "font-semibold",
				head_cell: "w-9 font-medium text-sm sm:text-xs text-center text-gray-400 dark:text-gray-600 pb-2",
				month: "space-y-4 p-3",
				months: "flex space-y-0",
				nav: "gap-1 flex items-center rounded-full size-full justify-between p-4",
				row: "w-full mt-0.5",
				table: "w-full border-collapse space-y-1",
				...classNames,
			}}
			components={{
				Caption: ({ ...props }) => {
					const { goToMonth, nextMonth, previousMonth, currentMonth, displayMonths } = useNavigation();
					const { numberOfMonths, fromDate, toDate } = useDayPicker();

					const displayIndex = displayMonths.findIndex((month) => isSameMonth(props.displayMonth, month));
					const isFirst = displayIndex === 0;
					const isLast = displayIndex === displayMonths.length - 1;

					const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
					const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

					const goToPreviousYear = () => {
						const targetMonth = addYears(currentMonth, -1);
						if (previousMonth && (!fromDate || targetMonth.getTime() >= fromDate.getTime())) {
							goToMonth(targetMonth);
						}
					};

					const goToNextYear = () => {
						const targetMonth = addYears(currentMonth, 1);
						if (nextMonth && (!toDate || targetMonth.getTime() <= toDate.getTime())) {
							goToMonth(targetMonth);
						}
					};

					return (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								{enableYearNavigation && !hidePreviousButton && (
									<NavigationButton
										aria-label="Go to previous year"
										disabled={
											disableNavigation ||
											!previousMonth ||
											(fromDate && addYears(currentMonth, -1).getTime() < fromDate.getTime())
										}
										icon={RiArrowLeftDoubleLine}
										onClick={goToPreviousYear}
									/>
								)}
								{!hidePreviousButton && (
									<NavigationButton
										aria-label="Go to previous month"
										disabled={disableNavigation || !previousMonth}
										icon={RiArrowLeftSLine}
										onClick={() => previousMonth && goToMonth(previousMonth)}
									/>
								)}
							</div>

							<div
								aria-live="polite"
								className="font-medium text-gray-900 text-sm capitalize tabular-nums dark:text-gray-50"
								role="presentation"
							>
								{format(props.displayMonth, "LLLL yyy", { locale })}
							</div>

							<div className="flex items-center gap-1">
								{!hideNextButton && (
									<NavigationButton
										aria-label="Go to next month"
										disabled={disableNavigation || !nextMonth}
										icon={RiArrowRightSLine}
										onClick={() => nextMonth && goToMonth(nextMonth)}
									/>
								)}
								{enableYearNavigation && !hideNextButton && (
									<NavigationButton
										aria-label="Go to next year"
										disabled={
											disableNavigation ||
											!nextMonth ||
											(toDate && addYears(currentMonth, 1).getTime() > toDate.getTime())
										}
										icon={RiArrowRightDoubleLine}
										onClick={goToNextYear}
									/>
								)}
							</div>
						</div>
					);
				},
				Day: ({ date, displayMonth }: DayProps) => {
					const buttonRef = React.useRef<HTMLButtonElement>(null);
					const { activeModifiers, buttonProps, divProps, isButton, isHidden } = useDayRender(
						date,
						displayMonth,
						buttonRef as any,
					);

					const { selected, today, disabled, range_middle } = activeModifiers;

					if (isHidden) {
						return null;
					}

					if (!isButton) {
						return <div {...divProps} className={cx("flex items-center justify-center", divProps.className)} />;
					}

					const { children: buttonChildren, className: buttonClassName, ...buttonPropsRest } = buttonProps;

					return (
						<button ref={buttonRef} {...buttonPropsRest} className={cx("relative", buttonClassName)} type="button">
							{buttonChildren}
							{today && (
								<span
									className={cx("-translate-x-1/2 absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 rounded-[2px]", {
										"bg-blue-500 dark:bg-blue-500": !selected,
										"bg-gray-400 text-gray-400 dark:bg-gray-400 dark:text-gray-600": disabled,
										"bg-gray-400! dark:bg-gray-600!": selected && range_middle,
										"bg-white! dark:bg-gray-950!": selected,
									})}
								/>
							)}
						</button>
					);
				},
				IconLeft: () => <RiArrowLeftSLine aria-hidden="true" className="size-4" />,
				IconRight: () => <RiArrowRightSLine aria-hidden="true" className="size-4" />,
			}}
			locale={locale}
			mode={mode}
			numberOfMonths={numberOfMonths}
			showOutsideDays={numberOfMonths === 1}
			tremor-id="tremor-raw"
			weekStartsOn={weekStartsOn}
			{...(props as SingleProps & RangeProps)}
		/>
	);
};

Calendar.displayName = "Calendar";

export { Calendar, type Matcher };
