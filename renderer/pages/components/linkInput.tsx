import React, { useState } from "react";

interface LinkInputProps {
	url: string;
	labelText: string;
	eventName: string;
}

export default function LinkInput({
	url,
	labelText,
	eventName,
}: LinkInputProps) {
	const [error, setError] = useState<string | null>(null);

	const openCustomWindow = () => {
		if (window.ipc) {
			window.ipc.send(eventName, null);
		} else {
			console.error("ipc not available");
			setError("ipc not available");
		}
	};

	return (
		<div className="flex h-10 w-full rounded-md overflow-hidden border">
			<span className="bg-slate-500 text-base text-center text-nowrap h-full place-content-center p-1">
				{labelText}
			</span>
			<input
				type="url"
				className="w-full px-2 font-normal"
				value={url}
				readOnly
			/>
			<button
				title="Open overlay"
				className="bg-slate-500 w-fit h-full p-1"
				onClick={openCustomWindow}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
			</button>
			{error && <div className="text-red-500">{error}</div>}
		</div>
	);
}
