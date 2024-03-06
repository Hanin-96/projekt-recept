"use strict"

let searchBtn = document.getElementById("search-btn");

//Lägger till eventlistener vid klick på sökknapp
searchBtn.addEventListener("click", displayCountry);

//Hämtar api för restcountries
async function searchCountry() {
    let searchInput = document.getElementById("recipe-search").value;


    //Hämtar specifik land api från Restcountries
    const url = "https://restcountries.com/v3.1/name/" + searchInput + "?fullText=true";

    //Kör fetch på url som returnerar en promise
    try {
        let response = await fetch(url);

        let data = await response.json();
        console.log(data);
        
        return data[0];//Hämtar första index


    } catch (error) {
        console.error(error); //Vid fel körs error meddelande i konsollen
        return null;
    }
}

//Funktion som skriver ut datan i form av flagga
async function displayCountry() {
    document.getElementById("flag").innerHTML = "";

    let country = await searchCountry();
    document.querySelector(".flag-wrap").style.display = "block"; //Gör css stil för flag-wrap aktiv

    if (country) {
        document.getElementById("flag").innerHTML =
            `<img src="${country.flags.svg}" alt="${country.flags.alt}">`; //Skriver ut flaga

        document.querySelector(".country-name").innerHTML = `<p>"${countryName}"</p>`//Skriver ut land
    }
    else {
        return document.getElementById("flag").innerHTML = "<p>Country not found</p>";
    }

}






