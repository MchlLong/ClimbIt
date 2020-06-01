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
            const hour = 1080 * (10**3);
            const ms_hr = 36 * (10**5); 
            const hr_day = 24;
            const ms = 10**3;
            var day_nxt = new Date();
            var day_cur = new Date();

            var temp = (cur_resp["data"].current["dt"]) * ms;
            console.log(temp);
            var day_time = new Date(temp);

            var temp = day_time.getDate();
            day_time.setDate(temp);

            // Ceil to midnight of the next day 
            var temp = day_nxt.getDate() + 1;
            day_nxt.setDate(temp);
            day_nxt.setHours(0, 0, 0, 0);

            // Floor to midnight of the current day
            var temp = day_cur.getDate();
            day_cur.setDate(temp);
            day_cur.setHours(0, 0, 0, 0);

            // Usage of the day object
            // var ret_week = {"time": "", "weather": "", "temp": "", "min_temp": "", "max_temp": ""};
            var ret = [];
            console.log(day_nxt.getTime());
            let curr = day_nxt.getTime() - day_time.getTime();
            console.log((day_nxt.getTime() - ms_hr * 3));

            hrs = 24 - (curr / ms_hr);
            if (hrs >= 18) {
                ret.push({"count": 0});
            }
            else if (hrs < 6) {
                ret.push({"count": 5});
            }
            else {
                console.log(Math.ceil(6 - hrs / 3));
                ret.push({"count": Math.ceil(6 - hrs / 3)});
            }
            console.log("Current time (epoch): " + curr);
            console.log(24 - (curr / ms_hr));

            // Process current day forecast
            
            // Compute timeslots
            let times = [];
            for (let i=0; i<5; i++) {
                times.push(day_cur.getTime() + ( (6 + 3*i) * (ms_hr)) );
                console.log(day_cur.getTime() + ( (6 + 3*i) * (ms_hr)) );
            }
            let max_len = ((cur_resp["data"].hourly).length - (hr_day + Math.floor(hrs))); // output has two days worth of data, only want first day
            console.log(max_len);
            for (let i=max_len; i>0; i--) {
                let check = cur_resp["data"].hourly[i]["dt"];
                console.log(check);
            }



            // Get next four day forecast
            return axios.get(url)
            .then (resp => { 
                // Gather current day data (multiply by 10^3 (or 10**3) since the response is different than the output data)
                // Seconds vs Milliseconds
                for (let i=0; i<(resp["data"].list).length; i++ ) {
                    let vals = (resp["data"].list[i]["dt"])*ms;
                    // Four day forecast data
                    if (vals > day_nxt) {
                        let ret_week = {};
                        ret_week["time"] = (resp["data"].list[i]["dt"])*(10**3);
                        ret_week["temp"] = resp["data"].list[i]["main"]["temp"];
                        ret_week["min_temp"] = resp["data"].list[i]["main"]["temp_min"];
                        ret_week["max_temp"] = resp["data"].list[i]["main"]["temp_max"];
                        ret_week["weather"] = resp["data"].list[i]["weather"][0]["main"];
                        console.log(ret_week["weather"]);
                        ret.push(ret_week);
                    }
                }

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
    
 


