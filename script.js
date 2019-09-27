getCities();
getCountries();

async function getCities() {
    var cities = await fetch('stad.json')
        .then(response => response.json())
        .catch(error => document.write(error));
    
    cities.sort((a, b) => a.countryid - b.countryid  || b.population - a.population);
    localStorage.setItem("cities", JSON.stringify(cities));
}

async function getCountries() {
    var countries = await fetch('land.json')
        .then(response => response.json())
        .catch(error => document.write(error));
    
    countries.sort((a, b) => (a.countryname < b.countryname) ? -1 : 1);
    localStorage.setItem("countries", JSON.stringify(countries));
}

//console.log(stad, land)

function dropDownList(id){
    var ul = document.getElementById(id);
    
    if (ul.style.display === "none"){
        ul.style.display = "block";
    }
    else{
        ul.style.display = "none";
    }
}

function visitCity(id){
    //var ul = document.getElementById("vCities");
    var div = document.getElementById("s" + id).childNodes[5];
    
    if (div.checked === true){
        addListItem("vCities", "v_" + id, "s" + id);
    }
    else {
        removeChildElement("vCities", "v_" + id);
    }
}

function addListItem(ulId, liId, text){
    var ul = document.getElementById(ulId);
    var li = document.createElement("li");
    li.setAttribute("id", liId);
    li.innerText = text;
    ul.appendChild(li);
}

function removeChildElement(parentId, childId){
    var parent = document.getElementById(parentId);
    var child = document.getElementById(childId);
    parent.removeChild(child);
}