const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const { WeatherData, DailySummary } = require("./models");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
	.connect(
		"mongodb+srv://sarang:sarang123@cluster0.au98o.mongodb.net/zeotap-task-2",
        // "mongodb+srv://parth:Nkba17612@cluster0.wfhql.mongodb.net/Racquet_Buddy",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

const fetchWeatherData = async () => {
	const cities = [
		"Delhi",
		"Mumbai",
		"Chennai",
		"Bangalore",
		"Kolkata",
		"Hyderabad",
	];
	for (const city of cities) {
		try {
			const response = await axios.get(
				`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4708575a144fd2c3a71d6200fb1c6c30`
			);
			const { temp, feels_like } = response.data.main;
			const main = response.data.weather[0].main;

			const weatherData = new WeatherData({
				city,
				temp: temp - 273.15,
				feels_like: feels_like - 273.15,
				main,
				dt: response.data.dt,
			});
			await weatherData.save();
		} catch (error) {
			console.error(`Error fetching data for ${city}:`, error.message);
		}
	}
};

cron.schedule("*/5 * * * *", fetchWeatherData);

const calculateDailySummary = async (city) => {
	const currentDate = new Date().toISOString().split("T")[0];
	const weatherData = await WeatherData.find({
		city,
		createdAt: { $gte: new Date(currentDate) },
	});

	if (weatherData.length === 0) return;

	const avg_temp =
		weatherData.reduce((acc, data) => acc + data.temp, 0) /
		weatherData.length;
	const max_temp = Math.max(...weatherData.map((data) => data.temp));
	const min_temp = Math.min(...weatherData.map((data) => data.temp));
	const dominant_weather = weatherData
		.map((data) => data.main)
		.sort(
			(a, b) =>
				weatherData.filter((v) => v === a).length -
				weatherData.filter((v) => v === b).length
		)
		.pop();

	const dailySummary = new DailySummary({
		city,
		date: new Date(currentDate),
		avg_temp,
		max_temp,
		min_temp,
		dominant_weather,
	});

	await dailySummary.save();
};


app.get("/api/daily_summary/:city", async (req, res) => {
	try {
		const { city } = req.params;
		const summary = await DailySummary.find({ city }).sort({ date: -1 });
		res.status(200).json(summary);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching daily summary",
			error: error.message,
		});
	}
});

app.post("/api/calculate_summary/:city", async (req, res) => {
	try {
		const { city } = req.params;
		await calculateDailySummary(city);
		res.status(200).json({
			message: `Daily summary calculated for ${city}`,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error calculating summary",
			error: error.message,
		});
	}
});

app.get("/api/weather_data/:city", async (req, res) => {
	try {
		const { city } = req.params;
		const data = await WeatherData.find({ city })
			.sort({ createdAt: -1 })
			.limit(10);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching weather data",
			error: error.message,
		});
	}
});

app.post("/api/evaluate_threshold", async (req, res) => {
	const { city, threshold } = req.body;
	console.log(city, threshold);

	try {
		const latestData = await WeatherData.find({ city })
			.sort({ createdAt: -1 })
			.limit(2);
		if (latestData.length < 2) {
			return res
				.status(400)
				.json({ message: "Not enough data to evaluate threshold" });
		}

		const alertTriggered = latestData.every(
			(data) => data.temp > threshold
		);
		res.status(200).json({
			message: alertTriggered
				? "Alert triggered: temperature exceeded threshold"
				: "No alert triggered",
			alert: alertTriggered,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error evaluating threshold",
			error: error.message,
		});
	}
});

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
