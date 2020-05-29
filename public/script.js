/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

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
        air_buttons[i].addEventListener("click", function() { goto_air() });
    }

    // Weather Button Functionality
    var weather_buttons = document.getElementsByClassName("navto_weather_page");
    for (var i = 0; i < weather_buttons.length; i++) {
        weather_buttons[i].addEventListener("click", function() { goto_weather() });
    }
   
    // Find Hike Button Functionality
    var find_hike_button = document.getElementsByClassName("find_hikes");
    find_hike_button[0].addEventListener("click", function() { get_hikes() } ); 

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

    // Remove All Active
    function deactivate() {

        // Deactivate all pages with an active tag
        let pages = document.getElementsByClassName("active");
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.remove("active");
        }

    }

/* API Wrapper Functions */

    // Convert location input to lat/long coordinates using Geocoding API
    // Get list of hikes within x miles of a given location using REI Hiking Project API
    // Add list of hikes to the DOM
    function get_hikes() {
        // Get address and distance from form input 
        addr = document.getElementById("address").value;
        dist = document.getElementById("distance").value;
        console.log(JSON.stringify({address: addr, distance: dist}));
        fetch("/get_hikes", { 
            method: "post", 
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({address: addr, distance: dist})
        })
        .then (resp => { return resp.json(); })
        .then (mydata => { 
            // Loop through all the trails from the response
            for(i = 0; i < mydata.length ; i++) {
                // Save the trail name, ID, lat, and long 
                let name = mydata[i].name;
                let id = mydata[i].id;
                let lat = mydata[i].latitude;
                let long = mydata[i].longitude; 
                // Add the ID and trail name to the DOM
                add_hike_to_DOM(id, name, lat, long); 
            }
        })
        .catch (error => console.log(error));
    }

    // Goto Hike Menu (will invoke get_map())
    function goto_hike() {
        swap_page("hike_map_page");
        console.log("Triggered object: " + event.target.id);
        let pages = document.getElementsByClassName("visible")[0];
        if (pages.length > 1) {
            console.log("Error,  multiple pages should not be visible at one time");
        }
        deactivate();
        pages.classList.add("active");
        pages.setAttribute("hike_id", event.target.attributes.getNamedItem("hike_id").value);
        pages.setAttribute("hike_name", event.target.attributes.getNamedItem("hike_name").value);
        pages.setAttribute("lat", event.target.attributes.getNamedItem("lat").value);
        pages.setAttribute("long", event.target.attributes.getNamedItem("long").value);
        get_map();
    }

    // Display the hike map from Google Maps Static API
    function get_map() {
        // Retrieve the lat/long from the HTML associated with the hike ID
        console.log("Triggered object: " + event.target.id);
        let data = document.getElementsByClassName("active")[0];
        console.log(data);
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;
        console.log("lat:" + lat)
        console.log("long:" + long)
        console.log(JSON.stringify({lat, long}));

        fetch("/get_map", { 
            method: "post", 
            headers: {
                "Accept": "application/json, text/plain, image/png, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({lat, long})
        })
        .then (resp => { return resp; })
        .then (mydata => {
            console.log(mydata);
             // get image URL 
             // add map to DOM
        })
        .catch (error => console.log(error));
    }

    function goto_weather() {

        swap_page("weather_page");
        let pages = document.getElementsByClassName("active")[0];
        let lat = pages.attributes.getNamedItem("lat").value;
        let long = pages.attributes.getNamedItem("long").value;

        fetch("/get_weather", { 
            method: "post", 
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({lat, long})
        })
        .then (resp => { return resp.json(); })
        .then (ret => { return render_weather(); })
        .catch (error => console.log(error));
    }

    function goto_air() {
        swap_page("air_page");
        // Implement
    }

/* DOM Manipulation Functions */ 

    // Add hike button to the "hike_list" in the DOM
    function add_hike_to_DOM(hike_id, hike_name, lat, long) {
        let button = document.createElement("button");
        let line_break = document.createElement("br");
        // Set button details
        button.innerHTML = hike_name;
        button.type = "button";
        button.className = "navto_hike_map_page";
        // Add functionality to switch to map page and show map when clicked
        button.addEventListener("click", function() { goto_hike() });
        // Add button to the DOM and break after
        document.getElementById("hike_list").appendChild(button);
        document.getElementById("hike_list").appendChild(line_break);
        // Add hike name, id, latitude, and longitude as custom attributes
        button.setAttribute("hike_id", hike_id);
        button.setAttribute("hike_name", hike_name);
        button.setAttribute("lat", lat);
        button.setAttribute("long", long);
    }

    // 
    function render_weather() {
        console.log("Called render_weather, exiting.");
        return;
    }


    

