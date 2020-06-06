/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Packages/Modules
const axios = require("axios");

module.exports = 
{
    // Convert location input to lat/long coordinates using Geocoding API
    // return values of latitude "lat", and longitude "long" will be then
    // used by most of the other API calls
    convert_to_coords: function (address, distance) {

        const key = process.env.GOOGLE_API_KEY;                             // Google API key in ".env"
        const url = "https://maps.googleapis.com/maps/api/geocode/json?";   // URL to get geocoding data from

        // Sets distance to 50 miles and address to Oregon if they aren't given
        // These checks are moreso incase the requests are sent directly from
        // somewhere other than our application
        if (!distance)                      // Default distance to 50 if distance is 0 or not provided
            distance = 50;                  // Default to 50
        if (!address)                       // Default address to Oregon if address isn't provided
            address = "Oregon";             // Default to "Oregon"
        _address = JSON.stringify(address); // Convert address from JSON to string

        return axios.get(`${url}address=${_address}&key=${key}`)        // Call API
        .then(resp => {                                                 // Use response data to get latitude and longitude
            let lat = resp["data"].results[0].geometry.location.lat;    // Get latitude from Geocoding response
            let long = resp["data"].results[0].geometry.location.lng;   // Get longtiude from Geocoding response
            return this.get_nearby_hikes(lat, long, distance);          // Use the latitude and longitude to get the list of hikes to "server.js"
        })
        .catch(error => console.log("Geocoding API was not fetched", error));        // Log errors
    },

    // Get list of hikes within distance "dist" miles of a given location using REI Hiking Project API
    get_nearby_hikes: function (lat, long, dist) {

        const key = process.env.REI_API_KEY;                          // REI Hiking Project API key in ".env"
        const url = "https://www.hikingproject.com/data/get-trails";  // URL to get hiking data from

        return axios.get(`${url}?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${key}`) // Call API
        .then (response => { return response["data"].trails; })                          // Return only the trail data
        .catch(error => console.log(error));                                             // Log errors
    },

    // Call Google Geocoding API to get the list of directions and return to client
    get_directions: function (origin, destination) {

        const key = process.env.GOOGLE_API_KEY;                             // Google API Key in ".env"
        const url = `https://maps.googleapis.com/maps/api/directions/json`; // URL to get Google directions data from

        return axios.get(`${url}?origin=${origin}&destination=${destination}&key=${key}`) // Call API
        .then (response => { return response["data"]; })                                  // Return response data to "server.js"
        .catch(error => console.log(error));                                              // Log errors
    },

    // Weather Functionality

    // Fetch weather data from Weather API and return to client the:
    // time, temperature, minimum temperature, maximum temperature, and
    // text description of the weather
    get_weather: function (lat, long) {

        const key = process.env.WEATHER_KEY;                                                                // Weather API key in ".env"
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${key}`; // URL to get weather data from                                     

        // Constants for converting time
        // Reads previous unit converted to new unit
        const ms_hr = 36 * (10**5); // milliseconds in an hour
        const ms_day = ms_hr * 24;  // milliseconds in a day
        const hr_day = 24;          // hours in a day
        const ms = 10**3;           // milliseconds scalar

        return axios.get(url)       // Call API
        .then (resp => {            // Process API data

            var time_now = (resp["data"].list[0]["dt"] * ms);                   // Take the GMT Time Zone in seconds and convert to milliseconds
            let time_zone = (resp["data"].city.timezone) * ms;                  // Get the Timezone offset and convert to milliseconds
            var cur_midnight = time_now - (time_now % ms_day) - (time_zone);    // Calculate when midnight is to determine which times to acces
            var tom_midnight = cur_midnight + ms_day;                           // Calculate tomorrow's midnight relative to the time zone for timezones that aren't on the same day
            var ret = [];                                                       // Usage of day object: {"time": "", "weather": "", "temp": "", "min_temp": "", "max_temp": ""}
            var time_slots = [];                                                // Calculate the minimum time (5:00am) to maximum time (8:00pm) for weather

            for (let i=0; i<5; i++){                                            // Grab five weather calls from earliest time to latest
                for (let j=5; j<20; j++){                                       // Grab a range of 17 time slots, since time zones end up being relative +1 or -1 hour per 3 hour intervals
                    time_slots.push(cur_midnight + (ms_day * i) + (ms_hr * j)); // Add the calculated time slot, offset by days in milliseconds "i", and hours in milliseconds "j"
                }
            }

            // Gather current day data (multiply by 10^3 (or 10**3) since the response is different than the output data)
            // Seconds vs Milliseconds

            for (let i=0; i<(resp["data"].list).length; i++) {                                  // Loop through each entry in the API response
                let vals = (resp["data"].list[i]["dt"]) * ms;                                   // Convert the data from seconds to milliseconds     
                for (let j=0; j<time_slots.length; j++){                                        // Check each calculated time slot against the data from the API
                    if (vals === time_slots[j]) {                                               // If a timeslot matches the API time, add that data to return
                        let ret_week = {};                                                      // Empty object to push to return value "ret"
                        ret_week["time"] = ((resp["data"].list[i]["dt"]) * ms) + time_zone;     // Add time to return object
                        ret_week["temp"] = resp["data"].list[i]["main"]["temp"];                // Add temperature to return object
                        ret_week["min_temp"] = resp["data"].list[i]["main"]["temp_min"];        // Add minimum temperature to return object
                        ret_week["max_temp"] = resp["data"].list[i]["main"]["temp_max"];        // Add maximum temperature to return object
                        ret_week["weather"] = resp["data"].list[i]["weather"][0]["main"];       // Add the text description of weather to return object
                        ret.push(ret_week);                                                     // Add object to the return value "ret"
                    }
                }
            }
            return ret;                                                                         // Return "ret" back to the "server.js" to send to client
        })
        .catch(error => console.log(error));                                                    // Log errors

    },

}
    
 


