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

    // Display a map centered on the hike's coordinates
    get_map: function (lat, long) {
        const key = process.env.GOOGLE_API_KEY;
        const static_url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=10&size=400x400&maptype=terrain&key=${key}`;
        return axios.get(static_url)
        .then (response => { return response; })
        .then (data => console.log(data.config.url))
        .catch(error => console.log(error));
    },

    // Weather Functionality
    get_weather: function (lat, long) { 
        const key = process.env.WEATHER_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${key}`;
        return axios.get(url)
        // "list" indices 0 ~ . . ., list[0].main["temp_min"], list.main["temp_max"], list.main["temp"], list[0].weather[0].main
        // dt_txt is the date and time
        // weather 
        .then (resp => { 
            return resp["list"];
        })
        .catch(error => console.log(error));
    },

    // Air Index Functionality
    get_air: function (lat, long) {
        return 0;
    }

}
    
 


