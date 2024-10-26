import React, { useState, useEffect } from "react";
import { getDailySummary } from "../api";

const WeatherSummary = ({ city }) => {
	const [summary, setSummary] = useState([]);

	useEffect(() => {
		const fetchSummary = async () => {
			const data = await getDailySummary(city);
			setSummary(data);
		};
		fetchSummary();
	}, [city]);

	return (
		<div className="p-4 bg-white shadow-md rounded-lg my-4">
			<h2 className="text-2xl font-semibold mb-4">
				Daily Summary for {city}
			</h2>
			{summary.map((day, index) => (
				<div key={index} className="border-b pb-2 mb-2">
					<p>Date: {new Date(day.date).toLocaleDateString()}</p>
					<p>Average Temp: {day.avg_temp.toFixed(1)}°C</p>
					<p>Max Temp: {day.max_temp.toFixed(1)}°C</p>
					<p>Min Temp: {day.min_temp.toFixed(1)}°C</p>
					<p>Dominant Weather: {day.dominant_weather}</p>
				</div>
			))}
		</div>
	);
};

export default WeatherSummary;
