// Map
o.map = {
	hidden: true
};
o.map.init = function () {

	//for mobile devices redirect to projects page
	if ($(window).width() < 769) {
		window.location = "/projects";
		return;
	}

	var url = $("#map-container").attr("data-url");
	Snap.load( url + "map_logo.svg", function(d) {

		//don't append map for mobile devices
		if (o.w.w > 500) {
			
			o.map.countries = d.select(".countries");
			o.s.append(o.map.countries);
			o.map.countries.attr({
				opacity: 1
			});
			o.map.countries.selectAll("polygon, path").attr({
				fill: "#ffffff",
				stroke: "#ccc",
				strokeWidth: 0.25
			});

		}

		o.logo = d.select("#whole-logo");
		o.logoText = d.select("#logo-text");
		o.s.append(o.logo);

		o.findBorderCities("#logo-pixels");
		o.map.place();
		//o.map.showOnScroll();
		o.map.show();

		//add rectangle behind map, so it can be draggable also on empty spaces
		o.map.bg = o.s.rect(0, 700, 2560, 1440);
		o.map.bg.attr({
			fill: "#efefef"
		});
		o.map.countries.select("#europe-countries").before( o.map.bg );

		//make it dragable
		if ( $("html").hasClass("no-touch") )
			o.map.countries.drag();

		//countries with project hover
		var url = $("#map-container").attr("data-json-url");
		o.map.loadCountriesWithProjects(url);

	});

}
o.map.loadCountriesWithProjects = function(url) {
  
  var bothComplete = 0; //bothComplete has to be == 2, it means that we have loaded both jsons

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/countries",
    'dataType': "json",
    'success': function (data) {
      o.countriesJson = data;
      o.map.highlightCountriesWithProject();
      bothComplete++;
      if (bothComplete == 2) {
      	o.countries.initHoverAndClick();
      }
    }
  });

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/projects",
    'dataType': "json",
    'success': function (data) {
      o.projectsJson = data;
      bothComplete++;
      if (bothComplete == 2) {
      	o.countries.initHoverAndClick();
      }
    }
  });

}
o.map.showOnScroll = function () {

	//if there is hash tag map, show it right away
	if (window.location.hash == "#map") {
		var t = window.setTimeout(o.map.show, 1000);
		return;
	}

	// On scroll show map
	var body = document.getElementsByTagName("body")[0];

	if (body.addEventListener) {
		body.addEventListener("mousewheel", o.map.show, false);
		body.addEventListener("DOMMouseScroll", o.map.show, false);
	} else {
		body.attachEvent("onmousewheel", o.map.show);
	}

	$(".main-content").hammer().on("touch", function(){
		o.map.show();
	});

}
o.map.highlightCountriesWithProject = function () {

	// o.patternInactive = o.s.path("M0,0L10,10M0,5L5,10M5,0L10,5").attr({
 //      fill: "none",
 //      stroke: "#ccc",
 //      strokeWidth: 0.5
 //  });
 //  o.patternInactive = o.patternInactive.pattern(0, 0, 10, 10);

 //  o.patternActive = o.s.path("M0,0L10,10M0,5L5,10M5,0L10,5").attr({
 //      fill: "none",
 //      stroke: "#f00",
 //      strokeWidth: 0.5
 //  });
 //  o.patternActive = o.patternActive.pattern(0, 0, 10, 10);
	o.patternInactive = "#999";
	o.patternActive = "#636363";

	o.countries.withProject = [];
	
	for (var i = 0; i < o.countriesJson.length; i++) {
		
		o.countries.withProject.push( o.countriesJson[i].country.safe_name );

		o.s.selectAll("#" + o.countries.withProject[i] + " polygon").attr({
			fill: o.patternInactive
		});

		//highlight capitals of cities with project in logo
		var id = o.countries.withProject[i] + '_pixel';
		o.s.select("#" + id + " rect").attr({fill: "#000"});

	}

}
o.map.place = function () {
	
	var logoBBox = o.logo.getBBox();
	var shift = { //get it to top left window corner
		x: - logoBBox.x,
		y: - logoBBox.y
	};

	//now center it
	var left = ( o.ww - logoBBox.w ) / 2;
	shift.x += left;

	//adjust top, it should be 11.1111%
	var top = o.wh * 0.111111;
	shift.y += top;

	var m = new Snap.Matrix();
	m.translate(shift.x, shift.y);
	o.map.countries.transform(m);
	o.logo.transform(m);

}
o.map.show = function () {

	//add hash tag
	window.location = "#map";
	$("body").addClass("map-shown");

	//show it
	if (o.map.hidden) {
		o.map.hidden = false;
		o.map.countries.animate({opacity: 1}, 600);
		o.logo.animate({opacity: 1}, 1200);
	}

}
// END map

// Countries
o.countries = {};
o.countries.initHoverAndClick = function() {

	var withProject = o.countries.withProject;
	o.$countryInfo = $("#country-info");

	for (var i = 0; i < withProject.length; i++) {
		
		var country = o.s.select("#" + withProject[i]);

		country.attr({"class": "has-project"});
		country.hover(
			function(e){
				o.countries.hoverIn(e);
			},
			function(e){
				o.countries.hoverOut(e);
			}
		);

		country.click(function(e){
			o.countries.click(e, this);
		});

	}

}
o.countries.hoverIn = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;
	o.s.selectAll("#" + id + " path").attr({fill: o.patternActive});

}

o.countries.hoverOut = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;

	var fillCol = ( $("#" + id).attr("data-active") ) ? o.patternActive : o.patternInactive;
	o.s.selectAll("#" + id + " path").attr({fill: fillCol});	

}
o.countries.click = function (e, that) {

	var id = that.attr("id"),
			$clicked = $("#" + id),
			isActive = $clicked.attr("data-active");

	//activate or deactivate country
	if ( isActive ) {

		$clicked.removeAttr("data-active");
		that.attr({
			fill: o.patternInactive
		});
		o.$countryInfo.removeClass("active");
		
	} else {
		//deactivate active one
		if ( o.activeCountry ) {
			o.$activeCountry.removeAttr("data-active");
			o.activeCountry.selectAll("path").attr({
				fill: o.patternInactive
			});
		}
		//activate new one
		$clicked.attr("data-active", "true");
		that.attr({
			fill: o.patternActive
		});

		o.activeCountry = that;
		o.$activeCountry = $clicked;

		o.countries.zoomToActive(that);
		o.countries.showInfo(that);
	}

}
o.countries.zoomToActive = function(that){
	
	//firstly zoom it
	var m = new Snap.Matrix();
	m.scale(3);
	o.map.scale = 3;
	o.map.countries.transform( m );

	var bbox = that.node.getBoundingClientRect();
	var win = {
		w: $(window).width(),
		h: $(window).height(),
		cx: $(window).width() / 2,
		cy: $(window).height() / 2
	};

	var country = {
		x: o.$activeCountry.offset().left,
		y: o.$activeCountry.offset().top,
		w: bbox.width,
		h: bbox.height
	};
	country.cx = country.x + country.w / 2;
	country.cy = country.y + country.h / 2;

	var shift = {
		x: (win.cx - country.cx) / o.map.scale,
		y: (win.cy - country.cy) / o.map.scale
	}

	//update matrix because of potentional drag
	o.map.matrix = o.map.countries.matrix

	//apply it
	o.map.matrix.translate( shift.x, shift.y )
	o.map.countries.transform( o.map.matrix );

}
o.countries.showInfo = function (that) {

	var id = that.node.id,
			country,
			html = '';

	//get country name
	$.each( o.idsOfCountries, function(key, value){
		if (value == id) country = key;
	});

	//get projects of that country
	for (var i = 0; i < o.projectsJson.length; i++) {
		if ( o.projectsJson[i].node.country == country ) {
			
			var title = o.projectsJson[i].node.title,
					field = o.projectsJson[i].node.field,
					path =  o.projectsJson[i].node.path;

			html += '<li>';
			html += '<a href="' + path + '" class="project-name">' + title + '</a>';
			html += '<a href="' + path + '" class="field">' + field + '</a>';
			html += '</li>';

		}
	}

	//get details of country
	for (var i = 0; i < o.countriesJson.length; i++) {
		if ( o.countriesJson[i].country.name == country ) {
			var gdp = o.countriesJson[i].country.gdp,
					population = o.countriesJson[i].country.population,
					type = o.countriesJson[i].country.type,
					link = o.countriesJson[i].country.link;
			break;
		}
	}

	//country name
	o.$countryInfo.find(".country").text( country ).attr("href", link);
	//type
	o.$countryInfo.find(".type").text( type );
	//population
	o.$countryInfo.find(".population span").text( population );
	//gdp
	o.$countryInfo.find(".gdp span").text( gdp );
	//list projects
	o.$countryInfo.find("ul").html( html );

	o.$countryInfo.addClass("active");

}
// END Countries

//find cities on the border of logo container, so we can zoom to fit
o.findBorderCities = function (where) {

	var topMost 		= 999999,
			rightMost 	= 0,
			bottomMost 	= 0,
			leftMost 		= 999999;

	$(where).find("rect").each(function(){

		x = $(this).attr("x"),
		y = $(this).attr("y");

		//check for topMost
		if ( y < topMost ) 		topMost 		= y;
		if ( y > bottomMost)	bottomMost 	= y;
		if ( x < leftMost )		leftMost		= x;
		if ( x > rightMost )	rightMost 	= x;

	});

	o.borderCities = {
		top: topMost,
		bottom: bottomMost,
		left: leftMost,
		right: rightMost
	}

}


// DOM ready
$(function(){

	//cache vars
	o.w = {
		h: 	$(window).height(),
		w: 	$(window).width(),
		cx: $(window).width() / 2,
		xy: $(window).height() / 2
	};

	o.s = Snap("#map-container");

	var headerHeight = $(".main-content").offset().top,
			height = $(window).height() - headerHeight;

	$(".main-content").height( height );
	o.map.init();

});
// End DOM ready

// Window resize
$(window).resize(function(){
	o.map.place();
});
// End Window resize
