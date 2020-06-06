/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Server
*/

// Libraries and Modules Used
const express = require("express");
const dotenv = require("dotenv").config();
const axios = require("axios");
const api = require("./api.js");

// Definitions
const server = express();
const port = process.env.PORT || 5500;
const host = process.env.HOST || "0.0.0.0"

// Serve Static Pages
server.use(express.json());
server.use(express.static("public"));

// Listener for any input
server.listen(port, host, () => {
    console.log("Server is listening");
});

// API Wrapper Functions

// Route to handle fetching the initial list of hikes
// given an address (string) and a distance (int, in miles)
// return a list of hikes in the vicinity of the arguments
server.post("/get_hikes", (req, resp) => {                           // Receive a POST request with "/get_hikes" route
    api.convert_to_coords(req.body["address"], req.body["distance"]) // Invoke wrapper function with data from client
    .then(data => {resp.send(data); })                               // Send processed data from API wrapper
    .catch(error => console.log(error));                             // Log errors
});

// Route to handle fetching directions from an origin to a destination
// given an origin (string) and the destination, obtained previously from "/get_hikes"
// return a list of directions from the origin to the hike location
server.post("/get_directions", (req, resp) => {                     // Receive a POST request with "/get_hikes" route
    api.get_directions(req.body["origin"], req.body["destination"]) // Invoke wrapper function with data from client
    .then(data => {resp.send(data); })                              // Send processed data from API wrapper
    .catch(error => console.log(error));                            // Log errors
});

// Route to handle fetching weather from a latitude and longitude
// given a latitude (int) and a longitude (int),
// return several days of weater data at the latitude / longitude
server.post("/get_weather", (req, resp) => {            // Receive a POST request with "/get_hikes" route
    api.get_weather(req.body["lat"], req.body["long"])  // Invoke wrapper function with data from client
    .then(data => { resp.send(data); })                 // Send processed data from API wrapper       
    .catch(error => console.log(error));                // Log errors
});