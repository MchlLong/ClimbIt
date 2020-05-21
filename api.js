/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Note to self: keep these calls separate

// Convert location input to lat/long coordinates using Geocoding API
function convertToCoords() {

    event.preventDefault();  // for testing
    let address = document.getElementById("address").value;
    address = JSON.stringify(address);
    let key = secrets.GOOGLE_API_KEY; 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`

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
function getNearbyHikes(lat, long) {
    let distance = document.getElementById("distance").value;
  //  const TT_key = secrets.TRANSITTRAILS_API_KEY;
    const HP_key = secrets.HIKINGPROJ_API_KEY;
  //  let TT_url = `https://api.transitandtrails.org/api/v1/trailheads.xml?latitude=${lat}&longitude=${long}&distance=${distance}&key=${TT_key}`;
    let HP_url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${distance}&key=${HP_key}`

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