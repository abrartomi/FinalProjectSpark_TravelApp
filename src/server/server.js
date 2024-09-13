const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const port = 8000;

const username = process.env.USER_NAME;
const weather_key = process.env.WEATHER_KEY;
const pixabay_key = process.env.PIXABAY_KEY;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});


const getCityLoc = async (city, username) => {
  try {
    const response = await axios.get(
      `https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`
    );
    const { geonames } = response.data;
    const { name, lat, lng } = geonames[0];
    return { name, lat, lng };
  } catch (error) {
    throw new Error("Error fetching city location");
  }
};


const getCityPic = async (city, key) => {
  try {
    console.log(city, key, " getCityPic");
    const { data } = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${city}&image_type=photo`
    );
    const image = data.hits[0]
      ? data.hits[0].webformatURL
      : "https://unsplash.com/photos/beige-concrete-building-near-cars-HhmCIJTLuGY";
    return { image };
  } catch (error) {
    throw new Error("Error fetching city picture");
  }
};


const getWeather = async (lat, lng, Rdays, key) => {
  try {
    if (Rdays < 0) {
      return {
        message: "Date cannot be in the past",
        error: true,
      };
    }

    if (Rdays > 0 && Rdays <= 7) {
      const { data } = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&units=M&key=${key}`
      );
      const { weather, temp } = data.data[data.data.length - 1];
      const { description } = weather;
      return { description, temp };
    } else if (Rdays > 7) {
      const { data } = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&units=M&days=${Rdays}&key=${key}`
      );
      const { weather, temp, app_max_temp, app_min_temp } = data.data[data.data.length - 1];
      const { description } = weather;
      return { description, temp, app_max_temp, app_min_temp };
    }
  } catch (error) {
    throw new Error("Error fetching weather data");
  }
};


app.post("/getCityLoc", async (req, res) => {
  console.log(req.body); 
  const { city } = req.body;

  if (!city) {
    return res.status(400).send({ error: "City name is required" });
  }

  try {
    const location = await getCityLoc(city, username);
    res.send(location); 
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
    const weather = await getWeather(lat, lng, Rdays, weather_key);
    res.send(weather);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send({ error: "Error fetching weather data" });
  }
});


app.post("/getCityPic", async (req, res) => {
  console.log("Received city picture request:");
  const { city_name } = req.body;
  console.log(city_name, "server.js"); 

  if (!city_name) {
    return res.status(400).send({ error: "City name is required" });
  }

  try {
    const image = await getCityPic(city_name, pixabay_key);
    res.send(image); 
  } catch (error) {
    console.error("Error fetching city picture:", error);
    res.status(500).send({ error: "Error fetching city picture" });
  }
});


app.listen(port, () => console.log(`Server is listening on port ${port}`));
