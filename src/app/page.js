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
		<div className="text-black w-fit h-fit">
			<h1>Welcome to Next.js with Electron</h1>
			<button onClick={openTelemetryWindow}>Open Telemetry Window</button>
			{error && <p>Error: {error}</p>}

			<button
				className="px-4 py-2 bg-blue-500 text-white rounded-md"
				onClick={lockTelemetryWindow}
			>
				Lock
			</button>
			<button
				className="px-4 py-2 bg-green-500 text-white rounded-md"
				onClick={unlockTelemetryWindow}
			>
				Unlock
			</button>
		</div>
	);
};

export default HomePage;
