import React, { useEffect, useState } from "react";
import Head from "next/head";

interface TelemetryData {
	gear?: number;
	speed?: number;
	clutch?: number;
	brake?: number;
	throttle?: number;
	wheelangle?: number;
	error?: string;
}

export default function Inputs() {
	const [telemetry, setTelemetry] = useState<TelemetryData>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		const fetchTelemetry = async () => {
			try {
				const res = await fetch("/api/telemetry");
				if (!res.ok) {
					throw new Error("Network response was not ok.");
				}
				const data: TelemetryData = await res.json();
				// Convert speed to km/h and round it
				if (data.speed !== undefined) {
					data.speed = Math.round(data.speed * 3.6);
				}
				setTelemetry(data);
			} catch (error) {
				console.error("Error fetching telemetry data:", error);
				setTelemetry({ error: "iRacing is not running" });
			} finally {
				setLoading(false);
			}
		};

		const startFetching = () => {
			intervalId = setInterval(fetchTelemetry, 1000 / 60); // ~33ms for 30 FPS
		};
		startFetching();

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const formatPercentage = (percentage: number) => {
		return percentage >= 100 ? "00" : percentage.toFixed(0).padStart(2, "0");
	};

	const normalizeWheelAngle = (angle: number) => {
		return (((angle + 180) % 360) - 180) * -1;
	};

	// Calculate rotation angle for wheel circle
	const calculateWheelRotation = (angle: number) => {
		const normalizedAngle = normalizeWheelAngle(angle);
		return `rotate(${normalizedAngle}deg)`;
	};

	const getGearDisplay = () => {
		if (telemetry.gear === 0) {
			return "N";
		} else if (telemetry.gear === -1) {
			return "R";
		} else {
			return telemetry.gear?.toString() ?? ""; // Handle case where telemetry.gear is undefined
		}
	};

	// SVG circle styling and animation
	const svgStyle = {
		transform: `rotate(${normalizeWheelAngle(telemetry.wheelangle ?? 0)}deg)`,
		transition: "transform 0.1s ease-out",
	};

	return (
		<React.Fragment>
			<Head>
				<title>IR-Overlay</title>
				<meta name="description" content="IR-Overlay by Niclas Heide" />
			</Head>
			<div className="p-1 bg-slate-800 w-fit h-fit rounded-xl drag-region text-white">
				{loading ? (
					<p>Loading...</p>
				) : telemetry.error ? (
					<p>{telemetry.error}</p>
				) : (
					<div className="flex space-x-0.5 w-full h-full">
						<div className="flex flex-col items-center space-y-0.5 w-16 h-full">
							<p className="text-6xl font-bold text-yellow-400">
								{getGearDisplay()}
							</p>
							<p className="text-sm font-semibold">{telemetry.speed} km/h</p>
						</div>
						<div className="flex">
							<div className="flex flex-col items-center w-4">
								<div className="h-full w-3  overflow-hidden relative bg-slate-700 border-slate-600 border">
									<div
										className="absolute bottom-0 left-0 bg-blue-700"
										style={{ height: `${telemetry.clutch}%`, width: "100%" }}
									></div>
								</div>
								<p className="text-xs font-bold">
									{formatPercentage(telemetry.clutch ?? 0)}
								</p>
							</div>
							<div className="flex flex-col items-center w-4">
								<div className="h-full w-3  overflow-hidden relative bg-slate-700 border-slate-600 border">
									<div
										className="absolute bottom-0 left-0 bg-red-700"
										style={{ height: `${telemetry.brake}%`, width: "100%" }}
									></div>
								</div>
								<p className="text-xs font-bold">
									{formatPercentage(telemetry.brake ?? 0)}
								</p>
							</div>
							<div className="flex flex-col items-center w-4">
								<div className="h-full w-3  overflow-hidden relative bg-slate-700 border-slate-600 border">
									<div
										className="absolute bottom-0 left-0 bg-green-700"
										style={{ height: `${telemetry.throttle}%`, width: "100%" }}
									></div>
								</div>
								<p className="text-xs font-bold">
									{formatPercentage(telemetry.throttle ?? 0)}
								</p>
							</div>
						</div>

						<div className="h-20 w-20 relative">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
								style={{ transform: svgStyle.transform }}
							>
								<g clip-path="url(#a)">
									<path
										stroke="#4B5563"
										stroke-width="2"
										d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0v-9m9 0H1"
									/>
									<mask id="b" fill="#fff">
										<path d="M14 9a5 5 0 0 0-5 5h1.95A3.05 3.05 0 0 1 14 10.95V9Z" />
									</mask>
									<path
										stroke="#4B5563"
										stroke-width="2"
										d="M14 9a5 5 0 0 0-5 5h1.95A3.05 3.05 0 0 1 14 10.95V9Z"
										mask="url(#b)"
									/>
									<mask id="c" fill="#fff">
										<path d="M11 14a5 5 0 0 0-5-5v1.95A3.05 3.05 0 0 1 9.05 14H11Z" />
									</mask>
									<path
										stroke="#4B5563"
										stroke-width="2"
										d="M11 14a5 5 0 0 0-5-5v1.95A3.05 3.05 0 0 1 9.05 14H11Z"
										mask="url(#c)"
									/>
									<path
										stroke="#0EA5E9"
										stroke-width="2"
										d="M11.116 1.07a9 9 0 0 0-2.239 0"
									/>
								</g>
								<defs>
									<clipPath id="a">
										<path fill="#fff" d="M0 0h20v20H0z" />
									</clipPath>
								</defs>
							</svg>
						</div>
					</div>
				)}
			</div>
		</React.Fragment>
	);
}
