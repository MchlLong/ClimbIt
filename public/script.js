/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

/* Listeners */

    // Home Button Functionality
    var home_buttons = document.getElementsByClassName("navto_home_page");      // Select all "navto_home_page" buttons
    for (var i = 0; i < home_buttons.length; i++) {                             // Loop through each button
        home_buttons[i].addEventListener("click", function() { goto_home() });  // Add the functionality of navigating to home page
    }

    // Details Button Functionality
    var details_buttons = document.getElementsByClassName("navto_hike_detail_page");                // Select all "navto_hike_detail_page"
    for (var i = 0; i < details_buttons.length; i++) {                                              // Loop through each button
        details_buttons[i].addEventListener("click", function() { swap_page("hike_detail_page") }); // Add the functionality of navigating to the hike detail page
    }

    // Weather Button Functionality
    var weather_buttons = document.getElementsByClassName("navto_weather_page");     // Select all "navto_weather_page" buttons
    for (var i = 0; i < weather_buttons.length; i++) {                               // Loop through each button
        weather_buttons[i].addEventListener("click", function() { goto_weather() }); // Add the functionality of navigating to weather page
    }
   
    // Directions Button Functionality
    var directions_buttons = document.getElementsByClassName("navto_directions_page");                // Select all "navto_directions_page" buttons
    for (var i = 0; i < directions_buttons.length; i++) {                                             // Loop through each button
        directions_buttons[i].addEventListener("click", function() { swap_page("directions_page") }); // Add the functionality of navigating to directions page
    }

    // Map Button Functionality
    var map_buttons = document.getElementsByClassName("navto_hike_map_page");                // Select all "navto_hike_map_page" buttons
    for (var i = 0; i < map_buttons.length; i++) {                                           // Loop through each button
        map_buttons[i].addEventListener("click", function() { swap_page("hike_map_page") }); // Add the functionality of navigating to hike map page
    }

    // Find Hike Button Functionality
    var find_hike_button = document.getElementsByClassName("find_hikes");       // Select all "navto_home_page" buttons
    find_hike_button[0].addEventListener("click", function() { get_hikes(); }); // Add functionality of navigating to hikes page

    // Get Directions Button Functionality
    var get_directions_button = document.getElementsByClassName("get_directions");          // Select all "navto_home_page" buttons
    get_directions_button[0].addEventListener("click", function() { get_directions(); });   // Add functionality of navigating to directions page

    // About Button Functionality
    var about_buttons = document.getElementsByClassName("navto_about_page");      // Select all "navto_home_page" buttons
    for (var i = 0; i < about_buttons.length; i++) {                              // Loop through each button
        about_buttons[i].addEventListener("click", function() { goto_about(); }); // Add functionality of navigating to about page
    }

/* Webpage Controller Functions */

    // Function to hide all pages, then make a page visible
    function swap_page(to_go) {

        // Remove all visibility from pages
        let pages = document.getElementsByClassName("visible"); // Select all visible pages 
        for (var i = 0; i < pages.length; i++) {                // Loop through each instance of visible page DIV element
            pages[i].classList.add("invisible");                // Hide each page via CSS adding to "invisible" class
            pages[i].classList.remove("visible");               // Remove each item from "visible" class
        }
        // Make argument "to_go" page visible
        let current = document.getElementsByClassName(to_go);  // Select the desired page to render via argument "to_go"
        for (var i = 0; i < current.length; i++) {             // Loop through each page, incase there are multiple pages specified
            current[i].classList.add("visible");               // Render the page by adding it to the "visible" class
            current[i].classList.remove("invisible");          // Remove each item from "invisible" class
        }

    }

    // Remove all hikes from being "active"
    // "active" is class used to associate which hike's latitude and longitude
    // should be used when making additional API calls. 
    function deactivate() {

        // Deactivate all pages with an active tag
        let pages = document.getElementsByClassName("active");  // Select each item in "active" class and deactivate them
        for (var i = 0; i < pages.length; i++) {                // Loop through each selected item
            pages[i].classList.remove("active");                // Remove the item from the "active" class
        }

    }

    // Switches to home page, deallocates tables, and removes map script from DOM
    function goto_home() {

        headers = ["distance_header", "duration_header", "origin_destination_header"]; // Headers to describle the table

        swap_page("home_page");           // Change visibility to the "home_page"
        empty_table("hike_table");        // Remove all hikes from the "hike_table" for new searches
        empty_table("directions_table");  // Reset the "directions_table" to allow new direction lookups
        remove_script();                  // Remove the Google Map to allow a new map
        remove_elements(headers);         // Remove each element from each header specified in "headers"

        // Add the input and button back to directions page
        let button = document.getElementById("direction_button");   // Select the unique instance of "direction_button"
        let origin_input = document.getElementById("origin_input"); // Select the unique instance of "origin_input"
        let label = document.getElementById("origin_label");        // Select the unique instance of "origin_label"

        button.classList.remove("invisible");                       // Render "direction_button"
        origin_input.classList.remove("invisible");                 // Render "origin_input"
        label.classList.remove("invisible");                        // Render "origin_label"

        // Remove input values from home page and directions page
        let address_input = document.getElementById("address");     // Select "address" value from home page
        address_input.value= "";                                    // Clear value
        let distance_input = document.getElementById("distance");   // select "distance" value from home page
        distance_input.value= "";                                   // Clear value
        origin_input.value= "";                                     // Clear value

    }

    // Go to Hike Menu (will invoke get_map())
    function goto_hike() {

        swap_page("hike_map_page");                             // Render the "hike_map_page", showing a map and the directions / weather options
        let pages = document.getElementsByClassName("visible"); // Select "visible" pages, only use the first instance as multiple pages shouldn't be visible
        deactivate();                                           // Reset the "active" hike so a new hike can replace it

        pages[0].classList.add("active");                                                            // Create the new "active" hike
        pages[0].setAttribute("hike_id", event.target.attributes.getNamedItem("hike_id").value);     // Store the "hike_id" in the "active" hike
        pages[0].setAttribute("hike_name", event.target.attributes.getNamedItem("hike_name").value); // Store the "hike_name" in the "active" hike
        pages[0].setAttribute("lat", event.target.attributes.getNamedItem("lat").value);             // Store the latitude, "lat", in the "active" hike
        pages[0].setAttribute("long", event.target.attributes.getNamedItem("long").value);           // Store the longitude, "long, in the "active" hike
        get_map();                                                                                   // Invoke "get_map()", will use the "active" attributes instead of arguments

    }

/* API Wrapper Functions */

// GOOGLE API FUNCTIONALITY 

    // Convert location input to lat/long coordinates using Geocoding API
    // Get list of hikes within "distance" miles of a given location using REI Hiking Project API
    // Add list of hikes to the DOM through a table element
    function get_hikes() {

        let addr = document.getElementById("address").value;            // Fill in "address" from the form in the "home_page"
        let dist = document.getElementById("distance").value;           // Fill in "distance" from the form in the "home_page"
        
        fetch("/get_hikes", {                                     // Fetch to middleware to get data
            method: "post",                                       // POST request method
            headers: {                                            // Headers to format data
                "Accept": "application/json, text/plain, */*",    // Expect JSON or plain text
                "Content-Type": "application/json"                // Content type is JSON 
            },
            body: JSON.stringify({address: addr, distance: dist}) // Stringify the arguments for middleware to process
        })
        .then (resp => { return resp.json(); })                   // Convert response to JSON
        .then (mydata => {                                        // Process data      

            add_table("hike_table");                           // Add the table body 
            let table = document.getElementById("hike_table"); // Select the DIV element that will be populated with hikes
            let table_data = [];                               // Build array containing response data
            let results = [];                                  // Build array containing results

            table_data.push(["Hike Name", "Length<br> (in miles)", "Elevation Gain<br> (in feet)"]); // Add header data to table

            for(let i = 0; i < mydata.length; i++) {                                                      // Loop through all data from response
                table_data.push([i, mydata[i].name, mydata[i].length, mydata[i].ascent]);                 // Save data for table to array
                results.push([i, mydata[i].name, mydata[i].id, mydata[i].latitude, mydata[i].longitude]); // Save index, hike name, ID, lat, and long to array
            }

            let num_columns = table_data[0].length; // Get number of columns
            let row = table.insertRow(-1);          // Add the header to the table

            for (let i = 0; i < num_columns; i++) {         // Loop through each column to add data
                let header = document.createElement("th");  // Create table header cell
                header.id = `hike_table_header${i}`;        // Set a unique id per column header
                header.innerHTML = table_data[0][i];        // Populate header with data
                row.appendChild(header);                    // Add to the table
            }

            // Add table data
            for (let i = 1; i < results.length; i++) {      // Loop through all of the resulting data from 
                row = table.insertRow(-1);                  // Append row to table
                for (let j = 1; j <= num_columns; j++) {    // Loop through columns to add appropriate data
                    if (j == 1) {                           // Check if first loop item
                        // Add the hike button and details to each column 
                        // format: add_hike(id, name, lat ,long)
                        if (results[i]) {   // Check that the value exists
                            let hike_cell = add_hike(results[i][j+1], results[i][j], results[i][j+2], results[i][j+3]); // Add hike button 
                            hike_cell.id = `hikes_column1`;                                                             // Set ids for styling
                            row.appendChild(hike_cell);                                                                 // Append the data to the row
                        }
                    }
                    else {
                        let cell = row.insertCell(-1);     // Append row to table 
                        cell.innerHTML = table_data[i][j]; // Append text 
                        if(j == 2) {                       // Check for column #2 alignment
                            cell.id = "hikes_column2";     // Set ids for styling
                        }
                        if(j == 3) {                       // Check for column #3 alignment
                            cell.id = "hikes_column3";     // Set ids for styling
                        }
                    }
                }
            }
            
        })
        .catch (error => console.log(error)); // Log error
    }

    // Display the hike map from Google Maps JavaScript API
    function get_map() {

        const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCw6yD8WOm2BDI1nzERttC5meDgBPFbMIo&callback=initMap" // key has whitelist of valid IPs and restrictions for protection
        
        let data = document.getElementsByClassName("active")[0]; // Select the "active" hike
        let lat = data.attributes.getNamedItem("lat").value;     // Retrieve the latitude, "lat", from HTML of "active" hike
        let long = data.attributes.getNamedItem("long").value;   // Retrieve the longitude, "long", from HTML of "active" hike
        add_script(url);                                         // Add script to the DOM
    }

    // Display directions from given origin to trailhead location using Directions API
    function get_directions() {

        let data = document.getElementsByClassName("active")[0];    // Select the "active" hike
        let lat = data.attributes.getNamedItem("lat").value;        // Retrieve the latitude, "lat", from HTML of "active" hike
        let long = data.attributes.getNamedItem("long").value;      // Retrieve the longitude, "long", from HTML of "active" hike
        let destination = `${lat},${long}`                          // Define a "lat", and "long" pair to be used by the API
        let origin = document.getElementById("origin_input").value; // Retrieve origin from user input 

        fetch("/get_directions", {                             // Fetch to middleware to get data
            method: "post",                                    // POST request method
            headers: {                                         // Headers to format data
                "Accept": "application/json, text/plain, */*", // Expect JSON or plain text
                "Content-Type": "application/json"             // Content type is JSON 
            },
            body: JSON.stringify({origin, destination})        // Stringify the arguments for middleware to process
        })
        .then (resp => { return resp.json(); }) // Convert response to JSON
        .then (mydata => {                      // Process data

            let button = document.getElementById("direction_button"); // Select the unique instance of "direction_button"
            let input = document.getElementById("origin_input");      // Select the unique instance of "origin_input"
            let label = document.getElementById("origin_label");      // Select the unique instance of "origin_label"

            button.classList.add("invisible");  // Hide "direction_button"
            input.classList.add("invisible");   // Hide "origin_input"
            label.classList.add("invisible");   // Hide "origin_label"

            let total_distance = mydata["routes"][0].legs[0].distance.text; // Get from response total distance from the sum of "legs" from the route
            let steps = mydata["routes"][0].legs[0].steps;                  // Get from response total number of steps
            let duration = mydata["routes"][0].legs[0].duration.text;       // Get from response total duration

            // Add origin and destination to the DOM
            let data = document.getElementsByClassName("active")[0];         // Select "active" hike to acquire unique data
            let hike_name = data.attributes.getNamedItem("hike_name").value; // Get name of "active" hike
            let origin_destination_header = document.createElement("h3");    // Create new header and select it

            origin_destination_header.innerHTML = `From <b>${origin}</b>, to <b>${hike_name}</b>`; // Change text of created header to contain the hike name
            origin_destination_header.id = "origin_destination_header";                            // Set id of created header
            document.getElementById("origin_destination").appendChild(origin_destination_header);  // Append header to "origin_destination" header
           
            let distance_header = document.createElement("h3");                            // Create new header for distance and select it
            distance_header.innerHTML = `<b>Total Distance:</b> ${total_distance}`;        // Change text of created header to contain the total distance
            distance_header.id = "distance_header";                                        // Set id of created header
            document.getElementById("distance_and_duration").appendChild(distance_header); // Select and Append header to "distance_and_duration" header

            let duration_header = document.createElement("h3");                             // Create new header for duration and select it
            duration_header.innerHTML = `<b>Duration:</b> ${duration}`;                     // Change text of created header to contain the duration
            duration_header.id = "duration_header";                                         // Set id of created header
            document.getElementById("distance_and_duration").appendChild(duration_header);  // Select and Append header to "distance_and_duration" header
           
            // Prepare to render the table
            add_table("directions_table");                           // Invoke "add_table()" to render a specified DOM, "directions_table"
            let table = document.getElementById("directions_table"); // Select "directions_table" to do work
            let results = [];                                        // Save response data 
            results.push(["Steps", "Distance to Next"]);             // Save header data

            for(let i = 0; i < steps.length; i++) {                                      // Loop through each leg of route
                results.push(([i, steps[i].html_instructions, steps[i].distance.text])); // Save data to put in table
            }
            
            let num_columns = results[0].length; // Get number of columns
            let row = table.insertRow(-1);       // Add the header to the table

            for (let i = 0; i < num_columns; i++) {         // Loop through each column in "results"
                let header = document.createElement("th");  // Create a table header element in DOM 
                header.innerHTML = results[0][i];           // Append data
                row.appendChild(header);                    // Add to to processed row
            }

            for (let i = 1; i < results.length; i++) {   // Loop through all data from the "results"
                row = table.insertRow(-1);               // Append row to table
                for (let j = 1; j <= num_columns; j++) { // Loop through each column in "results" 
                    let cell = row.insertCell(-1);       // Generate a new row to contain directional data
                    cell.innerHTML = results[i][j];      // Set text to contain the response data
                    if(j == 1) {                         // Select first column
                        cell.id = "directions_column1";  // Add unique id to items in first column for styling
                    }
                    if(j == 2) {                         // Select second column
                        cell.id = "directions_column2";  // Add unique id to items in second column for styling
                    }
                }
            }
        })
        .catch (error => console.log(error)); // Log errors
    }

// OPENWEATHER FUNCTIONALITY

    function goto_weather() {

        swap_page("weather_page");                                  // Hide all other elements and render the "weather_page"
        let pages = document.getElementsByClassName("active")[0];   // Select "active" hike to get latitude, "lat", and longitude "long"
        let lat = pages.attributes.getNamedItem("lat").value;       // Select "lat" for API calls 
        let long = pages.attributes.getNamedItem("long").value;     // Select "long" for API calls

        fetch("/get_weather", {                                // Fetch to middleware to get data
            method: "post",                                    // POST request method
            headers: {                                         // Headers to format data
                "Accept": "application/json, text/plain, */*", // Expect JSON or plain text
                "Content-Type": "application/json"             // Content type is JSON 
            },
            body: JSON.stringify({lat, long})                  // Stringify the arguments for middleware to process
        })
        .then (resp => {return resp.json(); })        // Convert response to JSON
        .then (ret => {return render_weather(ret); }) // Process data with wrapper function
        .catch (error => console.log(error));         // Log errors
    }

    // Switches to home page, deallocates tables, and removes map script from DOM
    function goto_about() {
        swap_page("about_page");         // Swap visibility to render "about_page"
        empty_table("hike_table");       // Empty the hike table of any data
        empty_table("directions_table"); // Clear the directions currently in place
        remove_script();                 // Remove the Google Maps data
    }

/* Wrapper and DOM manipulation functions */ 

// DOM MANAGEMENT HELPER FUNCTIONS

    // Remove array of elements with given IDs
    function remove_elements(elements) {
        for(let i = 0; i < elements.length; i++) {               // Loop through the argument list
            let headers = document.getElementById(elements[i]);  // Select each element with an id equal to the argument
            if (headers)                                         // Check if item isn't null
                headers.remove();                                // Remove from the DOM
        }
    }

// TABLE HELPER FUNCTIONS

    function add_table(table_id) {
        let table_body = document.createElement("tbody");          // Create a table "table_body"
        document.getElementById(table_id).appendChild(table_body); // Select the argument "table_id" and add the created "table_body" to it
    }

    // Empty the table
    function empty_table(table_name) {
        let table = document.getElementById(table_name);    // Select the argument "table_name" to empty
        let num_rows = table.rows.length;                   // Count the number of rows to loop through
        for (let i = num_rows-1; i >= 0; i--)               // Decrement through each row and remove the items
            table.deleteRow(i);                             // Delete the row in the DOM
        
    }

// HIKE WRAPPER FUNCTIONS

    // Add a hike button to the "hike_table" in the DOM
    function add_hike(hike_id, hike_name, lat, long) {

        let cell = document.createElement("td");       // Create a hike table data element
        let button = document.createElement("button"); // Create the button to access the hike
        let line_break = document.createElement("br"); // Create a new line break for spacing

        button.innerHTML = hike_name;                                 // Set the text value of the button
        button.type = "button";                                       // Set the button type
        button.className = "navto_hike_map_page btn btn-light";       // Add class values for styling and functionality
        button.addEventListener("click", function() { goto_hike() }); // Add functionality to switch to map page and show map when clicked
        cell.appendChild(button);                                     // Append the button to the table data

        button.setAttribute("hike_id", hike_id);     // Add "hike_id" as a custom attribute to be used by the "active" id when selected
        button.setAttribute("hike_name", hike_name); // Add "hike_name" as a custom attribute to be used by the "active" id when selected
        button.setAttribute("lat", lat);             // Add latitude, "lat", as a custom attribute to be used by the "active" id when selected
        button.setAttribute("long", long);           // Add longitude, "long", as a custom attribute to be used by the "active" id when selected

        return cell; // Return newly created cell to add to the DOM   
    }

// MAPS HELPER FUNCTIONS

    // Add the GMaps script tag to the DOM
    function add_script(url) {
        let map_script = document.createElement("script");  // Create a new script tag to invoke the Google Maps init function
        map_script.setAttribute("src", url);                // Create with the argument "url"
        map_script.setAttribute("class", "map_script");     // Add "map_script" to script to begin Google Map creation
        document.head.appendChild(map_script);              // Add the new script to the DOM
    }

    // Remove the GMaps script tag from the DOM
    function remove_script(url) {
        window.google = {}; // Reset the Google Maps window 
    }

    // Initialize JS Map
    function initMap() {
        let map = new google.maps.Map(document.getElementById("map"), { // Initialize the map
            center: new google.maps.LatLng(0,0),                        // Latitude, longitude parameters to center the map on
            zoom: 10                                                    // Default "zoom" value for how far out the map renders
        });
        marker = add_marker(map);                // Add a Google marker to the map
        marker.addListener('click', function() { // Zoom when clicked 
            map.setZoom(15);                     // Set the new zoom value
            map.setCenter(marker.getPosition()); // Set a new position for the marker
        })
    }

    // Add marker to map at given coordinates and center on the marker
    function add_marker(map) {
        // Get active hike data 
        let data = document.getElementsByClassName("active")[0]; // Select the "active" hike 
        let lat = data.attributes.getNamedItem("lat").value;     // Retrieve the latitude, "lat", from HTML of "active" hike
        let long = data.attributes.getNamedItem("long").value;   // Retrieve the longitude, "long", from HTML of "active" hike

        let marker = new google.maps.Marker({            // Create new Google marker object
            position: new google.maps.LatLng(lat, long), // Set marker at "lat" and "long"
            map: map,                                    // Add to the defined Google map, "map"
            title: 'Click to zoom'                       // Add descriptor to "zoom"
        });

        map.setCenter(marker.position); // Set map center at coordinates
        return marker;                  // Return Google marker object
    }

// WEATHER HELPER FUNCTIONS

    // Add weather to DOM from OpenWeatherMap API 
    function render_weather(weather_list) {

            empty_table("weather_table");                           // Clear the current weather table
            const table = document.getElementById("weather_body");  // Select the table "weather_body"
            const width = 5;                                        // How many days will have weather data
            const height = 6;                                       // How many time slots, 5 for slots and 1 for header
            const elem_per_row = 1;                                 // No use currently, modular option incase each day wants sub rows for more information
            const skip_base = 25 - weather_list.length;             // Used to calculate the offset for time slots that have already passed
            var skip_factor = skip_base * elem_per_row;             // A decreasing value to update the table properly

            for (let i=0; i<height; i++) {          // Loop through rows
                for (let k=0; k<elem_per_row; k++){ // Loop to add sub rows, currently not in use

                    let row = table.insertRow((i * elem_per_row) + k); // Calculate the id to where to insert the row
                    row.id= `weather_row_${i}`;                        // Set a unique row id for styling andaccess

                    // Add the header 
                    if (i == 0) {                       // When accessing the first element, generate the header row instead
                        for (let j=0; j<width; j++) {   // Loop through each potential cell in the width

                            let header_cell = document.createElement("th");   // Create new header
                            if (k == 0) {                                     // When generating the first sub-row, flattening the array must be calculated differently
                                flat = (j * width) + (i-1) - skip_base + 5;   // Special value that deconstructs a 2d array into a flat array, add 5 because you're out of bounds of array
                                if (flat < 0) {                               // When flat is negative, it means there are no available hike times in that day, still want yesterday's date
                                    date = new Date(weather_list[0]["time"]); // Create a new date from the UNIX timestamp
                                    date.setDate(date.getDate() - 1);         // subtract one day

                                    header_cell.innerHTML = `${date.toGMTString().slice(0, -13)}`; // Add converted value to header, drop the extra string info
                                }
                                else {
                                    date = new Date(weather_list[flat]["time"]);                   // Create a new date from the UNIX timestamp
                                    header_cell.innerHTML = `${date.toGMTString().slice(0, -13)}`; // Add converted value to header, drop the extra string info
                                }
                                header_cell.id = `weather_column_${j}`  // Add unique id for styling and access
                                row.append(header_cell);                // Add newly created cell
                            }

                        } 

                    }
                    // Weather entries that aren't the header
                    else { 
                        for (let j=0; j<width; j++) {           // Loop through columns in "weather_table"
                            if (skip_factor > 0 && j == 0 ) {   // Validate that the skip factor is still needed and the loop is in the first column
                                let cell = row.insertCell(j);   // Create a new cell in the row
                                cell.innerHTML = "";            // If skip factor is needed, there is no data to input, set to null
                                skip_factor--;                  // Decrease skip factor to denote that a spot with no data has been filled
                            }
                            // Denotes that no skip needs to happen
                            else {
                                let cell = row.insertCell(j);               // Create a new cell in the row
                                cell.id = `weather_column_${j}`;            // Add unique id for styling and access
                                let flat = (j * width) + (i-1) - skip_base; // Calculate the offset to "flatten" the array from 2d to 1d
                                // Add time label to cell
                                var temp = document.createElement("label");                                                // Create time "label" element
                                date = new Date(weather_list[flat]["time"]);                                               // Convert UNIX timestamp to date object
                                temp.innerHTML = `${date.toGMTString().slice(16, 22)}${date.toGMTString().slice(26, -4)}`; // Set the converted timestamp to a date string, drop non-hour/non-minute bits from string
                                cell.appendChild(temp);                                                                    // Add new label to cell element
                                cell.appendChild(document.createElement("br"));                                            // Create a "break" element and add it to the cell
                                // Add weather image icon to cell
                                var temp = document.createElement("IMG");                                   // Create "img" element
                                temp.src = `/img/${convert_image_tag(weather_list[flat]["weather"])}.png`;  // Convert "weather" descriptor to a file name with helper function
                                temp.alt = `${weather_list[flat]["weather"]}`;                              // Set alt to be the "weather" descriptor for accessibility
                                temp.innerHTML = `${weather_list[flat]["weather"]}`;                        // Set innerHTML to be the "weather" descriptor incase of failure to render
                                cell.appendChild(temp);                                                     // Add new image to cell element
                                // Add weather label (Rain, Clouds, etc)
                                var temp = document.createElement("label");          // Create a "label"
                                temp.innerHTML = `${weather_list[flat]["weather"]}`; // Set innerHTML to be "weather" descriptor
                                cell.appendChild(temp);                              // Add new label to cell element
                                cell.appendChild(document.createElement("br"));      // Create a "break" element and add it to the cell
                                // Add temperature
                                var temp = document.createElement("label");                                                                                                  // Create a temperature "label" element
                                temp.innerHTML = `${Math.round((weather_list[flat]["temp"] - 273.15)*(9/5) + 32)}ºF / ${Math.round(weather_list[flat]["temp"] - 273.15)}ºC`; // Set innerHTML to be "temperature" and convert from Kelvin to Celsius / Fahrenheit
                                cell.appendChild(temp);                                                                                                                      // Add new label to cell element
                                cell.appendChild(document.createElement("br"));                                                                                              // Create a "break" element and add it to the cell
                            }
                        }
                    }
                }
            }
        }

    // Convert a "weather" descriptor to it's equivelant file name
    // the file names can be found in "/img"
    function convert_image_tag(api_name) {
        let ret = "";
        switch (api_name) {     // Process the argument and look for an icon that fits the description
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
        return ret; // Return the output of the switch statement
    }