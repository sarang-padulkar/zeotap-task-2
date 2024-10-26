import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export const getDailySummary = async (city) => {
	const response = await axios.get(`${API_BASE_URL}/daily_summary/${city}`);
	return response.data;
};

export const getRealTimeWeather = async (city) => {
	const response = await axios.get(`${API_BASE_URL}/weather_data/${city}`);
	return response.data;
};

export const evaluateThreshold = async (city, threshold) => {
	const response = await axios.post(`${API_BASE_URL}/evaluate_threshold`, {
		city,
		threshold,
	});
	return response.data;
};
