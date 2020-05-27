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

        console.log("lat from api.js: " + lat);
        console.log("long from api.js: " + long);

      //  const JS_url = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

        // changed center to Portland,Oregon for now instead of ${lat},${long} until I can figure out why they are undefined
        const static_url = `https://maps.googleapis.com/maps/api/staticmap?center=Portland,Oregon&zoom=10&size=400x400&maptype=terrain&key=${key}`;

        return axios.get(static_url)
        .then (response => { return response; })
        .then (data => console.log(data.config.url))
        .catch(error => console.log(error));
    }
}
    
 


