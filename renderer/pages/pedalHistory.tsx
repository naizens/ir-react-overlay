import React, { useEffect, useState } from "react";

interface TelemetryData {
	throttle?: number;
	brake?: number;
	clutch?: number;
	speed?: number;
	error?: string;
}

const PedalHistory: React.FC = () => {
	const maxHistoryLength = 50; // Maximum number of data points to store
	const [telemetry, setTelemetry] = useState<TelemetryData>({});
	const [loading, setLoading] = useState(true);
	const [history, setHistory] = useState<{
		throttle: number[];
		brake: number[];
		clutch: number[];
	}>({
		throttle: [],
		brake: [],
		clutch: [],
	});

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		const fetchTelemetry = async () => {
			try {
				const res = await fetch("/api/rtelemetry");
				if (!res.ok) {
					throw new Error("Network response was not ok.");
				}
				const data: TelemetryData = await res.json();
				// Convert speed to km/h and round it
				if (data.speed !== undefined) {
					data.speed = Math.round(data.speed * 3.6);
				}
				setTelemetry(data);
				// Update history with new telemetry data
				addDataToHistory("clutch", data.clutch || 0);
				addDataToHistory("brake", data.brake || 0);
				addDataToHistory("throttle", data.throttle || 0);
			} catch (error) {
				console.error("Error fetching telemetry data:", error);
				setTelemetry({ error: "iRacing is not running" });
			} finally {
				setLoading(false);
			}
		};

		const startFetching = () => {
			intervalId = setInterval(fetchTelemetry, 1000 / 60); // 60 FPS
		};
		startFetching();

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const addDataToHistory = (
		type: "throttle" | "brake" | "clutch",
		value: number
	) => {
		setHistory((prev) => {
			const updatedData = [...prev[type], value];
			if (updatedData.length > maxHistoryLength) {
				return {
					...prev,
					[type]: updatedData.slice(updatedData.length - maxHistoryLength),
				};
			} else {
				return {
					...prev,
					[type]: updatedData,
				};
			}
		});
	};

	const renderHistoryLine = (data: number[], color: string) => {
		const height = 80;
		const widthLimit = 220;
		const maxInput = 100;
		const scaleY = height / maxInput;
		const step = widthLimit / Math.max(data.length, 1);

		return (
			<svg
				className="absolute bottom-0 left-0"
				width={widthLimit}
				height={height}
				viewBox={`0 0 ${widthLimit} ${height}`}
				preserveAspectRatio="none"
			>
				<polyline
					points={data
						.map((value, index) => `${index * step},${height - value * scaleY}`)
						.join(" ")}
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
			</svg>
		);
	};

	return (
		<div className="w-full h-20 bg-slate-800 overflow-hidden relative drag-region">
			{loading && <p>Loading...</p>}
			{!loading && telemetry.error && <p>{telemetry.error}</p>}
			{!loading && !telemetry.error && (
				<>
					{renderHistoryLine(history.clutch, "rgba(59, 130, 246, 0.7)")}
					{renderHistoryLine(history.brake, "rgba(219, 39, 91, 0.7)")}
					{renderHistoryLine(history.throttle, "rgba(64, 191, 128, 0.7)")}
				</>
			)}
		</div>
	);
};

export default PedalHistory;
