/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

/* Listeners */

    // Home Button Functionality
    var home_buttons = document.getElementsByClassName("navto_home_page");
    for (var i = 0; i < home_buttons.length; i++) {
        home_buttons[i].addEventListener("click", function() { goto_home() });
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

    // Switches to home page, deallocates tables, and removes map script from DOM
    function goto_home() {

        headers = ["distance_header", "duration_header"];

        swap_page("home_page");
        // should really implement emptyAll()
        empty_table("hike_table");
        empty_table("directions_table");
        remove_script();
        remove_elements(headers);

    }

    // Go to Hike Menu (will invoke get_map())
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

            let table = document.getElementById("hike_table");

            // Build array containing results to access outside of here if possible
            let table_data = new Array();
            let results = new Array();

            // Add header data
            table_data.push(["Hike Name", "Length<br> (in miles)", "Elevation Gain<br> (in feet)"]);

            // Save necessary response data
            for(let i = 0; i < mydata.length; i++) {
                // Save data for table to array
                table_data.push([i, mydata[i].name, mydata[i].length, mydata[i].ascent]);
                // Save index, hike name, ID, lat, and long to array
                results.push([i, mydata[i].name, mydata[i].id, mydata[i].latitude, mydata[i].longitude]); 
            }

            // Get number of columns
            let num_columns = table_data[0].length;

            // Add the header to the table
            let row = table.insertRow(-1);
            for (let i = 0; i < num_columns; i++) {
                let header = document.createElement("th");
                header.id = "hike_table_header";
                header.innerHTML = table_data[0][i];
                row.appendChild(header);
            }

            // Add table data
            for (let i = 1; i < results.length; i++) {
                // Append row 
                row = table.insertRow(-1);
                for (let j = 1; j <= num_columns; j++) {
                    if(j == 1) {
                        // Add the hike button and details to each column 
                        // format: add_hike(id, name, lat ,long)
                        if(results[i]) {
                            // Add hike button 
                            let hike_cell = add_hike(results[i][j+1], results[i][j], results[i][j+2], results[i][j+3]); 
                            // Set ids for styling
                            hike_cell.id = "hikes_column1";
                            // Append the data to the row
                            row.appendChild(hike_cell); 
                        }
                    }
                    else {
                        // Append text 
                        let cell = row.insertCell(-1);
                        cell.innerHTML = table_data[i][j];
                        // Set ids for styling
                        if(j == 2) {
                            cell.id = "hikes_column2";
                        }
                        if(j == 3) {
                            cell.id = "hikes_column3";
                        }
                    }
                }
            }
            
        })
        
        .catch (error => console.log(error));
    }

    // Display the hike map from Google Maps JavaScript API
    function get_map() {
        const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCw6yD8WOm2BDI1nzERttC5meDgBPFbMIo&callback=initMap"
        // Retrieve coords from HTML of active hike
        let data = document.getElementsByClassName("active")[0];
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;

        console.log("lat:" + lat)
        console.log("long:" + long)
        console.log(JSON.stringify({lat, long}));

        // Add script to the DOM
        add_script(url);
    }

    // Display directions from given origin to trailhead location using Directions API
    function get_directions() {

        // Retrieve coords of destination 
        let data = document.getElementsByClassName("active")[0];
        let lat = data.attributes.getNamedItem("lat").value;
        let long = data.attributes.getNamedItem("long").value;
        let destination = `${lat},${long}`

        // Retrieve origin from user input 
        let origin = document.getElementById("origin").value;
        console.log({origin, destination});

        // API call
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

            // Get data from response
            let total_distance = mydata["routes"][0].legs[0].distance.text;
            let steps = mydata["routes"][0].legs[0].steps;
            let duration = mydata["routes"][0].legs[0].duration.text;

            // Add total distance to DOM
            let distance_header = document.createElement("h3");
            distance_header.innerHTML = `Total Distance: ${total_distance}`;
            distance_header.id = "distance_header"
            document.getElementById("distance_and_duration").appendChild(distance_header);
            // Add duration to DOM
            let duration_header = document.createElement("h3");
            duration_header.innerHTML = `Duration: ${duration}`;
            duration_header.id = "duration_header"
            document.getElementById("distance_and_duration").appendChild(duration_header);
           
            // Add the table body
            add_table("directions_table");
            let table = document.getElementById("directions_table");

            // Save response data 
            let results = new Array();
            // Save header data
            results.push(["Steps", "Distance to Next"]);
            // Save data to put in table
            for(let i = 0; i < steps.length; i++) {
                results.push(([i, steps[i].html_instructions, steps[i].distance.text]));
            }
            
            // Get number of columns
            let num_columns = results[0].length;
            // Add the header to the table
            let row = table.insertRow(-1);
            for (let i = 0; i < num_columns; i++) {
                let header = document.createElement("th");
                header.innerHTML = results[0][i];
                row.appendChild(header);
            }

            // Add table data
            for (let i = 1; i < results.length; i++) {
                // Append row 
                row = table.insertRow(-1);
                for (let j = 1; j <= num_columns; j++) {
                    // Append text 
                    let cell = row.insertCell(-1);
                    cell.innerHTML = results[i][j];
                    // Set ids for styling
                    if(j == 1) {
                        cell.id = "directions_column1";
                    }
                    if(j == 2) {
                        cell.id = "directions_column2";
                    }
                }
            }
        })
        .catch (error => console.log(error));

        // TODO: Hide button and input field
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

    // Empty the table
    function empty_table(table_name) {
        let table = document.getElementById(table_name);
        let num_rows = table.rows.length;
        for (let i = num_rows-1; i >= 0; i--) 
            table.deleteRow(i);
    }

    // Remove elements with given IDs
    function remove_elements(elements) {
        for(let i = 0; i < elements.length; i++){
            let headers = document.getElementById(elements[i]);
            headers.remove();
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

    // Initialize JS Map
    function initMap() {
        // Initialize the map
        let map = new google.maps.Map(document.getElementById("map"), {
            center: new google.maps.LatLng(0,0),
            zoom: 10
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






