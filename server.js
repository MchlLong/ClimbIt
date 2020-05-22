/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Server
*/


// Definitions
const axios = require('axios');
const express = require("express");
const dotenv = require("dotenv").config();
const server = express();
const port = 5500;

// Serve Static Pages
server.use(express.urlencoded());
server.use(express.static("public"));

// Listener
server.listen(port, "127.0.0.1", () => {
    console.log("Server is listening");
    console.log(process.env.TEST);
});

// API 
server.post("/givemetest", (req, resp) => {
    console.log("Sending off 'test'");
    resp.send('test response');
})