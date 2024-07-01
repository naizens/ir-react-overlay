// renderer/pages/splash.tsx
import React, { useEffect } from "react";
import Head from "next/head";

export default function Splash() {
	useEffect(() => {
		const timer = setTimeout(() => {
			window.ipc.send("splash-done", null);
		}, 3000); // Zeige den Splash-Screen für 3 Sekunden

		return () => clearTimeout(timer);
	}, []);
	return (
		<React.Fragment>
			<Head>
				<title>IR-Overlay</title>
				<meta name="description" content="IR-Overlay by Niclas Heide" />
			</Head>
			<div className="min-h-screen flex justify-center items-center text-center space-x-2 bg-gray-900 text-white rounded-xl overflow-hidden select-none">
				<div className="flex justify-center h-full ">
					<svg
						className="animate-spin -ml-1 mr-3 size-10 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
				<h1 className="text-2xl font-bold">Loading...</h1>
			</div>
		</React.Fragment>
	);
}
