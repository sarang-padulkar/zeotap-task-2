const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dailySummarySchema = new Schema({
	city: { type: String, required: true },
	date: { type: Date, required: true },
	avg_temp: { type: Number, required: true },
	max_temp: { type: Number, required: true },
	min_temp: { type: Number, required: true },
	dominant_weather: {
		type: String,
		required: true,
		enum: [
			"Clear",
			"Clouds",
			"Rain",
			"Snow",
			"Thunderstorm",
			"Drizzle",
			"Mist",
			"Smoke",
			"Haze",
			"Dust",
			"Fog",
			"Sand",
			"Ash",
			"Squall",
			"Tornado",
		],
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

dailySummarySchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("DailySummary", dailySummarySchema);
