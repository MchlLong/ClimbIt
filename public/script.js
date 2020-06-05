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

    // Get Directions Button Functionality
    var get_directions_button = document.getElementsByClassName("get_directions");
    get_directions_button[0].addEventListener("click", function() { get_directions() });

    // About Us
    var about_buttons = document.getElementsByClassName("navto_about_page");
    for (var i = 0; i < about_buttons.length; i++) {
        about_buttons[i].addEventListener("click", function() { goto_about() });
    }

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

    // Switches to home page, deallocates tables, and removes map script from DOM
    function goto_home() {

        headers = ["distance_and_duration"];

        swap_page("home_page");

        // Should really implement empty_all()
        empty_table("hike_table");
        empty_table("directions_table");
        remove_script();
        remove_elements(headers);

        // Add the input and button back to directions page
        let button = document.getElementById("direction_button");
        let origin_input = document.getElementById("origin_input");
        let label = document.getElementById("origin_label");
        button.classList.remove("invisible");
        origin_input.classList.remove("invisible");
        label.classList.remove("invisible");

        // Remove input values from home page and directions page
        let address_input = document.getElementById("address");
        address_input.value= "";
        let distance_input = document.getElementById("distance");
        distance_input.value= "";
        origin_input.value= "";

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
        .then (resp => { return resp.json(); })
        .then (mydata => { 
            console.log(mydata);
           
            // Add the table body 
            add_table("hike_table");

            let table = document.getElementById("hike_table");

            // Build array containing results 
            let table_data = [];
            let results = [];

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
        let origin = document.getElementById("origin_input").value;
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

            // Hide button and input field
            let button = document.getElementById("direction_button");
            let input = document.getElementById("origin_input");
            let label = document.getElementById("origin_label");
            button.classList.add("invisible");
            input.classList.add("invisible");
            label.classList.add("invisible");

            // Get data from response
            let total_distance = mydata["routes"][0].legs[0].distance.text;
            let steps = mydata["routes"][0].legs[0].steps;
            let duration = mydata["routes"][0].legs[0].duration.text;

            // Add origin and destination to the DOM
            let data = document.getElementsByClassName("active")[0];
            let hike_name = data.attributes.getNamedItem("hike_name").value;
            let origin_destination_header = document.createElement("h3");
            origin_destination_header.innerHTML = `From ${origin}, to ${hike_name}`;
            origin_destination_header.id = "origin_destination_header"; 
            document.getElementById("origin_destination").appendChild(origin_destination_header);
           
            // Add total distance to DOM
            let distance_header = document.createElement("h3");
            distance_header.innerHTML = `<b>Total Distance:</b> ${total_distance}`;
            distance_header.id = "distance_header"
            document.getElementById("distance_and_duration").appendChild(distance_header);
            // Add duration to DOM
            let duration_header = document.createElement("h3");
            duration_header.innerHTML = `<b>Duration:</b> ${duration}`;
            duration_header.id = "duration_header"
            document.getElementById("distance_and_duration").appendChild(duration_header);
           
            // Add the table body
            add_table("directions_table");
            let table = document.getElementById("directions_table");

            // Save response data 
            let results = [];
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
        .then (resp => {return resp.json(); })
        .then (ret => {return render_weather(ret); })
        .catch (error => console.log(error));
    }

    function goto_air() {
        swap_page("air_page");
        // Implement
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
        button.className = "navto_hike_map_page btn btn-light";

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

    // Remove array of elements with given IDs
    function remove_elements(elements) {
        for(let i = 0; i < elements.length; i++){
            let headers = document.getElementById(elements[i]);
            if(headers)
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
        marker = add_marker(map);

        // Zoom when clicked 
        marker.addListener('click', function() {
            map.setZoom(15);
            map.setCenter(marker.getPosition());
        })
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
            map: map,
            title: 'Click to zoom'
        });

        // Set map center at coordinates
        map.setCenter(marker.position);
        return marker;
    }

    // Add weather to DOM from OpenWeatherMap API 
    function render_weather(weather_list) {
            /*
                <tbody id="weather_body">
            */
            empty_table("weather_table");
            const table = document.getElementById("weather_body");
            const width = 5;
            const height = 6;
            const elem_per_row = 1;
            const skip_base = 25 - weather_list.length;
            var skip_factor = skip_base * elem_per_row;
            console.log(weather_list.length);
            console.log(weather_list);
            // Generate table
            /*
            ret_week["time"] = (resp["data"].list[i]["dt"]) * ms;
            ret_week["temp"] = resp["data"].list[i]["main"]["temp"];
            ret_week["min_temp"] = resp["data"].list[i]["main"]["temp_min"];
            ret_week["max_temp"] = resp["data"].list[i]["main"]["temp_max"];
            ret_week["weather"] = resp["data"].list[i]["weather"][0]["main"];
            */

            for (let i=0; i<height; i++) {
                // Generate row
                for (let k=0; k<elem_per_row; k++){
                    let row = table.insertRow((i * elem_per_row) + k);
                    // Add the header 
                    if (i == 0) {
                        for (let j=0; j<width; j++) {
                            //let cell = row.insertCell(j);
                            let header_cell = document.createElement("th");
                            //row.append(header_cell);
                            if (k == 0)
                                //cell.innerHTML = `Header: (${j}, ${i})`;
                                flat = (j * width) + (i-1) - skip_base;
                                //date = new Date(weather_list[flat]["time"]);
                                //header_cell.innerHTML = `${date.toGMTString().slice(0, -4)}`;;
                                header_cell.innerHTML = 'Date';
                                row.append(header_cell);
                        } 

                    }
                    else {

                        for (let j=0; j<width; j++) {
                            // Check skip_factor
                            if (skip_factor > 0 && j == 0 ) {
                                let cell = row.insertCell(j);
                                cell.innerHTML = "";
                                skip_factor--;
                            }
                            else {
                                let cell = row.insertCell(j);
                                let flat = (j * width) + (i-1) - skip_base;
                                var temp = document.createElement("label");
                                date = new Date(weather_list[flat]["time"]);
                                temp.innerHTML = `${date.toGMTString().slice(0, -4)}`;
                                cell.appendChild(temp);
                                cell.appendChild(document.createElement("br"));
                                var temp = document.createElement("IMG");
                                temp.src = `/img/${convert_image_tag(weather_list[flat]["weather"])}.png`;
                                temp.innerHTML = `${weather_list[flat]["weather"]}`;
                                cell.appendChild(temp);
                                var temp = document.createElement("label");
                                temp.innerHTML = `${weather_list[flat]["weather"]}`;
                                cell.appendChild(temp);
                                cell.appendChild(document.createElement("br"));
                                var temp = document.createElement("label");
                                temp.innerHTML = `${Math.round((weather_list[flat]["temp"] - 273.15)*(9/5) + 32)}ºF / ${Math.round(weather_list[flat]["temp"] - 273.15)}ºC`;
                                cell.appendChild(temp);
                                cell.appendChild(document.createElement("br"));
                                //var temp = document.createElement("label");
                                //temp.innerHTML = `${Math.round((weather_list[flat]["min_temp"] - 273.15)*(9/5) + 32)}ºF / ${Math.round(weather_list[flat]["min_temp"] - 273.15)}ºC ~ ${Math.round((weather_list[flat]["max_temp"] - 273.15)*(9/5) + 32)}ºF / ${Math.round(weather_list[flat]["max_temp"] - 273.15)}ºC`;
                                //cell.appendChild(temp);                           
                            }
                        }
                    }
                }
            }

            return;
        }


    function get_icon(icon) {
        return icon;
    }

    // Switches to home page, deallocates tables, and removes map script from DOM
    function goto_about() {
        swap_page("about_page");
        // should really implement emptyAll()
        empty_table("hike_table");
        empty_table("directions_table");
        remove_script();
    }

    // Get an image
    function convert_image_tag(api_name) {
        let ret = "";
        switch (api_name) {
            case("Clear"):
                ret = "clear_sky";
                break;
            case("Clouds"):
                ret = "few_clouds";
                break;
            case("scattered clouds"):
                ret = "broken_clouds";
                break;
            case("Thunderstorm"):
                ret = "thunderstorm";
                break;
            case("Drizzle"):
                ret = "rain";
                break;
            case("Rain"):
                ret = "rain";
                break;
            case("Snow"):
                ret = "snow";
                break;
            case("Mist"):
                ret = "broken_clouds";
                break;
            default: 
                ret = "none";
                break;
        }
        return ret;
    }