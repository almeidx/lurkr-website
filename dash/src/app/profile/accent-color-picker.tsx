"use client";

import { Palette } from "@gravity-ui/icons";
import { Button, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, Label, parseColor } from "@heroui/react";
import Cookies from "js-cookie";
import { useState } from "react";
import { DEFAULT_ACCENT_COLOR, TOKEN_COOKIE } from "@/utils/constants.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

interface AccentColorPickerProps {
	readonly initialColor: string | null;
}

export function AccentColorPicker({ initialColor }: AccentColorPickerProps) {
	const [savedColor, setSavedColor] = useState(initialColor);
	const [color, setColor] = useState(parseColor(initialColor ?? DEFAULT_ACCENT_COLOR));
	const [isSaving, setIsSaving] = useState(false);
	const [isResetting, setIsResetting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const currentHex = color.toString("hex").toLowerCase();
	const hasChanges = currentHex !== (savedColor ?? DEFAULT_ACCENT_COLOR).toLowerCase();

	async function handleSave() {
		setError(null);
		setIsSaving(true);

		try {
			const token = Cookies.get(TOKEN_COOKIE)!;
			await makeApiRequest("/users/@me", token, {
				body: JSON.stringify({ accentColour: currentHex }),
				headers: { "Content-Type": "application/json" },
				method: "PATCH",
			});

			setSavedColor(currentHex);
		} catch (error) {
			setError(extractErrorMessage(error, "Failed to update accent color."));
		} finally {
			setIsSaving(false);
		}
	}

	async function handleReset() {
		setError(null);
		setIsResetting(true);

		try {
			const token = Cookies.get(TOKEN_COOKIE)!;
			await makeApiRequest("/users/@me", token, {
				body: JSON.stringify({ accentColour: null }),
				headers: { "Content-Type": "application/json" },
				method: "PATCH",
			});

			setSavedColor(null);
			setColor(parseColor(DEFAULT_ACCENT_COLOR));
		} catch (error) {
			setError(extractErrorMessage(error, "Failed to reset accent color."));
		} finally {
			setIsResetting(false);
		}
	}

	return (
		<div className="space-y-4">
			<div>
				<div className="flex items-center gap-2">
					<Palette className="size-5 text-white/60" />
					<h3 className="font-semibold text-xl">Accent Color</h3>
				</div>
				<p className="text-sm text-white/50">Used as the progress bar color of your rank card.</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<ColorPicker
					onChange={(c) => {
						setColor(c);
						setError(null);
					}}
					value={color}
				>
					<ColorPicker.Trigger>
						<ColorSwatch shape="square" size="lg" />
						<Label className="font-mono text-sm">{currentHex}</Label>
					</ColorPicker.Trigger>
					<ColorPicker.Popover className="gap-2">
						<ColorArea
							aria-label="Color area"
							className="max-w-full"
							colorSpace="hsb"
							xChannel="saturation"
							yChannel="brightness"
						>
							<ColorArea.Thumb />
						</ColorArea>
						<ColorSlider aria-label="Hue slider" channel="hue" className="gap-1 px-1" colorSpace="hsb">
							<Label>Hue</Label>
							<ColorSlider.Output className="text-muted" />
							<ColorSlider.Track>
								<ColorSlider.Thumb />
							</ColorSlider.Track>
						</ColorSlider>
						<ColorField aria-label="Hex color">
							<ColorField.Group variant="secondary">
								<ColorField.Prefix>
									<ColorSwatch size="xs" />
								</ColorField.Prefix>
								<ColorField.Input />
							</ColorField.Group>
						</ColorField>
					</ColorPicker.Popover>
				</ColorPicker>

				<div className="flex gap-2">
					{hasChanges && (
						<Button isDisabled={isSaving} onPress={handleSave} variant="primary">
							{isSaving ? "Saving..." : "Save"}
						</Button>
					)}
					{savedColor && (
						<Button isDisabled={isResetting} onPress={handleReset} variant="danger">
							{isResetting ? "Resetting..." : "Reset"}
						</Button>
					)}
				</div>
			</div>

			{error && <p className="text-red text-sm">{error}</p>}
		</div>
	);
}
