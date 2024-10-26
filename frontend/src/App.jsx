import React, { useState } from "react";
import WeatherSummary from "./components/weatherSummary";
import RealTimeWeather from "./components/realTimeWeather";
import AlertThreshold from "./components/alertThreshold";

function App() {
	const [city, setCity] = useState("Delhi");

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				Weather Monitoring System
			</h1>
			<div className="mb-4">
				<label className="mr-2 font-semibold">Select City:</label>
				<select
					value={city}
					onChange={(e) => setCity(e.target.value)}
					className="p-2 border rounded"
				>
					<option>Delhi</option>
					<option>Mumbai</option>
					<option>Chennai</option>
					<option>Bangalore</option>
					<option>Kolkata</option>
					<option>Hyderabad</option>
				</select>
			</div>
			<WeatherSummary city={city} />
			<RealTimeWeather city={city} />
			<AlertThreshold city={city} />
		</div>
	);
}

export default App;
