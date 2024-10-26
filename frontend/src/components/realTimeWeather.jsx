import React, { useState, useEffect } from "react";
import { getRealTimeWeather } from "../api";

const RealTimeWeather = ({ city }) => {
	const [weatherData, setWeatherData] = useState([]);

	useEffect(() => {
		const fetchWeatherData = async () => {
			const data = await getRealTimeWeather(city);
			setWeatherData(data);
		};
		fetchWeatherData();
	}, [city]);

	return (
		<div className="p-4 bg-white shadow-md rounded-lg my-4">
			<h2 className="text-2xl font-semibold mb-4">
				Real-Time Weather for {city}
			</h2>
			{weatherData.map((data, index) => (
				<div key={index} className="border-b pb-2 mb-2">
					<p>Temperature: {data.temp.toFixed(1)}°C</p>
					<p>Feels Like: {data.feels_like.toFixed(1)}°C</p>
					<p>Condition: {data.main}</p>
					<p>Time: {new Date(data.dt * 1000).toLocaleTimeString()}</p>
				</div>
			))}
		</div>
	);
};

export default RealTimeWeather;
