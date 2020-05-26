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

// Serve Static Pages
server.use(express.urlencoded());
server.use(express.json());
server.use(express.static("public"));

// Listener
server.listen(port, "127.0.0.1", () => {
    console.log("Server is listening");
});

// API Wrapper Functions
server.post("/get_hikes", (req, resp) => { 
    api.convert_to_coords(req.body["address"], req.body["distance"])
    .then(data => {resp.send(data);})
    .catch(error => console.log(error));
});