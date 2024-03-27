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
    let recipes = await searchRecipe(country.demonyms.eng.m);

    reset();

    //Skriver ut alla recept som finns dvs namn och foton
    if (recipes && recipes.length > 0) {

        let recipeList = document.getElementById("recipe-list");
        recipeList.replaceChildren();

        recipeList.style.display = "flex";
        recipes.forEach((recipe) => {
            createRecipe(recipe, recipeList);
        });

    } else {
        document.getElementById("recipe-list").innerHTML = "<p>Recipes not found</p>";
        document.getElementById("recipe-list").style.display = "block";
    }

}

function createRecipe(recipe, recipeList) {
    //skapar nytt div element för recept
    let recipeWrap = document.createElement("div");
    recipeWrap.className = "recipe-wrap";

    //skapar nytt p element för recept
    let p = document.createElement("p");
    let pText = document.createTextNode(recipe.title);
    p.appendChild(pText);
    p.style.fontWeight = "600";

    //skapar nytt img element för recept
    let imgRecipe = document.createElement("img");
    imgRecipe.src = recipe.image;
    imgRecipe.alt = recipe.title;

    //Slå ihop med recipeWrap
    recipeWrap.appendChild(p);
    recipeWrap.appendChild(imgRecipe);
    recipeList.appendChild(recipeWrap);

     //Scrolla ner till avsnitt
     recipeList.scrollIntoView();

    recipeWrap.addEventListener("click", () => {
        displayRecipe(recipe);
    });
}

async function displayRecipe(recipe) {
    let plateWrap = document.querySelector(".plate-wrap");
    let plateText = document.querySelector(".plate-text");
    let redBar = document.querySelector(".red-bar");
    
    plateWrap.style.display = "flex";
    redBar.style.display = "block";

    //Scrolla ner till avsnitt
    plateWrap.scrollIntoView();

    //Slå ihop img för specifik recept
    let plateContainer = document.querySelector(".plate-container");
    let plateImgDiv = document.querySelector(".plate-image");
    let plateImgEl = document.createElement("img");

    plateText.innerHTML = "";
    plateImgDiv.innerHTML = "";

    plateImgEl.src = recipe.image;
    plateImgEl.alt = recipe.title;
    plateImgDiv.appendChild(plateImgEl);
    plateContainer.appendChild(plateImgDiv);

    //Slå ihop h2 innehåll
    let recipeH2 = document.createElement("h2");
    let recipeH2Text = document.createTextNode(recipe.title);
    recipeH2.appendChild(recipeH2Text);

    //h3 text för ingredienser
    let recipeH3 = document.createElement("h3");
    let recipeH3Text = document.createTextNode("Ingredients:");
    recipeH3.appendChild(recipeH3Text);

    //h3 text för ingredienser
    let instructionsH3 = document.createElement("h3");
    let instructionsH3Text = document.createTextNode("Instructions:");
    instructionsH3.appendChild(instructionsH3Text);


    let recipeIngredients = document.createElement("ul");
    recipeIngredients.className = "ingredients-list";

    //Vid uppreppning, ta bort dubbla samma ingredienser
    recipe.extendedIngredients = removeDuplicateIngredients(recipe.extendedIngredients);

    recipe.extendedIngredients.forEach((ingredient) => {
        let ingredientLi = document.createElement("li");
        let ingredientTextLi = document.createTextNode(ingredient.original);

        ingredientLi.appendChild(ingredientTextLi);
        recipeIngredients.appendChild(ingredientLi);
    });

    let instructionsEl = document.createElement("ul");
        instructionsEl.className = "steps-list";

   
        let instruction = await getInstructions(recipe.id);

    if (instruction && instruction.steps.length > 0) {
        
        //Skriv ut lista på steg för steg instruktioner för recept
        instruction.steps.forEach((step) => {
            let stepLi = document.createElement("li");
            let stepTextLi = document.createTextNode(step.step);

            stepLi.appendChild(stepTextLi);
            instructionsEl.appendChild(stepLi);
        });


    }

    //Skapa ny div element
    let plateRecipeText = document.createElement("div");
    plateRecipeText.className = "plate-recipe-text";

    //Slå ihop div innehåll
    plateRecipeText.appendChild(recipeH2);
    plateRecipeText.appendChild(recipeH3);
    plateRecipeText.appendChild(recipeIngredients);
    plateRecipeText.appendChild(instructionsH3);
    plateRecipeText.appendChild(instructionsEl);

    //Slå ihop skapade div med existerande div från html
    plateText.appendChild(plateRecipeText);
}

async function searchRecipe(country) {

    //Hämtar specifik recept beroende på land
    //API-nyckel a27a5cdda1734a16ab18c52ed375e373
    const recipeUrl = "https://api.spoonacular.com/recipes/complexSearch?query=" + country + "&apiKey=458947a7158e4062a08192e20a720fbc&number=20&addRecipeInformation=true&fillIngredients=true&type=main+course,breakfast,soup,bread,appetizer,salad,side+dish";
    //Kör fetch på url som returnerar en promise
    try {
        let response = await fetch(recipeUrl);

        let recipeData = await response.json();

        return recipeData.results;


    } catch (error) {
        console.error(error); //Vid fel körs error meddelande i konsollen
        return null;
    }

}

function reset() {

    let plateText = document.querySelector(".plate-text");
    plateText.replaceChildren();


    let plateWrap = document.querySelector(".plate-wrap");
    let redBar = document.querySelector(".red-bar");


    plateWrap.style.display = "none";
    redBar.style.display = "none"

}

//Tar bort alla dubletter dvs ingredienser som har samma id
function removeDuplicateIngredients(ingredients) {
    let uniqueIngredients = [];
    let uniqueIds = [];

    ingredients.forEach(ingredient => {
        if (!uniqueIds.includes(ingredient.id)) {
            uniqueIngredients.push(ingredient);
            uniqueIds.push(ingredient.id);
        }
    });
    return uniqueIngredients;
}

async function getInstructions(recipeId) {
    const recipeUrl = "https://api.spoonacular.com/recipes/" + recipeId + "/analyzedInstructions?apiKey=458947a7158e4062a08192e20a720fbc";
    //Kör fetch på url som returnerar en promise
    try {
        let response = await fetch(recipeUrl);

        let instructionsData = await response.json();
        return instructionsData[0];


    } catch (error) {
        console.error(error); //Vid fel körs error meddelande i konsollen
        return null;
    }
}




