import axios from "axios";
import Swal from "sweetalert2";

// Form elements
const flightForm = document.querySelector("form");
const departureDateInput = document.querySelector("#flightDate");
const destinationInput = document.querySelector("#city");

const handleFormSubmit = async (event) => {
    event.preventDefault();

    const destination = destinationInput.value.trim();
    const departureDate = departureDateInput.value;

    // Check if city input is empty
    if (!destination) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a city.',
        });
        return;
    }

    // Check if date input is empty
    if (!departureDate) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a date.',
        });
        return;
    }

    const remainingDays = calculateRemainingDays(departureDate);

    // Check for past date
    if (remainingDays < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'The selected date is in the past. Please choose a future date.',
        });
        return;
    }

    try {
        const locationData = await fetchCityLocation(destination); 
        const { name, longitude, latitude } = locationData;

        const weatherData = await fetchWeatherData(latitude, longitude, remainingDays);
        const cityImage = await fetchCityImage(name);

        updateUserInterface(remainingDays, locationData.name, cityImage, weatherData);
    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error fetching data. Please try again later.',
        });
    }
};

// Fetch city location data from server
const fetchCityLocation = async (city) => {
    const { data } = await axios.post("http://localhost:8000/getCityLoc", { city }, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};

// Calculate the remaining days from the selected date
const calculateRemainingDays = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const timeDifference = selectedDate.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

// Fetch weather data from server
const fetchWeatherData = async (latitude, longitude, remainingDays) => {
    const { data } = await axios.post("http://localhost:8000/getWeather", { lat: latitude, lng: longitude, Rdays: remainingDays });
    return data;
};

// Fetch city image from server
const fetchCityImage = async (cityName) => {
    const { data } = await axios.post("http://localhost:8000/getCityPic", { city_name: cityName });
    return data.image;
};

// Update the remaining days
const updateDaysRemaining = (remainingDays) => {
    document.querySelector("#Rdays").innerHTML = `Your trip starts in ${remainingDays} days.`;
};

// Update the weather details in the UI
const updateWeatherDetails = (remainingDays, weather) => {
    const weatherMessage = remainingDays > 7 
        ? `Weather is: ${weather.description}` 
        : `Weather is expected to be: ${weather.description}`;
    
    document.querySelector(".weather").innerHTML = weatherMessage;
    document.querySelector(".temp").innerHTML = `Temperature: ${weather.temp} &deg;C`;
    
    if (remainingDays > 7) {
        document.querySelector(".max-temp").innerHTML = `Max-Temp: ${weather.app_max_temp}&deg;C`;
        document.querySelector(".min-temp").innerHTML = `Min-Temp: ${weather.app_min_temp}&deg;C`;
    }
};

// Update the city details in the UI
const updateCityDetails = (city, cityImage) => {
    document.querySelector(".cityName").innerHTML = `Location: ${city}`;
    document.querySelector(".cityPic").innerHTML = `<img src="${cityImage}" alt="An image representing the city's scenery">`;
};

// Update the UI with all relevant information
const updateUserInterface = (remainingDays, city, cityImage, weather) => {
    updateDaysRemaining(remainingDays);
    updateWeatherDetails(remainingDays, weather);
    updateCityDetails(city, cityImage);
    document.querySelector(".flight_data").style.display = "block";
};

export { handleFormSubmit, fetchCityLocation, calculateRemainingDays, fetchWeatherData, fetchCityImage };
