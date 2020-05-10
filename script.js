/*
Bryttanie House, Michael Long
CS465 -- Project 2: Hiking Project
Javascript Webpage Controller
*/

/* Starter file for code */

/* Variables */

/* Listeners */
var home_buttons = document.getElementsByClassName("navto_home_page");

for (var i = 0; i < home_buttons.length; i++){
    home_buttons[i].addEventListener("click", function() { swap_page("navto_home_page") });
}

/* Functions */

function swap_page(to_go) {
    alert(to_go);
    /* Remove all visibility from pages */
    /*
    let pages = document.getElementsByClassName("visible").querySelectorAll("div");
    let i = 0;
    for (i = 0; i < pages.length; i++){
        pages[i].classList.remove("visible");
        pages[i].classList.add("invisible");
    }
    */
    /* Make your page visible */
    /*
    let current = document.getElementsByClassName(to_go).querySelectorAll("div");
    for (i = 0; i < current.length; i++){
        current[i].classList.add("visible");
        current[i].classList.remove("invisible");
    }
    */
}