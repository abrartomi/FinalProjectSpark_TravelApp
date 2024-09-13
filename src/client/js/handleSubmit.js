import axios from "axios";
import Swal from "sweetalert2"; 

const form = document.querySelector("form");
const dateInp = document.querySelector("#flightDate");
const cityInp = document.querySelector("#city");

const handleSubmit = async (e) => {
    e.preventDefault();

    const city = cityInp.value.trim();
    const date = dateInp.value;

    
    if (!city) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a city.',
        });
        return;
    }

   
    if (!date) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a date.',
        });
        return;
    }

    console.log("I am working fine"); 

    
    const Location = await getCityLoc(city); 
    const { name, lng, lat } = Location;
    const Rdays = getRdays(date);

    
    if (Rdays < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Date',
            text: 'The selected date is in the past. Please choose a future date.',
        });
        return;
    }

    
    const Weather = await getWeather(lat, lng, Rdays);
    const pic = await getCityPic(name);
    console.log("Pic", pic);

    
    updateUI(Rdays, Location.name, pic, Weather);
};


const getCityLoc = async (city) => {
    const { data } = await axios.post("http://localhost:8000/getCityLoc", { city }, {
        headers: { "Content-Type": "application/json" },
    });
    return data;
};


const getRdays = (date) => {
    const startDate = new Date();
    const endDate = new Date(date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};


const getWeather = async (lat, lng, Rdays) => {
    const { data } = await axios.post("http://localhost:8000/getWeather", { lat, lng, Rdays });
    return data;
};


const getCityPic = async (city_name) => {
    const { data } = await axios.post("http://localhost:8000/getCityPic", { city_name });
    return data.image;
};


const updateDaysInfo = (Rdays) => {
    document.querySelector("#Rdays").innerHTML = `Your trip starts in ${Rdays} days from now`;
};


const updateWeatherInfo = (Rdays, weather) => {
    const weatherInfo = Rdays > 7 
        ? `Weather is: ${weather.description}` 
        : `Weather is expected to be: ${weather.description}`;
    
    document.querySelector(".weather").innerHTML = weatherInfo;
    document.querySelector(".temp").innerHTML = `Temperature: ${weather.temp} &degC`;
    
    if (Rdays > 7) {
        document.querySelector(".max-temp").innerHTML = `Max-Temp: ${weather.app_max_temp}&degC`;
        document.querySelector(".min-temp").innerHTML = `Min-Temp: ${weather.app_min_temp}&degC`;
    }
};


const updateCityInfo = (city, pic) => {
    document.querySelector(".cityName").innerHTML = `Location: ${city}`;
    document.querySelector(".cityPic").innerHTML = `<img src="${pic}" alt="An image describing the city's nature">`;
};


const updateUI = (Rdays, city, pic, weather) => {
    updateDaysInfo(Rdays);
    updateWeatherInfo(Rdays, weather);
    updateCityInfo(city, pic);
    document.querySelector(".flight_data").style.display = "block";
};

export { handleSubmit };
