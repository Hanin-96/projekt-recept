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
    document.querySelector(".country-name").innerHTML = "";
    document.getElementById("recipe-list").innerHTML = "";

    let country = await searchCountry();
    document.querySelector(".flag-wrap").style.display = "block"; //Gör css stil för flag-wrap aktiv

    if (country) {
        document.getElementById("flag").innerHTML =
            `<img src="${country.flags.svg}" alt="${country.flags.alt}">`; //Skriver ut flaga

        let countryName = country.name.common;
        document.querySelector(".country-name").innerHTML = `<p>${countryName}</p>`//Skriver ut land
    }
    else {
        return document.getElementById("flag").innerHTML = "<p>Country not found</p>";
    }


    //Printa ut recept
    let recipees = await searchRecipe(country.demonyms.eng.m);

    //Skriver ut alla recept som finns dvs namn och foton
    if (recipees && recipees.length > 0) {

        let recipeList = document.getElementById("recipe-list");
        recipees.forEach((recipe) => {

            //skapar nytt div element för recept
            let recipeWrap = document.createElement("div");
            recipeWrap.className = "recipe-wrap";

            //skapar nytt p element för recept
            let p = document.createElement("p");
            let pText = document.createTextNode(recipe.title);
            p.appendChild(pText);

            //skapar nytt img element för recept
            let imgRecipe = document.createElement("img");
            imgRecipe.src = recipe.image;
            imgRecipe.alt = recipe.title;

            //Slå ihop med recipeWrap
            recipeWrap.appendChild(p);
            recipeWrap.appendChild(imgRecipe);
            recipeList.appendChild(recipeWrap);

            recipeWrap.addEventListener("click", () => {
                let plateWrap = document.querySelector(".plate-wrap");
                let plateText = document.querySelector(".plate-text");

                plateText.innerHTML = "";

                //Slå ihop h2 innehåll
                let recipeH2 = document.createElement("h2");
                let recipeH2Text = document.createTextNode(recipe.title);
                recipeH2.appendChild(recipeH2Text);

                //Slå ihop p innehåll
                let recipePEl = document.createElement("p");
                recipePEl.innerHTML = recipe.summary;

                let recipeIngredients = document.createElement("div");
                console.log(recipe)
                recipe.extendedIngredients.forEach((ingredient) => {
                    let ingredientP = document.createElement("p");
                    let ingredientText = document.createTextNode(ingredient.original);

                    ingredientP.appendChild(ingredientText);
                    recipeIngredients.appendChild(ingredientP);
                });
                //Slå ihop div innehåll
                plateText.appendChild(recipeH2);
                plateText.appendChild(recipePEl);
                plateText.appendChild(recipeIngredients);
                plateWrap.appendChild(plateText);
                

            })

        });

    } else {
        document.getElementById("recipe-list").innerHTML = "<p>Recipees not found</p>";
    }

}

async function searchRecipe(country) {

    //Hämtar specifik recept beroende på land
    const recipeUrl = "https://api.spoonacular.com/recipes/complexSearch?query=" + country + "&apiKey=a27a5cdda1734a16ab18c52ed375e373&number=20&addRecipeInformation=true&fillIngredients=true";
    //Kör fetch på url som returnerar en promise
    try {
        let response = await fetch(recipeUrl);

        let recipeData = await response.json();
        console.log(recipeData);

        return recipeData.results;


    } catch (error) {
        console.error(error); //Vid fel körs error meddelande i konsollen
        return null;
    }

}






