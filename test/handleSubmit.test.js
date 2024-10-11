import axios from 'axios';
import { handleFormSubmit, fetchCityLocation, calculateRemainingDays, fetchWeatherData, fetchCityImage } from '../src/client/js/handleSubmit'; // Adjust the import path accordingly

jest.mock('axios');

describe('Travel App Functions', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('fetchCityLocation should return correct data', async () => {
        const cityName = 'New York';
        const mockResponse = { data: { name: 'New York', longitude: -74.006, latitude: 40.7128 } };

        axios.post.mockResolvedValueOnce(mockResponse);

        const data = await fetchCityLocation(cityName);
        expect(data).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/getCityLoc", { city: cityName }, { headers: { "Content-Type": "application/json" } });
    });

    test('calculateRemainingDays should return the correct number of days', () => {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 5); // 5 days in the future

        const days = calculateRemainingDays(futureDate.toISOString().split('T')[0]);
        expect(days).toBe(5);
    });

    test('fetchWeatherData should return correct data', async () => {
        const mockResponse = { data: { temp: 25, app_max_temp: 30, app_min_temp: 20, description: 'Sunny' } };
        const latitude = 40.7128;
        const longitude = -74.006;

        axios.post.mockResolvedValueOnce(mockResponse);

        const data = await fetchWeatherData(latitude, longitude, 5);
        expect(data).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/getWeather", { lat: latitude, lng: longitude, Rdays: 5 });
    });

    test('fetchCityImage should return correct image URL', async () => {
        const mockResponse = { data: { image: 'http://example.com/city.jpg' } };
        const cityName = 'New York';

        axios.post.mockResolvedValueOnce(mockResponse);

        const image = await fetchCityImage(cityName);
        expect(image).toBe(mockResponse.data.image);
        expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/getCityPic", { city_name: cityName });
    });
});
