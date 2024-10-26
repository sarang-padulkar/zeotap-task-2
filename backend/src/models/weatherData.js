const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weatherDataSchema = new Schema({
    city: { type: String, required: true },
    temp: { type: Number, required: true },      
    feels_like: { type: Number, required: true }, 
    main: { 
        type: String, 
        required: true,
        enum: ["Clear", "Clouds", "Rain", "Snow", "Thunderstorm", "Drizzle", "Mist", "Smoke", "Haze", "Dust", "Fog", "Sand", "Ash", "Squall", "Tornado"]
    },                                              
    dt: { type: Number, required: true },           
    createdAt: { type: Date, default: Date.now }   
});

module.exports = mongoose.model("WeatherData", weatherDataSchema);
