import { useState } from "react";

interface ButtonProps {
	children: React.ReactNode;
	id: string;
	onClick(): unknown;
	red?: boolean;
	withConfirmation?: boolean;
}

export default function Button({ children, id, onClick, red, withConfirmation }: ButtonProps) {
	const [msg, setMsg] = useState<string | null>(null);
	const [disabled, setDisabled] = useState(false);

	return (
		<div className="flex items-center gap-2 text-white">
			<button
				className={`flex cursor-pointer items-center justify-center rounded-md px-2 py-1 shadow-md duration-200 ${
					red ? "bg-red-500 hover:bg-red-400" : "bg-discord-not-quite-black hover:bg-discord-lighter"
				} disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-75`}
				disabled={disabled}
				id={id}
				onClick={() => {
					if (!withConfirmation) {
						onClick();
						return;
					}

					if (msg) {
						setMsg(null);
						setDisabled(true);

						onClick();
					} else {
						setMsg("Click again to confirm");
					}
				}}
				type="button"
			>
				{children}
			</button>

			{msg && <p>{msg}</p>}
		</div>
	);
}
