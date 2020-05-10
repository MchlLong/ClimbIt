/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

/* Starter file for code */

/* Variables */

/* Listeners */

    // Home Button Functionality
    var home_buttons = document.getElementsByClassName("navto_home_page");
    for (var i = 0; i < home_buttons.length; i++){
        home_buttons[i].addEventListener("click", function() { swap_page("home_page") });
    }

    var details_buttons = document.getElementsByClassName("navto_hike_detail_page");
    for (var i = 0; i < home_buttons.length; i++){
        details_buttons[i].addEventListener("click", function() { swap_page("hike_detail_page") });
    }

/* Functions */

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