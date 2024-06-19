// src/app/page.js

"use client"; // Client component directive
import React, { useEffect, useState } from "react";

const Telemetry = () => {
	const [telemetry, setTelemetry] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let intervalId;

		const fetchTelemetry = async () => {
			try {
				const res = await fetch("/api/telemetry");
				if (!res.ok) {
					throw new Error("Network response was not ok.");
				}
				const data = await res.json();
				// Convert speed to km/h and round it
				data.speed = Math.round(data.speed * 3.6);
				setTelemetry(data);
			} catch (error) {
				console.error("Error fetching telemetry data:", error);
				setTelemetry({ error: "iRacing is not running" });
			} finally {
				setLoading(false);
			}
		};

		const startFetching = () => {
			intervalId = setInterval(fetchTelemetry, 1000 / 30); // ~33ms for 30 FPS
		};
		startFetching();

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	// Format percentage to always show two digits, even for 100
	const formatPercentage = (percentage) => {
		return percentage >= 100 ? "00" : percentage.toFixed(0).padStart(2, "0");
	};

	const normalizeWheelAngle = (angle) => {
		return (((angle + 180) % 360) - 180) * -1;
	};

	// Calculate rotation angle for wheel circle
	const calculateWheelRotation = (angle) => {
		const normalizedAngle = normalizeWheelAngle(angle);
		return `rotate(${normalizedAngle}deg)`;
	};

	const getGearDisplay = () => {
		if (telemetry.gear === 0) {
			return "N";
		} else if (telemetry.gear === -1) {
			return "R";
		} else {
			return telemetry.gear;
		}
	};

	// SVG circle styling and animation
	const svgStyle = {
		transform: `rotate(${normalizeWheelAngle(telemetry.wheelangle)}deg)`,
		transition: "transform 0.1s ease-out",
	};

	return (
		<div className="p-1 bg-slate-800 w-fit h-fit rounded-xl drag-region">
			{loading ? (
				<p>Loading...</p>
			) : telemetry.error ? (
				<p>{telemetry.error}</p>
			) : (
				<div className="flex space-x-0.5 w-full h-full">
					<div className="flex flex-col items-center space-y-0.5 w-16 h-full">
						<p className="text-6xl font-bold">{getGearDisplay()}</p>
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
								{formatPercentage(telemetry.clutch)}
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
								{formatPercentage(telemetry.brake)}
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
								{formatPercentage(telemetry.throttle)}
							</p>
						</div>
					</div>

					<div className="h-20 w-20">
						<svg
							viewBox="-10 -10 20 20"
							className="left-0 top-0 transform -translate-x-1/2 -translate-y-1/2"
							style={{ transform: svgStyle.transform }}
						>
							<circle
								cx="0"
								cy="0"
								r="9"
								fill="transparent"
								stroke="#4B5563"
								strokeWidth="2"
							/>
							<line
								x1="0"
								y1="9"
								x2="0"
								y2="1/2"
								stroke="#4B5563"
								strokeWidth="2"
							/>
							<line
								x1="9"
								y1="0"
								x2="-9"
								y2="0"
								stroke="#4B5563"
								strokeWidth="2"
							/>
						</svg>
					</div>
				</div>
			)}
		</div>
	);
};

export default Telemetry;
