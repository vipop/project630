document.addEventListener("DOMContentLoaded", function(event) {
   if(sessionStorage.getItem("userId") != null){
		displayFullContent();
	}
});

window.onload = function() {
	city = getCity();
	getCityInformation(city); //queries from database
};



function loadCity(city, json){
	//top basic information
    var cityName = json.data.general.name;
	var country = json.data.general.country;
	var language = json.data.languages[0].name;
	var languages = json.data.languages;
	var pop = json.data.general.population;
	var area = json.data.general.area + " km&sup2;";
	var lat = json.data.general.lat;
	var lng = json.data.general.lng;
	var gdp = json.data.general.gdp;
	//Background
	var history = json.data.general.history;
	//Overview
	var ovHappiness = json.data.ratings[0].happiness;
	var ovEntertainment = json.data.ratings[0].entertainment;
    var ovHealthcare = json.data.ratings[0].healthcare;
	var ovEducation = json.data.ratings[0].education;
	var ovHousing = json.data.ratings[0].housing;
	var ovCrime = json.data.ratings[0].crime;
	//Housing and Utilities
	var housing = json.data.housing;
	var utilities = json.data.utilities;
    console.log("Utilities: ");
    console.log(utilities);
	//Transportation
	var transportation = json.data.transportation;
	//Climate
	var climate = json.data.climate;
	//Entertainment
	var entertainments = json.data.entertainment;
	//Attractions
	var attractions = json.data.attractions;
	//Food
	var food = json.data.food;
	//Indices happiness quality of life
	var indices = json.data.indices;

	initTopInfo(country,language, pop, area, gdp);
	initCityBanner(city, cityName);
	initMap(parseFloat(lat), parseFloat(lng), document.getElementById("map-div"));
	initBackground(history);
	initOverview(ovHappiness, ovEntertainment, ovHealthcare, ovEducation, ovHousing, ovCrime);
	initHousing(housing);
	initTransportation(transportation);
	initEntertainment(entertainments);
	initAttraction(attractions)
	initIndices(indices);
	initFood(food);
	prepareGraphs();
	var tempLang = [{"lang":languages,"theId":document.getElementById("languages-chart-div")}];
	var tempClimate = [{"climate":climate[0],"theTemp":document.getElementById("climate-bar-temp"),"theFall":document.getElementById("climate-bar-fall")}];
	var tempUtility = [{"uti":utilities,"theId":document.getElementById("utilities-chart-div")}];
	loadGraphs(tempLang,tempClimate,tempUtility);
	loadComments(json); //This function is defined in the comments.js
}
function getCityInformation(city){
	var url = "cgi-bin/queries.php";
	var params = "type=QUERY_CITY&city_id=" + city;
	sendRequest(url,params,
			function(result){
                console.log(result);
                var json = JSON.parse(result);
                console.log(json);
				if(json.code == 0){
					loadCity(city, json);
					//return json;
				}
			},function(){
			console.log("Fail to receive city information");
	});
}

function getCity(){
	var search = new URLSearchParams(window.location.search);
	var city = search.get('city');
	return city;
};

function initTopInfo(country, lang, pop, area, gdp) {
	document.getElementById("top-info-country").innerHTML = country;
	document.getElementById("top-info-lang").innerHTML = lang;
	document.getElementById("top-info-pop").innerHTML = pop;
	document.getElementById("top-info-area").innerHTML = area;
	document.getElementById("top-info-gdp").innerHTML = gdp;
}

function initCityBanner(city, cityName){
	document.getElementById("header-text").innerHTML = cityName.toUpperCase();
	document.getElementById("header").style.backgroundImage = "url('images/" + city + "Image.jpg')";
}

function initBackground(background) {
	document.getElementById("background").innerHTML = background;
}

function initOverview(ovHappiness, ovEntertainment, ovHealthcare, ovEducation, ovHousing, ovCrime) {
	// set color, text and width of happiness bar
	document.getElementById("ov-happiness-bar").style["background-color"] = "#eec485";
	document.getElementById("ov-happiness").innerHTML = ovHappiness + " / 5";
	document.getElementById("ov-happiness-bar").style.width = ovHappiness * 20 + "%";
	// set color, text and width of entertainment bar
	document.getElementById("ov-entertainment-bar").style["background-color"] = "#80ba52";
	document.getElementById("ov-entertainment").innerHTML = ovEntertainment + " / 5";
	document.getElementById("ov-entertainment-bar").style.width = ovEntertainment * 20 + "%";
	// set color, text and width of healthcare bar
	document.getElementById("ov-healthcare-bar").style["background-color"] = "#b44545";
	document.getElementById("ov-healthcare").innerHTML = ovHealthcare + " / 5";
	document.getElementById("ov-healthcare-bar").style.width = ovHealthcare * 20 + "%";
	// set color, text and width of education bar
	document.getElementById("ov-education-bar").style["background-color"] = "#2c5a71";
	document.getElementById("ov-education").innerHTML = ovEducation + " / 5";
	document.getElementById("ov-education-bar").style.width = ovEducation * 20 + "%";
	// set color,text and width of housing bar
	document.getElementById("ov-housing-bar").style["background-color"] = "lightpink";
	document.getElementById("ov-housing").innerHTML = ovHousing + " / 5";
	document.getElementById("ov-housing-bar").style.width = ovHousing * 20 + "%";
	// set color, text and width of crime bar
	document.getElementById("ov-crime-bar").style["background-color"] = "#555555";
	document.getElementById("ov-crime").innerHTML = ovCrime + " / 5";
	document.getElementById("ov-crime-bar").style.width = ovCrime * 20 + "%";
}

function initHousing(house){
	var i;
	resetFields("housingDisplay")
	for(i = 0; i < house.length; i++){
		if(house[i].type == "Appartment" ){
			if(house[i].payment =="Buy"){
				initHousingHelper("building",house[i].payment,house[i].cost,house[i].cost_desc,"");
			}else{
				var temp = house[i].cost_desc.split("/");
				initHousingHelper("building",house[i].payment,house[i].cost,temp[0],"/"+temp[1]);
			}
		}
		else {
			if(house[i].payment =="Buy"){
				initHousingHelper("home",house[i].payment,house[i].cost,house[i].cost_desc,"");
			}else{
				var temp = house[i].cost_desc.split("/");
				initHousingHelper("home",house[i].payment,house[i].cost,temp[0],"/"+temp[1]);
			}
		}
	}
};

function initHousingHelper(glif,payment,cost,pre,post){
	var h4El = document.createElement("H4");
	var div = document.createElement("DIV");
	div.setAttribute("class","flex");
	var spanEl = document.createElement("SPAN");
	spanEl.setAttribute("class","fa fa-"+glif);
	var headerText = document.createTextNode("Average " + payment);
	div.appendChild(spanEl);
	div.appendChild(headerText);
	var h2 = document.createElement("H4");
	h2.setAttribute("style","padding-top:5px;text-align:center");
	var h2Text = document.createTextNode(pre+cost+post);
	h2.appendChild(h2Text);
	h4El.appendChild(div);
	h4El.appendChild(h2);
	document.getElementById("housingDisplay").appendChild(h4El);
}

function initTransportation(tran){
	var i;
	resetFields("transportation");
	for(i = 0; i < tran.length; i++){
		var temp = tran[i].cost_desc.split("/");
		if(temp[1] != null){
			var row = document.createElement("div");
			row.style.display = "flex";
			var g = document.createElement("p");
			g.style.width = "20%";
			g.style.display = "flex";
			switch (tran[i].type) {
				case "Subway":
					g.innerHTML = '<i class="fa fa-subway center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Train":
					g.innerHTML = '<i class="fa fa-train center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Car":
					g.innerHTML = '<i class="fa fa-car center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Bus":
					g.innerHTML = '<i class="fa fa-bus center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Taxi":
					g.innerHTML = '<i class="fa fa-taxi center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "RideShare":
					g.innerHTML = '<i class="fa fa-car center-block global-glyphs" aria-hidden="true"></i>';
					break;
			}
			var p = document.createElement("p");
			p.style.width = "30%";
			p.innerHTML =  "<h4>" + tran[i].type + "</h4>";
			var p2 = document.createElement("p");
			p2.style.width = "50%";
			p2.innerHTML = "<h4 style='margin-left: 35px;'>Ticket: " + temp[0] + tran[i].cost + " " + temp[1];"<h4>";
			row.appendChild(g);
			row.appendChild(p);
			row.appendChild(p2);
			document.getElementById("transportation").appendChild(row);
			//printHelper(tran[i].type,tran[i].cost,temp[0],temp[1],"","transportation");
		}else{
			var row = document.createElement("div");
			row.style.display = "flex";
			var g = document.createElement("p");
			g.style.width = "20%";
			g.style.display = "flex";
			switch (tran[i].type) {
				case "Subway":
					g.innerHTML = '<i class="fa fa-subway center-block 16pt global-glyphs" aria-hidden="true"></i>';
					break;
				case "Train":
					g.innerHTML = '<i class="fa fa-train center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Car":
					g.innerHTML = '<i class="fa fa-car center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Bus":
					g.innerHTML = '<i class="fa fa-bus center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "Taxi":
					g.innerHTML = '<i class="fa fa-taxi center-block global-glyphs" aria-hidden="true"></i>';
					break;
				case "RideShare":
					g.innerHTML = '<i class="fa fa-car center-block global-glyphs" aria-hidden="true"></i>';
					break;
			}
			var p = document.createElement("p");
			p.style.width = "30%";
			p.innerHTML =  "<h4>" + tran[i].type + "</h4>";
			var p2 = document.createElement("p");
			p2.style.width = "50%";
			p2.innerHTML = "<h4 style='margin-left: 35px;'>Ticket: " + temp[0] + tran[i].cost + "<h4>";
			row.appendChild(g);
			row.appendChild(p);
			row.appendChild(p2);
			document.getElementById("transportation").appendChild(row);
			//printHelper(tran[i].type,tran[i].cost,temp[0],"","","transportation");
		}
	}
};

function initIndices(ind){
	var i;
	resetFields("qualityOfLife");
	for(i = 0; i < ind.length; i++){
		printHelper(ind[i].name,ind[i].value,"",ind[i].value_desc,"","qualityOfLife");
	}
};

function initFood(food){
	var i;
	resetFields("food");
	for(i = 0; i < food.length; i++){
		var temp = food[i].cost_desc.split("/");
		if(temp[1] != undefined){
			printHelper(food[i].type,food[i].cost,temp[0],temp[1],"/","food");
		}else{
			printHelper(food[i].type,food[i].cost,temp[0],"","","food");
		}
	}
};

function initEntertainment(ent){
	var i;
	resetFields("entertainment");
	for(i = 0; i < ent.length; i++){
		var temp = ent[i].cost_desc.split("/");
		if(temp[1] != undefined){
			printHelper(ent[i].type,ent[i].cost,temp[0],temp[1],"/","entertainment");
		}else{
			printHelper(ent[i].type,ent[i].cost,temp[0],"","","entertainment");
		}
	}
};

function printHelper(headerText,value,pre,post,divider,panelId){
		var h4 = document.createElement("H4");
		var div = document.createElement("DIV");
		div.setAttribute("class","flex");
		var hText = document.createTextNode(headerText+":");
		h4.appendChild(hText);
		var p = document.createElement("P");
		var pText = document.createTextNode(pre + value + divider + post);
		p.setAttribute("class","inlineP");
		p.appendChild(pText);
		div.appendChild(h4);
		div.appendChild(p);
		document.getElementById(panelId).appendChild(div);
};

function initAttraction(att){
	var i;
	resetFields("attractions");
	for(i = 0; i < att.length; i++){
		var temp = att[i].cost_desc.split("/");
		if(temp[1] != undefined){
			initAttractionHelper(att[i].name,att[i].about,att[i].cost,temp[0],temp[1],att[i].image,att[i].link,att[i].location,"attractions");
		}else{
			initAttractionHelper(att[i].name,att[i].about,att[i].cost,temp[0],"",att[i].image,att[i].link,att[i].location,"attractions");
		}
	}
}

function initAttractionHelper(name,about,cost,pre,post,imgUrl,webLink,location,panelId){
	var containerDiv = document.createElement("DIV");
	var table = document.createElement("TABLE");
	var tr = document.createElement("Tr");
	var tdImg = document.createElement("Td");
	var tdContent =document.createElement("Td");

	var img = document.createElement("IMG");
	img.setAttribute("class","attractImg");
	img.setAttribute("src",imgUrl);


	var h3 = document.createElement("H3");
	h3.setAttribute("class","paddingNeeded");
	var h3Text = document.createTextNode(name);
	h3.appendChild(h3Text);

	var aboutP = document.createElement("P");
	aboutP.setAttribute("class","paddingNeeded");
	var aboutPText = document.createTextNode("Description: " + about);
	aboutP.appendChild(aboutPText);

	var costP = document.createElement("P");
	costP.setAttribute("class","paddingNeeded");
	var costPText = document.createTextNode("Cost: " + pre + cost + post);
	costP.appendChild(costPText);

	var locationP = document.createElement("P");
	locationP.setAttribute("class","paddingNeeded");
	var locationPText = document.createTextNode("Address: " + location);
	locationP.appendChild(locationPText);

	var linkA = document.createElement("A");
	linkA.setAttribute("class","paddingNeeded");
	linkA.setAttribute("src",webLink);
	var linkAText = document.createTextNode("Website: " + webLink);
	linkA.appendChild(linkAText);


	tdImg.appendChild(img);
	tdContent.appendChild(h3);
	tdContent.appendChild(aboutP);
	tdContent.appendChild(costP);
	tdContent.appendChild(locationP);
	tdContent.appendChild(linkA);

	tr.appendChild(tdImg);
	tr.appendChild(tdContent);
	table.appendChild(tr);
	containerDiv.appendChild(table);
	document.getElementById(panelId).appendChild(containerDiv);

}

function resetFields(parentID){
	while(document.getElementById(parentID).firstChild){
		document.getElementById(parentID).removeChild(document.getElementById(parentID).firstChild);
	}
}
function compare(){
	var id = getCity();
	document.location.href = "compare.html?city=" + id;
};

function initMap(latitude, longitude, container) {
    var location = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(container, {
      zoom: 5,
      center: location,
	  styles: [{"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},
    			{"featureType": "poi","elementType": "labels","stylers": [{"visibility": "off"}]},
    			{"featureType": "transit","elementType": "labels.text","stylers": [{"visibility": "off"}]}]
			});
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	var latlng = {lat: latitude, lng: longitude};
	geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === 'OK') {
	      if (results[0]) {
	        map.setZoom(9);
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
  	});
}
//Overview tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
