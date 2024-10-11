const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const SERVER_PORT = 8000;

const geoNamesUser = process.env.USER_NAME;
const weatherApiKey = process.env.WEATHER_KEY;
const pixabayApiKey = process.env.PIXABAY_KEY;

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

const fetchLocation = async (city, user) => {
  try {
    const response = await axios.get(
      `https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${user}`
    );
    const { geonames } = response.data;
    const { name, lat, lng } = geonames[0];
    return { name, lat, lng };
  } catch (error) {
    throw new Error("Error fetching city location");
  }
};

const fetchCityImage = async (city, apiKey) => {
  try {
    console.log(city, apiKey, " fetchCityImage");
    const { data } = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${city}&image_type=photo`
    );
    const imageUrl = data.hits[0]
      ? data.hits[0].webformatURL
      : "https://unsplash.com/photos/beige-concrete-building-near-cars-HhmCIJTLuGY";
    return { image: imageUrl };
  } catch (error) {
    throw new Error("Error fetching city picture");
  }
};

const fetchWeatherData = async (latitude, longitude, remainingDays, apiKey) => {
  try {
    if (remainingDays < 0) {
      return {
        message: "Date cannot be in the past",
        error: true,
      };
    }

    if (remainingDays > 0 && remainingDays <= 7) {
      const { data } = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&units=M&key=${apiKey}`
      );
      const { weather, temp } = data.data[data.data.length - 1];
      const { description } = weather;
      return { description, temp };
    } else if (remainingDays > 7) {
      const { data } = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&units=M&days=${remainingDays}&key=${apiKey}`
      );
      const { weather, temp, app_max_temp, app_min_temp } = data.data[data.data.length - 1];
      const { description } = weather;
      return { description, temp, app_max_temp, app_min_temp };
    }
  } catch (error) {
    throw new Error("Error fetching weather data");
  }
};

app.post("/getLoc", async (req, res) => {
  console.log(req.body); 
  const { city } = req.body;

  if (!city) {
    return res.status(400).send({ error: "City name is required" });
  }

  try {
    const locationData = await fetchLocation(city, geoNamesUser);
    res.send(locationData); 
  } catch (error) {
    console.error("Error fetching city location:", error);
    res.status(500).send({ error: "Error fetching city location" });
  }
});

app.post("/getWeather", async (req, res) => {
  console.log("Received weather request:");
  console.log(req.body);
  const { lat, lng, Rdays } = req.body;

  try {
    const weatherInfo = await fetchWeatherData(lat, lng, Rdays, weatherApiKey);
    res.send(weatherInfo);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send({ error: "Error fetching weather data" });
  }
});

app.post("/getPic", async (req, res) => {
  console.log("Received city picture request:");
  const { city_name } = req.body;
  console.log(city_name, "server.js"); 

  if (!city_name) {
    return res.status(400).send({ error: "City name is required" });
  }

  try {
    const imageData = await fetchCityImage(city_name, pixabayApiKey);
    res.send(imageData); 
  } catch (error) {
    console.error("Error fetching city picture:", error);
    res.status(500).send({ error: "Error fetching city picture" });
  }
});

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}`));
