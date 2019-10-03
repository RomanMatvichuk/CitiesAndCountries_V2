//Variabler
var visitedCities = [];
var metPeople = 0;
var cityData = "";
var countryData = "";

//Startas funktionen
getList();

//Fylls listor med data från Json filer
async function getList() {
        var cities = await fetch('stad.json')
            .then(response => response.json())
            .catch(error => document.write(error));
        cities.sort((a, b) => a.countryid - b.countryid  || b.population - a.population);
        cityData = JSON.stringify(cities);

        var countries = await fetch('land.json')
            .then(response => response.json())
            .catch(error => document.write(error));
        countries.sort((a, b) => (a.countryname < b.countryname) ? -1 : 1);
        countryData = JSON.stringify(countries);

    if (localStorage.getItem("visitedCities") !== null){
        visitedCities = JSON.parse(localStorage.getItem("visitedCities"));
    }    
    
    var cities = await JSON.parse(cityData);
    var countries = await JSON.parse(countryData);
    
    var htmlLines = "";

    for (var i = 0; i < countries.length; i++) {
        htmlLines += "<li><a href=\"javascript:dropDownList(\'l_" + countries[i].id + "\');\">" + countries[i].countryname + "</a></li>\n";
        htmlLines += "<li><ul id='l_" + countries[i].id + "' style='display: none'>\n";
        
        for (var j = 0; j < cities.length; j++) {
            if (countries[i].id === cities[j].countryid){
                htmlLines += "<li><a id=\"a_" + cities[j].id + "\" href=\"javascript:dropDownList(\'" + cities[j].id + "\');\">" + cities[j].stadname + "</a></li>\n";
                htmlLines += "<li><div id='" + cities[j].id + "' class='info space' style='display: none'>\n";
                htmlLines += "<p><strong>" + cities[j].stadname + "</strong></p>\n";
                htmlLines += "<p><strong>(" + countries[i].countryname + ")</strong></p>\n";
                htmlLines += "<p>" + cities[j].population + " invånare</p>\n";
                htmlLines += "<input id=\"b_" + cities[j].id + "\" type=\"checkbox\" value=\"true\" ";
                htmlLines += "onclick=\"visitCity(" + cities[j].id + ", \'" + cities[j].stadname + " (" + countries[i].countryname + ") " + "\')\">\n"
                htmlLines += "<label for='b_" + cities[j].id + "'>Besökt</label></div></li>\n";
            }            
        } 

        htmlLines += "</ul></li>";
    }

    document.getElementById("lands").innerHTML = htmlLines;

    if (visitedCities.length !== 0){
        for (var i = 0; i < visitedCities.length; i++){
            var city = getCityData(visitedCities[i].id);
            document.getElementById("b_" + city.id).checked = true;
            document.getElementById("a_" + city.id).innerText += " (besökt)";
            addListItem("vCities", "v_" + city.id, city.stadname + " (" + getCountryData(city.countryid).countryname + ") (" + city.population + " invånare)");
            metPeople += city.population;
        }
    }

    checkVisitedCities();
    metPeopleRaport();
}

//Ansvar för att visa och dölja listor
function dropDownList(id){
    var element = document.getElementById(id);
    
    if (element.style.display === "none"){
        element.style.display = "block";
        hideInfo(id);
    }
    else{
        element.style.display = "none";
    }
}

//Kontrolerar listor. Bara en lista av städer och stadens detaljer kan vara öppen.
function hideInfo(id){
    
    if (id.charAt(0) === "l"){
        for (var i = 1; i < JSON.parse(countryData).length + 1; i++){
            if ("l_" + i.toString() !== id){
                document.getElementById("l_" + i).style.display = "none";
            }            
        }
    }

    for (var i = 1; i < JSON.parse(cityData).length + 1; i++){
        if (i.toString() !== id){
            document.getElementById(i).style.display = "none";
        }            
    }
}

//Lägger en stad till listan "Besökta städer"
function visitCity(id, name){
    var cb = document.getElementById("b_" + id);
    var peopleQty = getCityData(id).population;
    
    if (cb.checked === true){
        document.getElementById("a_" + id).innerText += " (besökt)";
        addListItem("vCities", "v_" + id, name + " (" + peopleQty + " invånare)");
        metPeople += peopleQty;
        var object = {id: id};
        visitedCities.push(object);        
    }
    else {
        var str = document.getElementById("a_" + id).innerText
        document.getElementById("a_" + id).innerText = str.substring(0, str.length - 9);
        removeChildElement("vCities", "v_" + id);
        metPeople -= peopleQty;
        for (var i = 0; i < visitedCities.length; i++){
            if (visitedCities[i].id === id){
                visitedCities.splice(i, 1);
            }
        }
    }

    metPeopleRaport();
    saveVisitedInfo();
    checkVisitedCities();
}

//Returnerar en stad efter id
function getCityData(id){
    var data = JSON.parse(cityData);
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            var object = {id: data[i].id, stadname: data[i].stadname, countryid: data[i].countryid, population: data[i].population};
            return object;
        }
    }
}

//Returnerar ett land efter id
function getCountryData(id){
    var data = JSON.parse(countryData);
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            var object = {id: data[i].id, countryname: data[i].countryname};
            return object; 
        }
        
    }
}

//Lägger till ett listelement till ul
function addListItem(ulId, liId, text){
    var ul = document.getElementById(ulId);
    var li = document.createElement("li");
    li.setAttribute("id", liId);
    li.innerText = text;
    ul.appendChild(li);
    sortList();
}

//Plockar bort ett listelement från ul
function removeChildElement(parentId, childId){
    var parent = document.getElementById(parentId);
    var child = document.getElementById(childId);
    parent.removeChild(child);
    sortList();
}

//Spara data om besökta städer
function saveVisitedInfo (){
    localStorage.setItem("visitedCities", JSON.stringify(visitedCities));
}

//Räknar om människor som man har träffat
function metPeopleRaport(){
    document.getElementById("metPeople").innerText = "Träffades " + metPeople + " människor";
}

//Kontrolerar om det finns besökta städer
function checkVisitedCities(){
    if (visitedCities.length === 0){
        document.getElementById("visited").style.display = "none";
    }
    else{
        document.getElementById("visited").style.display = "block";
    }
}

//Raderas historiken
function emtyData(){
    localStorage.clear();
    location.reload(true);
}

// W3Schools listsorteringsfunktion
function sortList(id) {
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("vCities");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("li");
      // Loop through all list-items:
      for (i = 0; i < (b.length - 1); i++) {
        // start by saying there should be no switching:
        shouldSwitch = false;
        /* check if the next item should
        switch place with the current item: */
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          /* if next item is alphabetically
          lower than current item, mark as a switch
          and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
      }
    }
  }