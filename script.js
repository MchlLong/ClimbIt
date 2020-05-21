/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

/* Listeners */

    // Home Button Functionality
    var home_buttons = document.getElementsByClassName("navto_home_page");
    for (var i = 0; i < home_buttons.length; i++){
        home_buttons[i].addEventListener("click", function() { swap_page("home_page") });
    }

    // Details Button Functionality
    var details_buttons = document.getElementsByClassName("navto_hike_detail_page");
    for (var i = 0; i < home_buttons.length; i++){
        details_buttons[i].addEventListener("click", function() { swap_page("hike_detail_page") });
    }

    // Map Button Functionality
    var map_buttons = document.getElementsByClassName("navto_hike_map_page");
    for (var i = 0; i < map_buttons.length; i++){
        map_buttons[i].addEventListener("click", function() { swap_page("hike_map_page") });
    }

    // Directions Button Functionality
    var directions_buttons = document.getElementsByClassName("navto_directions_page");
    for (var i = 0; i < directions_buttons.length; i++){
        directions_buttons[i].addEventListener("click", function() { swap_page("directions_page") });
    }

    // Air Button Functionality
    var air_buttons = document.getElementsByClassName("navto_air_page");
    for (var i = 0; i < air_buttons.length; i++){
        air_buttons[i].addEventListener("click", function() { swap_page("air_page") });
    }

    // Weather Button Functionality
    var weather_buttons = document.getElementsByClassName("navto_weather_page");
    for (var i = 0; i < weather_buttons.length; i++){
        weather_buttons[i].addEventListener("click", function() { swap_page("weather_page") });
    }

    // Find Hike Button Functionality
    var find_hikes_button = document.getElementsByClassName("find_hikes_button");
    find_hikes_button[0].addEventListener("click", function() { convertAndGetHikes() });

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


    /* Home Page */

    // Convert location input to lat/long coordinates using Geocoding API
    // Call getNearbyHikes to list nearby hikes with one of the hiking APIs
    function convertAndGetHikes() {

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

                /* separate this API call */ 
                if(lat && long)
                // Get nearby hikes from hiking API
                    getNearbyHikes(lat, long);

            })
            .catch(error => {
                console.log("Geocoding API was not fetched :( ", error);
            })
    }

    // Get list of hikes within x miles of a given location using Hiking Project OR Transit&Trails API
    function getNearbyHikes(lat, long) {
        let distance = document.getElementById("distance").value;
        //const TT_key = secrets.TRANSITTRAILS_API_KEY;
        const HP_key = secrets.HIKINGPROJ_API_KEY;

        /* Note to self: add helper function to build urls */
        //let TT_url = `https://api.transitandtrails.org/api/v1/trailheads.xml?latitude=${lat}&longitude=${long}&distance=${distance}&key=${TT_key}`;
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
    

        
    

