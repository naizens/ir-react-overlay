"use client";

import { useEffect, useState } from "react";

const HomePage = () => {
	const [error, setError] = useState(null);

	const openTelemetryWindow = () => {
		if (window.electron && window.electron.ipcRenderer) {
			window.electron.ipcRenderer.send("open-telemetry-window");
		} else {
			console.error("ipcRenderer is not available");
			setError("ipcRenderer is not available");
		}
	};

	const lockTelemetryWindow = () => {
		window.electron.ipcRenderer.send("lock-telemetry-window");
	};

	const unlockTelemetryWindow = () => {
		window.electron.ipcRenderer.send("unlock-telemetry-window");
	};

	return (
		<div className="text-black w-screen h-screen">
			{error && <p>Error: {error}</p>}
			<div className="flex flex-col space-y-3 w-full p-4">
				<div className="flex h-10 w-full rounded-md overflow-hidden border">
					<span className="bg-slate-500 text-base text-center text-nowrap h-full place-content-center p-1">
						Browser URL
					</span>
					<input
						type="url"
						className="w-full px-2 font-normal"
						value="http://localhost:3000/telemetry"
					></input>
					<button
						title="Open overlay"
						className="bg-slate-500 w-fit h-full p-1"
						onClick={openTelemetryWindow}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/>
						</svg>
					</button>
				</div>
				<div>
					<p>Telemetry window controls:</p>
					<ul>
						<li>Lock: Prevents the telemetry window from being moved</li>
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded-md"
							onClick={lockTelemetryWindow}
						>
							Lock
						</button>
						<li>Unlock: Allows the telemetry window to be moved</li>
						<button
							className="px-4 py-2 bg-green-500 text-white rounded-md"
							onClick={unlockTelemetryWindow}
						>
							Unlock
						</button>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
