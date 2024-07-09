import React from "react";
import Head from "next/head";
import LinkInput from "./components/linkInput";

export default function HomePage() {
	const [error, setError] = React.useState<string | null>(null);

	const lockAllWindows = () => {
		window.ipc.send("lock-all-windows", null);
	};
	const unlockAllWindows = () => {
		window.ipc.send("unlock-all-windows", null);
	};

	return (
		<React.Fragment>
			<Head>
				<title>IR-Overlay</title>
				<meta name="description" content="IR-Overlay by Niclas Heide" />
			</Head>
			<div className="text-black w-screen h-screen">
				{error && <p>Error: {error}</p>}
				<div className="flex flex-col space-y-3 w-full p-4">
					<LinkInput
						url="https://http://localhost:8888/inputs"
						labelText="Browser URL"
						eventName="open-pedals-window"
					/>
					<div>
						<p>Telemetry window controls:</p>
						<ul>
							<li>Lock: Prevents the telemetry window from being moved</li>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded-md"
								onClick={lockAllWindows}
							>
								Lock
							</button>
							<li>Unlock: Allows the telemetry window to be moved</li>
							<button
								className="px-4 py-2 bg-green-500 text-white rounded-md"
								onClick={unlockAllWindows}
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
