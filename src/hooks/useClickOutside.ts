/* eslint-disable promise/prefer-await-to-callbacks */

import { useEffect, type RefObject } from "react";

// https://stackoverflow.com/a/42234988/11252146
export default function useClickOutside(ref: RefObject<HTMLElement>, callback: () => unknown) {
	useEffect(() => {
		const handleClickOutside = (event: globalThis.MouseEvent): void => {
			if (ref.current && !ref.current.contains(event.target as Element)) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [callback, ref]);
}
