/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Server
*/

// Definitions
const express = require("express");
const dotenv = require("dotenv").config();
const axios = require("axios");
const api = require("./api.js");
const server = express();
const port = process.env.PORT || 5500;
const host = process.env.HOST || "0.0.0.0"

// Serve Static Pages
//server.use(express.urlencoded());
server.use(express.json());
server.use(express.static("public"));

// Listener
server.listen(port, host, () => {
    console.log("Server is listening");
});

// API Wrapper Functions
server.post("/get_hikes", (req, resp) => { 
    api.convert_to_coords(req.body["address"], req.body["distance"])
    .then(data => {resp.send(data);})
    .catch(error => console.log(error));
});

server.post("/get_map", (req, resp) => { 
    console.log("lat from server.js: " + req.body["lat"]);
    console.log("long from server.js: " + req.body["long"]);

    api.get_map(req.body["lat"], req.body["long"])
    .then(data => {resp.send(data);})
    .catch(error => console.log(error));
});