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
    convert_to_coords: function (address, distance) {
        const key = process.env.GOOGLE_API_KEY;
        const url = "https://maps.googleapis.com/maps/api/geocode/json?";
        // Sets distance to 50 miles and address to Oregon if they aren't given
        if(!distance) 
            distance = 50;
        if(!address)
            address = "Oregon";
        _address = JSON.stringify(address);
        // API call //
        return axios.get(`${url}address=${_address}&key=${key}`)
        .then(response => {return response;} )
        .then(proc => {
            // Get latitude and longitude from Geocoding API
            let lat = proc["data"].results[0].geometry.location.lat;
            let long = proc["data"].results[0].geometry.location.lng;
            return this.get_nearby_hikes(lat, long, distance);
        })
        .catch(error => {
            console.log("Geocoding API was not fetched", error);
        });
    },

    // Get list of hikes within x miles of a given location using REI Hiking Project API
    get_nearby_hikes: function (lat, long, dist) {
        const key = process.env.REI_API_KEY;
        const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${key}`;
        return axios.get(url)
        .then (response => { return response["data"].trails; })
        .catch(error => console.log(error));
    },

    get_directions: function (origin, destination) {
        const key = process.env.GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}`;
        return axios.get(url)
        .then (response => { return response["data"]; })
        .catch(error => console.log(error));
    },

    // Weather Functionality
    get_weather: function (lat, long) {
        const key = process.env.WEATHER_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${key}`;
        const url_cur = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=currently,minutely,daily&appid=${key}`;

        // Constants for converting time
        // Reads previous unit converted to new unit
        const ms_hr = 36 * (10**5); // milliseconds in an hour
        const ms_day = ms_hr * 24;  // milliseconds in a day
        const hr_day = 24;          // hours in a day
        const ms = 10**3;           // milliseconds scalar

        return axios.get(url)
        .then (resp => {

            var time_now = (resp["data"].list[0]["dt"] * ms);
            let time_zone = (resp["data"].city.timezone) * ms;
            console.log(time_zone);
            if (time_zone < 0)
                var cur_midnight = time_now - (time_now % ms_day) - (time_zone) - ms_day;
            else
                var cur_midnight = time_now - (time_now % ms_day) - (time_zone);

            var tom_midnight = cur_midnight + ms_day;
            console.log(cur_midnight);
            // Usage of the day object
            // var ret_week = {"time": "", "weather": "", "temp": "", "min_temp": "", "max_temp": ""};
            var ret = [];
            var time_slots = [];

            for (let i=0; i<5; i++){
                for (let j=5; j<20; j++){
                    time_slots.push(cur_midnight + (ms_day * i) + (ms_hr * j));
                }
            }
            console.log(time_slots);
            // Gather current day data (multiply by 10^3 (or 10**3) since the response is different than the output data)
            // Seconds vs Milliseconds

            for (let i=0; i<(resp["data"].list).length; i++) {
                let vals = (resp["data"].list[i]["dt"])*ms;
                // Four day forecast data
                for (let j=0; j<time_slots.length; j++){
                    if (vals === time_slots[j]) {
                        let ret_week = {};
                        ret_week["time"] = ((resp["data"].list[i]["dt"]) * ms) + time_zone;
                        ret_week["temp"] = resp["data"].list[i]["main"]["temp"];
                        ret_week["min_temp"] = resp["data"].list[i]["main"]["temp_min"];
                        ret_week["max_temp"] = resp["data"].list[i]["main"]["temp_max"];
                        ret_week["weather"] = resp["data"].list[i]["weather"][0]["main"];
                        ret.push(ret_week);
                    }
                }
            }
            console.log(ret);
            return ret;
        })
        .catch(error => console.log(error));

    },

    // Air Index Functionality
    get_air: function (lat, long) {
        return 0;
    }

}
    
 


