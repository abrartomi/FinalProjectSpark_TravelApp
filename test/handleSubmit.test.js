import axios from 'axios';
import Swal from 'sweetalert2';
import { handleSubmit } from '../src/client/js/handleSubmit';


document.body.innerHTML = `
  <form>
    <input id="flightDate" value="2024-12-01">
    <input id="city" value="New York">
    <button type="submit">Submit</button>
  </form>
  <div id="Rdays"></div>
  <div class="weather"></div>
  <div class="temp"></div>
  <div class="max-temp"></div>
  <div class="min-temp"></div>
  <div class="cityName"></div>
  <div class="cityPic"></div>
  <div class="flight_data"></div>
`;

jest.mock('axios');
jest.mock('sweetalert2');

describe('handleSubmit', () => {
  beforeEach(() => {
   
    jest.resetAllMocks();
  });

  test('should handle form submission', async () => {
   
  });

  test('should handle missing city', async () => {
    
    document.querySelector("#city").value = '';
   
  });

  test('should handle missing date', async () => {
   
    document.querySelector("#flightDate").value = '';
   
  });

  test('should handle invalid date', async () => {
    
    document.querySelector("#flightDate").value = '2023-01-01';
    
  });
});
axios.post.mockResolvedValue({
    data: {
      name: 'New York',
      lng: -74.006,
      lat: 40.7128
    }
  });
  Swal.fire = jest.fn();
