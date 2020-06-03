/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
API Calls
*/

// Packages/Modules
const axios = require("axios");

module.exports = 
{
    // Convert location input to lat/long coordinates using Geocoding API
    convert_to_coords: function (address, distance) {
        const key = process.env.GOOGLE_API_KEY;
        const url = "https://maps.googleapis.com/maps/api/geocode/json?";
        // Sets distance to 50 miles and address to Oregon if they aren't given
        if(!distance) 
            distance = 50;
        if(!address)
            address = "Oregon";
        _address = JSON.stringify(address);
        // API call //
        return axios.get(`${url}address=${_address}&key=${key}`)
        .then(response => {return response;} )
        .then(proc => {
            // Get latitude and longitude from Geocoding API
            let lat = proc["data"].results[0].geometry.location.lat;
            let long = proc["data"].results[0].geometry.location.lng;
            return this.get_nearby_hikes(lat, long, distance);
        })
        .catch(error => {
            console.log("Geocoding API was not fetched", error);
        });
    },

    // Get list of hikes within x miles of a given location using REI Hiking Project API
    get_nearby_hikes: function (lat, long, dist) {
        const key = process.env.REI_API_KEY;
        const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${key}`;
        return axios.get(url)
        .then (response => { return response["data"].trails; })
        .catch(error => console.log(error));
    },

    // Display a map centered on the hike's coordinates
    get_map: function (lat, long) {
        const key = process.env.GOOGLE_API_KEY;
        const static_url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=10&size=400x400&maptype=terrain&key=${key}`;
        return axios.get(static_url)
        .then (response => { return response; })
        .then (data => console.log(data.config.url))
        .catch(error => console.log(error));
    },

    // Weather Functionality
    get_weather: function (lat, long) { 
        const key = process.env.WEATHER_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${key}`;
        const url_cur = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=currently,minutely,daily&appid=${key}`;

        return axios.get(url_cur)
        .then(cur_resp => {

            // Constants for converting time
            // Reads previous unit converted to new unit
            const ms_hr = 36 * (10**5); // milliseconds in an hour
            const ms_day = ms_hr * 24;  // milliseconds in a day
            const hr_day = 24;          // hours in a day
            const ms = 10**3;           // milliseconds scalar

            // Create Date objects based on the first received date
            var timezone_offset = (cur_resp["data"]["timezone_offset"]) * ms;
            var time_now = (cur_resp["data"].current["dt"] * ms);
            var cur_midnight = time_now - (time_now % ms_day) + timezone_offset; 
            var tom_midnight = cur_midnight + ms_day;
            console.log("Timing things")
            console.log(cur_midnight);
            console.log(tom_midnight);
            console.log(time_now);
            // Usage of the day object
            // var ret_week = {"time": "", "weather": "", "temp": "", "min_temp": "", "max_temp": ""};
            var ret = [];

            let hrs_left = tom_midnight - time_now;
            hrs = 24 - (hrs_left / ms_hr);
            if (hrs >= 18) {                // If 18 hours have passed, no weather data for today
                ret.push({"count": 0});
            }
            else if (hrs < 6) {             // If less than 6 hours have passed, all weather data is available
                ret.push({"count": 5});
            }
            else {
                console.log(Math.ceil(6 - hrs / 3));
                ret.push({"count": Math.ceil(6 - hrs / 3)});
            }

            // Process current day forecast
            
            // Compute timeslots
            let times = [];
            for (let i=0; i<5; i++) {
                times.push(cur_midnight + ( (6 + 3*i) * (ms_hr)) );
                console.log(cur_midnight + ( (6 + 3*i) * (ms_hr)) );
            }
            let max_len = ((cur_resp["data"].hourly).length - (hr_day + Math.floor(hrs))); // output has two days worth of data, only want first day
            console.log(max_len);
            console.log("Entering check phase");
            for (let i=0; i<max_len; i++) {
                let check = cur_resp["data"].hourly[i]["dt"] * ms;
                for (let j=0; j<5; j++) {
                    if (check === times[j]){
                        let ret_day = {}
                        ret_day["time"] = cur_resp["data"].hourly[i]["dt"] * ms;
                        ret_day["temp"] = cur_resp["data"].hourly[i]["temp"];
                        ret_day["min_temp"] = cur_resp["data"].hourly[i]["temp"];
                        ret_day["max_temp"] = cur_resp["data"].hourly[i]["temp"];
                        ret_day["temp"] = cur_resp["data"].hourly[i]["temp"];
                        console.log(ret_day);
                        console.log('. . .');
                    }
                }
            }



            // Get next four day forecast
            return axios.get(url)
            .then (resp => {

                // Ceil to midnight of the next day 
                var time_slots = [];
                let time_zone = (resp["data"].city.timezone) / 3600;

                for (let i=0; i<4; i++){
                    for (let j=(6-time_zone); j<(20+time_zone); j++){
                        // Tomorrow in MS, add additional days, add a 6 hour offset to start at 6:00 am, add 3 hour increments up until 6pm
                        time_slots.push(day_nxt.getTime() + (ms_day * i) + (ms_hr * j) );
                    }
                }
                console.log(time_slots);
                // Gather current day data (multiply by 10^3 (or 10**3) since the response is different than the output data)
                // Seconds vs Milliseconds

                for (let i=0; i<(resp["data"].list).length; i++ ) {
                    let vals = (resp["data"].list[i]["dt"])*ms;
                    // Four day forecast data
                    console.log(vals);
                    for (let j=0; j<time_slots.length; j++){
                        if (vals === time_slots[j]) {
                            let ret_week = {};
                            ret_week["time"] = (resp["data"].list[i]["dt"]) * ms;
                            ret_week["temp"] = resp["data"].list[i]["main"]["temp"];
                            ret_week["min_temp"] = resp["data"].list[i]["main"]["temp_min"];
                            ret_week["max_temp"] = resp["data"].list[i]["main"]["temp_max"];
                            ret_week["weather"] = resp["data"].list[i]["weather"][0]["main"];
                            console.log(ret_week["weather"]);
                            ret.push(ret_week);
                        }
                    }
                }
                console.log(ret);
                return ret;
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    },

    // Air Index Functionality
    get_air: function (lat, long) {
        return 0;
    }

}
    
 


