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

    //checking if the function is working fine
    console.log("I am working fine");

    //get the location first and make sure call is successful
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

    const Weather = await getWeather(lat, lng , Rdays);
    const pic = await getCityPic(name);
    console.log("Pic", pic);
    
    updateUI(Rdays, Location.name, pic, Weather);
};

const getCityLoc = async (city) => {
    const { data } = await axios.post("http://localhost:8000/getCityLoc", { city }, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return data;
}

// calculate number of days from today to the selected date
const getRdays = (date) => {
    const startDate = new Date();
    const endDate = new Date(date);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

// getting the weather 
const getWeather = async (lat, lng, Rdays) => {
    const { data } = await axios.post("http://localhost:8000/getWeather", {
        lat, 
        lng,
        Rdays,
    });
    return data;
};

// getting the city picture from pixabay
const getCityPic = async (city_name) => {
    const { data } = await axios.post("http://localhost:8000/getCityPic", {
        city_name,
    });
    const { image } = await data;
    return image;
};

const updateDaysInfo = (Rdays) => {
    document.querySelector("#Rdays").innerHTML = `
    Your trip starts in ${Rdays} days from now
  `;
};

const updateWeatherInfo = (Rdays, weather) => {
    document.querySelector(".weather").innerHTML =
        Rdays > 7
        ? `Weather is: ${weather.description}`
        : `Weather is expected to be: ${weather.description}`;
    document.querySelector(".temp").innerHTML =
        Rdays > 7
        ? `Forecast: ${weather.temp}&degC`
        : `Temperature: ${weather.temp} &deg C`;
    document.querySelector(".max-temp").innerHTML =
        Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
    document.querySelector(".min-temp").innerHTML =
        Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";
};

const updateCityInfo = (city, pic) => {
    document.querySelector(".cityName").innerHTML = `Location: ${city}`;
    document.querySelector(".cityPic").innerHTML = `
    <img 
    src="${pic}" 
    alt="an image that describes the city nature"
    >
  `;
};

const updateUI = (Rdays, city, pic, weather) => {
    updateDaysInfo(Rdays);
    updateWeatherInfo(Rdays, weather);
    updateCityInfo(city, pic);
    document.querySelector(".flight_data").style.display = "block";
};

export { handleSubmit };
