/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

//require('../api.js');

/* Listeners */

    // Home Button Functionality
    var home_buttons = document.getElementsByClassName("navto_home_page");
    for (var i = 0; i < home_buttons.length; i++) {
        home_buttons[i].addEventListener("click", function() { swap_page("home_page") });
    }

    // Details Button Functionality
    var details_buttons = document.getElementsByClassName("navto_hike_detail_page");
    for (var i = 0; i < details_buttons.length; i++) {
        details_buttons[i].addEventListener("click", function() { swap_page("hike_detail_page") });
    }

    // Map Button Functionality
    var map_buttons = document.getElementsByClassName("navto_hike_map_page");
    for (var i = 0; i < map_buttons.length; i++) {
        map_buttons[i].addEventListener("click", function() { swap_page("hike_map_page") });
    }

    // Directions Button Functionality
    var directions_buttons = document.getElementsByClassName("navto_directions_page");
    for (var i = 0; i < directions_buttons.length; i++) {
        directions_buttons[i].addEventListener("click", function() { swap_page("directions_page") });
    }

    // Air Button Functionality
    var air_buttons = document.getElementsByClassName("navto_air_page");
    for (var i = 0; i < air_buttons.length; i++) {
        air_buttons[i].addEventListener("click", function() { swap_page("air_page") });
    }

    // Weather Button Functionality
    var weather_buttons = document.getElementsByClassName("navto_weather_page");
    for (var i = 0; i < weather_buttons.length; i++) {
        weather_buttons[i].addEventListener("click", function() { swap_page("weather_page") });
    }

   
    // Find Hike Button Functionality
    var find_hike_button = document.getElementsByClassName("find-hikes");
    find_hike_button[0].addEventListener("click", function() { convertToCoords() } ); 

/* Webpage Controller Functions */

    // Function to hide all pages, then make a page visible
    function swap_page(to_go) {

        // Remove all visibility from pages
        let pages = document.getElementsByClassName("visible");
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.add("invisible");
            pages[i].classList.remove("visible");
        }

        // Make "to_go" page visible
        let current = document.getElementsByClassName(to_go);
        for (var i = 0; i < current.length; i++) {
            current[i].classList.add("visible");
            current[i].classList.remove("invisible");
        }

    }

/* API Controller Functions */

// Note to self: keep these separated by API

// Convert location input to lat/long coordinates using Geocoding API
function convertToCoords() {

    event.preventDefault();  // for testing
    let address = document.getElementById("address").value;
    address = JSON.stringify(address);
    let key = process.env.GOOGLE_API_KEY; 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`

   // api call
   // const coords = Geocoding(url);  // returns lat, long
}

// Get list of hikes within x miles of a given location using Hiking Project OR Transit&Trails API
function getNearbyHikes(lat, long) {
    let distance = document.getElementById("distance").value;
  //  const TT_key = process.env.TRANSITTRAILS_API_KEY;
    const HP_key = process.env.HIKINGPROJ_API_KEY;
  //  let TT_url = `https://api.transitandtrails.org/api/v1/trailheads.xml?latitude=${lat}&longitude=${long}&distance=${distance}&key=${TT_key}`;
    let HP_url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${distance}&key=${HP_key}`

    // api call 
    //HikingProject(url)
}

 

    
 

