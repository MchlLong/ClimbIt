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
const port = 5500;


// Serve Static Pages
server.use(express.urlencoded());
server.use(express.json());
server.use(express.static("public"));

// Listener
server.listen(port, "127.0.0.1", () => {
    console.log("Server is listening");
    console.log(process.env.TEST);
});

// API 
server.get("/", (req, resp) => {
 
});

server.post("/get_hikes", (req, resp) => { 
    console.log("We got data");
    console.log(req.body);
    let arg = req.body;
    //console.log(arg);
    //data = api.convert_to_coords(arg);
    api.convert_to_coords(arg, 10)
    .then(data => {console.log("POST: " + data); resp.send(data)})
    .catch(error => console.log(error));
    //resp.send(JSON.stringify(api.convert_to_coords(arg, 10))); // from documentation to verify call is working
});