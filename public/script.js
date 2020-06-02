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
        home_buttons[i].addEventListener("click", function() { remove_hikes() });
        home_buttons[i].addEventListener("click", function() { remove_script() });
    }

    // Details Button Functionality
    var details_buttons = document.getElementsByClassName("navto_hike_detail_page");
    for (var i = 0; i < details_buttons.length; i++) {
        details_buttons[i].addEventListener("click", function() { swap_page("hike_detail_page") });
        details_buttons[i].addEventListener("click", function() { remove_script() });
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
    var find_hike_button = document.getElementsByClassName("find_hikes");
    find_hike_button[0].addEventListener("click", function() { get_hikes() } ); 

    // Get Directions Button Functionality
    var get_directions_button = document.getElementsByClassName("get_directions");
    get_directions_button[0].addEventListener("click", function() { get_directions() });

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
            pages[i].classList.add("inactive");
            pages[i].classList.remove("active");
        }

    }

/* API Wrapper Functions */

    // Convert location input to lat/long coordinates using Geocoding API
    // Get list of hikes within x miles of a given location using REI Hiking Project API
    // Add list of hikes to the DOM
    function get_hikes() {
        // Get address and distance from form input 
        let addr = document.getElementById("address").value;
        let dist = document.getElementById("distance").value;
        console.log(JSON.stringify({address: addr, distance: dist}));
        fetch("/get_hikes", { 
            method: "post", 
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({address: addr, distance: dist})
        })
        .then (resp => { return resp; })
        .then (val => { return val.json(); })
        .then (mydata => { 
            console.log(mydata);

            // Add the table body 
            add_table("hike_table");

            // Add response data to table
            let length = mydata.length;
            for(let i = 0; i < length; i++) {
                // Create row and append to tbody
                let row = document.createElement("tr");
                document.getElementById("hike_body").appendChild(row);
                
                // 3 columns: hike button, length, and elevation gain
                // this is so gross but adds a lot of lines so whatever
                for(let j = 0; j < 3; j++) {
                    if(j == 0) {
                        // Get the hike name, ID, lat, and long 
                        let name = mydata[i].name;
                        let id = mydata[i].id;
                        let lat = mydata[i].latitude;
                        let long = mydata[i].longitude; 

                        // Add the hike button and details to each column 
                        let hike_cell = add_hike(id, name, lat, long); 
                        // Append the data to the row
                        row.appendChild(hike_cell); 
                    }
                    if(j == 1) {
                        // Add the length of the hike in miles
                        let length_of_hike = mydata[i].length;
                        let length_cell = document.createElement("td");
                        let length_value = document.createTextNode(length_of_hike + " miles");
                        length_cell.appendChild(length_value);
                        row.appendChild(length_cell);
                    }
                    if(j == 2) {
                        // Add the elevation of the hike in feet 
                        let elevation = mydata[i].ascent;
                        let elevation_cell = document.createElement("td");
                        let elevation_value = document.createTextNode(elevation + " feet gain");
                        elevation_cell.appendChild(elevation_value);
                        row.appendChild(elevation_cell);
                    }
                }
            }
        })
        .catch (error => console.log(error));
    }

    // Goto Hike Menu (will invoke get_map())
    function goto_hike() {
        swap_page("hike_map_page");
        console.log("Triggered object: " + event.target.id);
        let pages = document.getElementsByClassName("visible");
        if (pages.length > 1) {
            console.log("Error,  multiple pages should not be visible at one time");
        }
        deactivate();
        pages[0].classList.add("active");
        pages[0].setAttribute("hike_id", event.target.attributes.getNamedItem("hike_id").value);
        pages[0].setAttribute("hike_name", event.target.attributes.getNamedItem("hike_name").value);
        pages[0].setAttribute("lat", event.target.attributes.getNamedItem("lat").value);
        pages[0].setAttribute("long", event.target.attributes.getNamedItem("long").value);
        get_map();
    }

    // Display the hike map from Google Maps Static API
    function get_map() {
        const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCw6yD8WOm2BDI1nzERttC5meDgBPFbMIo&callback=initMap"
        // Retrieve coords from HTML of active hike
        console.log("Triggered object: " + event.target.id);
        let data = document.getElementsByClassName("active")[0];
        console.log(data);
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;

        console.log("lat:" + lat)
        console.log("long:" + long)
        console.log(JSON.stringify({lat, long}));

        // Add script to the DOM
        add_script(url);
    }

    // Display directions from given origin to trailhead location
    function get_directions() {
        // Retrieve coords of destination 
        let data = document.getElementsByClassName("active")[0];
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;
        let destination = `${lat},${long}`
        // Retrieve origin from user input 
        let origin = document.getElementById("origin").value;
        console.log({origin, destination});
        fetch("/get_directions", { 
            method: "post", 
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({origin, destination})
        })
        .then (resp => { return resp; })
        .then (val => { return val.json(); })
        .then (mydata => { 

            add_table("directions");

            // Get data from response
            let total_distance = mydata["routes"][0].legs[0].distance.text;
            let steps = mydata["routes"][0].legs[0].steps;
            let duration = mydata["routes"][0].legs[0].duration.text;

            console.log(steps);
            console.log(duration);
            console.log(total_distance);

            // Loop through steps and add instructions and leg distances to the DOM
            for(let i = 0; i < steps.length; i++) {

                // Create a row and append it to the table body
                let row = document.createElement("tr");
                document.getElementById("directions_body").appendChild(row);

                let html_instructions = steps[i].html_instructions;
                let distance = steps[i].distance.text;

                console.log(html_instructions);
                console.log(distance);
                    for(let j = 0; j < 2; j++) {
                        // first column
                        if(j == 0) {
                            //add directions
                            let directions = document.createElement("td");
                            directions.innerHTML = html_instructions;
                            row.appendChild(directions);
                        }
                        // second column
                        if(j == 1) {
                            // add length to next direction
                            let length_to_next = document.createElement("td");
                            length_to_next.innerHTML = distance;
                            row.appendChild(length_to_next);
                        }
                        
                    }
            }
        })
        .catch (error => console.log(error));
    }


/* DOM Manipulation Functions */ 

    function add_table(table_id) {
        // Create tbody 
        let table_body = document.createElement("tbody");
        // Add the table_body to the table
        document.getElementById(table_id).appendChild(table_body);
    }


    // Add a hike button to the "hike_table" in the DOM
    function add_hike(hike_id, hike_name, lat, long) {
        // Create the table data
        let cell = document.createElement("td");

        // Create the hike button
        let button = document.createElement("button");
        let line_break = document.createElement("br");

        // Set button details
        button.innerHTML = hike_name;
        button.type = "button";
        button.className = "navto_hike_map_page";

        // Add functionality to switch to map page and show map when clicked
        button.addEventListener("click", function() { goto_hike() });

        // Append the button to the table data
        cell.appendChild(button);

        // Add hike id, name, latitude, and longitude as custom attributes
        button.setAttribute("hike_id", hike_id);
        button.setAttribute("hike_name", hike_name);
        button.setAttribute("lat", lat);
        button.setAttribute("long", long);

        return cell;
    }

    // Empty the hike list
    function remove_hikes() {
        let hike_list = document.getElementById("hike_list");
        while(hike_list.hasChildNodes()) {
            hike_list.removeChild(hike_list.firstChild);
        }
    }

    // Add the GMaps script tag to the DOM
    function add_script(url) {
        let map_script = document.createElement("script");
        map_script.setAttribute("src", url);
        map_script.setAttribute("class", "map_script");
        document.head.appendChild(map_script);
    }

    // Remove the GMaps script tag from the DOM
    function remove_script(url) {
        window.google = {};
    }

    // Add the direction data as table items and labels to the DOM
    function add_directions(table_item) {
        // Create the table data
        let cell = document.createElement("td");
        cell.innerHTML = table_item;
        document.getElementById("directions").appendChild(cell);

    }


    // Initialize JS Map
    function initMap() {
        // Initialize the map
        let map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(0,0),
            zoom: 8
        });
        // Add marker 
        add_marker(map);
    }

    // Add marker to map at given coordinates and center on the marker
    function add_marker(map) {
        // Get active hike data 
        let data = document.getElementsByClassName("active")[0];
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;
        // Set marker at coordinates
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map
        });
        // Set map center at coordinates
        map.setCenter(marker.position);
    }






