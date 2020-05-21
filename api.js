/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Note to self: keep the APIs separate

// These function names are awful right now bc I don't know what to name them // 
// Convert location input to lat/long coordinates using Geocoding API
function Geocoding(url) {
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Get latitude and longitude from Geocoding API
            const lat = JSON.stringify(data.results[0].geometry.location.lat);
            const long = JSON.stringify(data.results[0].geometry.location.lng);
            console.log(`Latitude: ${lat}, Longitude: ${long}`);   // for testing
        })
        .catch(error => {
            console.log("Geocoding API was not fetched :( ", error);
        })   
}

// Get list of hikes within x miles of a given location using Hiking Project OR Transit&Trails API
function HikingProject(url) {
 
    // Construct the headers
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', 'http://127.0.0.1:5500')

    // Get list of hikes from Hiking API
    fetch(HP_url, {
        credentials: 'include',
        method: 'GET',
        headers: headers,
        mode: 'cors' 
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Data: ${data}`);
        })
        .catch(error => {
            console.log("HikingProject API was not fetched :(", error);
        })
        
}