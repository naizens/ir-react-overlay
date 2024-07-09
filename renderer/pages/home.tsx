import React from "react";
import Head from "next/head";

export default function HomePage() {
	const [error, setError] = React.useState<string | null>(null);

	const openTelemetryWindow = () => {
		if (window.ipc) {
			window.ipc.send("open-inputs-window", null);
		} else {
			console.error("ipc not available");
			setError("ipc not available");
		}
	};

	const lockTelemetryWindow = () => {
		window.ipc.send("lock-telemetry-window", null);
	};
	const unlockTelemetryWindow = () => {
		window.ipc.send("unlock-telemetry-window", null);
	};

	const minimizeApp = () => {
		window.ipc.send("minimizeApp", null);
	};
	const maximizeApp = () => {
		window.ipc.send("maximizeApp", null);
	};
	const closeApp = () => {
		window.ipc.send("closeApp", null);
	};

	return (
		<React.Fragment>
			<Head>
				<title>IR-Overlay</title>
				<meta name="description" content="IR-Overlay by Niclas Heide" />
			</Head>
			<div className="text-black w-screen h-screen">
				<nav className="drag-region flex items-center justify-between bg-slate-950 text-white shadow-md shadow-black/30">
					<div className="flex items-center space-x-4">
						<div className="px-4 py-3 content-center hover:bg-slate-800 group no-drag-region">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="3"
								stroke="currentColor"
								className="size-5 group-hover:scale-125 transition-all duration-200"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						</div>
						<span>IR-Overlay</span>
					</div>
					<div className="flex h-full">
						<div
							id="minimizeApp"
							className="px-4 py-3 group hover:bg-blue-950 transition-all duration-200 
												content-center no-drag-region"
							onClick={minimizeApp}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="size-5 group-hover:stroke-blue-600 group-hover:scale-125 
													transition-all duration-200 "
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={3}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
						<div
							id="maximizeApp"
							className="px-4 py-3 group hover:bg-yellow-950 transition-all duration-200 
												content-center no-drag-region	"
							onClick={maximizeApp}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={3}
								stroke="currentColor"
								className="size-5 group-hover:stroke-yellow-600 group-hover:scale-125 
													transition-all duration-200 ease-in-out"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
								/>
							</svg>
						</div>
						<div
							id="closeApp"
							className="px-4 py-2 group hover:bg-red-950 transition-all duration-200 
												content-center no-drag-region"
							onClick={closeApp}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={3}
								stroke="currentColor"
								className="size-5 group-hover:stroke-red-600 group-hover:scale-125 
													transition-all duration-200"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>
				</nav>
				{error && <p>Error: {error}</p>}
				<div className="flex flex-col space-y-3 w-full p-4">
					<div className="flex h-10 w-full rounded-md overflow-hidden border">
						<span className="bg-slate-500 text-base text-center text-nowrap h-full place-content-center p-1">
							Browser URL
						</span>
						<input
							type="url"
							className="w-full px-2 font-normal"
							value="http://localhost:8888/inputs"
							readOnly
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
		</React.Fragment>
	);
}
