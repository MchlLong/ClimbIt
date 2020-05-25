/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Note to self: keep the APIs separate
const express = require("express");
const dotenv = require("dotenv").config();
const axios = require("axios");
const api = require("./api.js");
const server = express();
const port = 5500;

// Convert location input to lat/long coordinates using Geocoding API
module.exports = 
{
    convert_to_coords: function (arg, distance) {
        const key = process.env.GOOGLE_API_KEY;
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?'
        let address = arg;
        address = JSON.stringify(address);
        console.log("arg: " + arg);
        // API call //
        axios.get(`${url}address=${address}&key=${key}`)
        .then(response => {console.log("Got response: " + response); return response} )
        .then(proc => {
            // Get latitude and longitude from Geocoding API
            console.log("Beginning process of data");
            let test = proc["data"].results[0].geometry.location.lat;
            console.log(test);
            return test;
            //return this.get_nearby_hikes(proc["data"].results[0].geometry.location.lat, proc["data"].results[0].geometry.location.lng, distance)
            //const lat = JSON.stringify(data.results[0].geometry.location.lat);
            //const long = JSON.stringify(data.results[0].geometry.location.lng);
            //console.log(`Latitude: ${lat}, Longitude: ${long}`);   // for testing
        })
        .catch(error => {
            console.log("Geocoding API was not fetched :( ", error);
        });
    },

    // Get list of hikes within x miles of a given location using Hiking Project OR Transit&Trails API
    get_nearby_hikes: function (lat, long, dist) {
        const key = process.env.HP_KEY;
         // const url =
        // let distance = document.getElementById("distance").value;s
       

        // API call //
   
        // Get list of hikes from Hiking API using axios

    }

}
    
 


