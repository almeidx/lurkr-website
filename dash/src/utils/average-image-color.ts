export function averageImageColor(src: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";

		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Could not create canvas context."));
				return;
			}

			ctx.drawImage(img, 0, 0);
			const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

			let r = 0;
			let g = 0;
			let b = 0;
			let count = 0;

			for (let i = 0; i < data.length; i += 4) {
				const pr = data[i]!;
				const pg = data[i + 1]!;
				const pb = data[i + 2]!;
				const pa = data[i + 3]!;
				if (pa < 128) continue;

				r += pr;
				g += pg;
				b += pb;
				count++;
			}

			if (count === 0) {
				reject(new Error("Image has no visible pixels."));
				return;
			}

			r = Math.round(r / count);
			g = Math.round(g / count);
			b = Math.round(b / count);

			resolve(
				`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
			);
		};

		img.onerror = () => reject(new Error("Failed to load image."));
		img.src = src;
	});
}
