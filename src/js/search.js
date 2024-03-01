"use strict"

let searchBtn = document.getElementById("search-btn");

//Lägger till eventlistener vid klick på sökknapp
searchBtn.addEventListener("click", searchCountry);


async function searchCountry() {
    let searchInput = document.getElementById("recipe-search").value;


    //Hämtar specifik land api från Restcountries
    const url = "https://restcountries.com/v3.1/name/" + searchInput;

    //Kör fetch på url som returnerar en promise
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);

    } catch (error) {
        console.error(error); //Vid fel körs error meddelande i konsollen
    }
}


async function displayFlags() {
    
}
