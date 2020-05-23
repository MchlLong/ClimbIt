/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Note to self: keep the APIs separate

// Convert location input to lat/long coordinates using Geocoding API
module.exports = 
{
    convert_to_coords: function () {
        const key = process.env.GOOGLE_API_KEY;
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?'
        let address = document.getElementById("address").value;
        address = JSON.stringify(address);
       
        // API call //
        axios.get(`${url}/address=${address}&key=${key}`)
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
    },

    // Get list of hikes within x miles of a given location using Hiking Project OR Transit&Trails API
    get_nearby_hikes: function (lat, long) {
        const key = process.env.HP_KEY;
         // const url =
        let distance = document.getElementById("distance").value;
       

        // API call //
   
        // Get list of hikes from Hiking API using axios

    }

}
    
 


