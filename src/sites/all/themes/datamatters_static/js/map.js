var or = {};
var $ = jQuery;

// ids of countries in svg file
or.idsOfCountries = {
	"Bosnia and Herzegovina": "selection_12",
	"Czech Republic": "selection_17",
	"Estonia": "selection_23",
	"Georgia": "selection_29",
	"Hungary": "selection_33",
	"Latvia": "selection_51",
	"Macedonia": "selection_55",
	"Montenegro": "selection_58",
	"Slovakia": "selection_74"
}
// END ids of countries in svg file

// Map
or.map = {
	hidden: true
};
or.map.init = function () {

	var url = $("#map-container").attr("data-url");
	Snap.load( url + "map_logo.svg", function(d) {

		//don't append map for mobile devices
		if (or.w.w > 500) {
			or.map.countries = d.select(".countries");
			or.s.append(or.map.countries);
			or.map.countries.attr({
				opacity: 0
			});
			or.map.countries.selectAll("path").attr({
				fill: "#ffffff",
				stroke: "#ccc",
				strokeWidth: 0.25
			});
		}

		or.logo = d.select(".logo");
		or.s.append(or.logo);

		or.findBorderCities(".logo .cities");
		or.map.place();
		or.map.showOnScroll();

		//add rectangle behind map, so it can be draggable also on empty spaces
		or.map.bg = or.s.rect(0, 0, 1243, 756);
		or.map.bg.attr({
			fill: "#efefef"
		});
		or.map.countries.select("#selection").before( or.map.bg );

		//make it dragable
		or.map.countries.drag();

		//countries with project hover
		var url = $("#map-container").attr("data-json-url");
		or.map.loadCountriesWithProjects(url);

	});

}
or.map.loadCountriesWithProjects = function(url) {
  
  var bothComplete = 0; //bothComplete has to be == 2, it means that we have loaded both jsons

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/countries",
    'dataType': "json",
    'success': function (data) {
      or.countriesJson = data;
      or.map.highlightCountriesWithProject();
      bothComplete++;
      if (bothComplete == 2) {
      	or.countries.initHoverAndClick();
      }
    }
  });

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/projects",
    'dataType': "json",
    'success': function (data) {
      or.projectsJson = data;
      bothComplete++;
      if (bothComplete == 2) {
      	or.countries.initHoverAndClick();
      }
    }
  });

}
or.map.showOnScroll = function () {

	//if there is hash tag map, show it right away
	if (window.location.hash == "#map") {
		var t = window.setTimeout(or.map.show, 1000);
		return;
	}

	// On scroll show map
	var body = document.getElementsByTagName("body")[0];

	if (body.addEventListener) {
		body.addEventListener("mousewheel", or.map.show, false);
		body.addEventListener("DOMMouseScroll", or.map.show, false);
	} else {
		body.attachEvent("onmousewheel", or.map.show);
	}

	$(".main-content").hammer().on("touch", function(){
		or.map.show();
	});

}
or.map.highlightCountriesWithProject = function () {

	// or.patternInactive = or.s.path("M0,0L10,10M0,5L5,10M5,0L10,5").attr({
 //      fill: "none",
 //      stroke: "#ccc",
 //      strokeWidth: 0.5
 //  });
 //  or.patternInactive = or.patternInactive.pattern(0, 0, 10, 10);

 //  or.patternActive = or.s.path("M0,0L10,10M0,5L5,10M5,0L10,5").attr({
 //      fill: "none",
 //      stroke: "#f00",
 //      strokeWidth: 0.5
 //  });
 //  or.patternActive = or.patternActive.pattern(0, 0, 10, 10);
	or.patternInactive = "#999";
	or.patternActive = "#636363";

	or.countries.withProject = [];
	
	for (var i = 0; i < or.countriesJson.length; i++) {
		
		or.countries.withProject.push( or.idsOfCountries[ or.countriesJson[i].country.name ] );
		or.s.selectAll("#" + or.countries.withProject[i] + " path").attr({
			fill: or.patternInactive
		});

	}

}
or.map.place = function () {

	var $cont = $("#logo-container"),
			contBBox = {
				w: $cont.width(),
				h: $cont.height(),
				cx: $cont.offset().left + $cont.width() / 2,
				y: $cont.offset().top + $cont.height()
			},
			logoBBox = or.s.select(".logo-text").getBBox(),
			offset = {
				x: contBBox.cx - logoBBox.x,
				y: contBBox.y - logoBBox.y2
			};

	or.map.scale = contBBox.w / ( or.borderCities.right - or.borderCities.left);

	or.map.matrix = new Snap.Matrix()
										 .translate( offset.x, offset.y )
										 .scale( or.map.scale, or.map.scale, logoBBox.cx, logoBBox.y2 );

	//no map on mobile
	if (or.w.w > 500) or.map.countries.transform(or.map.matrix);
	or.logo.transform(or.map.matrix);

}
or.map.show = function () {

	//add hash tag
	window.location = "#map";
	$("body").addClass("map-shown");

	//show it
	if (or.map.hidden) {
		or.map.hidden = false;
		or.map.countries.animate({opacity: 1}, 600);
		or.logo.animate({opacity: 0}, 1200);
	}

}
// END map

// Countries
or.countries = {};
or.countries.initHoverAndClick = function() {

	var withProject = or.countries.withProject;
	or.$countryInfo = $("#country-info");

	for (var i = 0; i < withProject.length; i++) {
		
		var country = or.s.select("#" + withProject[i]);

		country.attr({"class": "has-project"});
		country.hover(
			function(e){
				or.countries.hoverIn(e);
			},
			function(e){
				or.countries.hoverOut(e);
			}
		);

		country.click(function(e){
			or.countries.click(e, this);
		});

	}

}
or.countries.hoverIn = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;
	or.s.selectAll("#" + id + " path").attr({fill: or.patternActive});

}

or.countries.hoverOut = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;

	var fillCol = ( $("#" + id).attr("data-active") ) ? or.patternActive : or.patternInactive;
	or.s.selectAll("#" + id + " path").attr({fill: fillCol});	

}
or.countries.click = function (e, that) {

	var id = that.attr("id"),
			$clicked = $("#" + id),
			isActive = $clicked.attr("data-active");

	//activate or deactivate country
	if ( isActive ) {

		$clicked.removeAttr("data-active");
		that.attr({
			fill: or.patternInactive
		});
		or.$countryInfo.removeClass("active");
		
	} else {
		//deactivate active one
		if ( o.activeCountry ) {
			o.$activeCountry.removeAttr("data-active");
			o.activeCountry.selectAll("path").attr({
				fill: or.patternInactive
			});
		}
		//activate new one
		$clicked.attr("data-active", "true");
		that.attr({
			fill: or.patternActive
		});

		o.activeCountry = that;
		o.$activeCountry = $clicked;

		or.countries.zoomToActive(that);
		or.countries.showInfo(that);
	}

}
or.countries.zoomToActive = function(that){
	
	//firstly zoom it
	var m = new Snap.Matrix();
	m.scale(3);
	or.map.scale = 3;
	or.map.countries.transform( m );

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
		x: (win.cx - country.cx) / or.map.scale,
		y: (win.cy - country.cy) / or.map.scale
	}

	//update matrix because of potentional drag
	or.map.matrix = or.map.countries.matrix

	//apply it
	or.map.matrix.translate( shift.x, shift.y )
	or.map.countries.transform( or.map.matrix );

}
or.countries.showInfo = function (that) {

	var id = that.node.id,
			country,
			html = '';

	//get country name
	$.each( or.idsOfCountries, function(key, value){
		if (value == id) country = key;
	});

	//get projects of that country
	for (var i = 0; i < or.projectsJson.length; i++) {
		if ( or.projectsJson[i].node.country == country ) {
			
			var title = or.projectsJson[i].node.title,
					field = or.projectsJson[i].node.field,
					path =  or.projectsJson[i].node.path;

			html += '<li>';
			html += '<a href="' + path + '" class="project-name">' + title + '</a>';
			html += '<a href="' + path + '" class="field">' + field + '</a>';
			html += '</li>';

		}
	}

	//get details of country
	for (var i = 0; i < or.countriesJson.length; i++) {
		if ( or.countriesJson[i].country.name == country ) {
			var gdp = or.countriesJson[i].country.gdp,
					population = or.countriesJson[i].country.population,
					type = or.countriesJson[i].country.type,
					link = or.countriesJson[i].country.link;
			break;
		}
	}

	//country name
	or.$countryInfo.find(".country").text( country ).attr("href", link);
	//type
	or.$countryInfo.find(".type").text( type );
	//population
	or.$countryInfo.find(".population span").text( population );
	//gdp
	or.$countryInfo.find(".gdp span").text( gdp );
	//list projects
	or.$countryInfo.find("ul").html( html );

	or.$countryInfo.addClass("active");

}
// END Countries

//find cities on the border of logo container, so we can zoom to fit
or.findBorderCities = function (where) {

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

	or.borderCities = {
		top: topMost,
		bottom: bottomMost,
		left: leftMost,
		right: rightMost
	}

}


// DOM ready
$(function(){

	//cache vars
	or.w = {
		h: 	$(window).height(),
		w: 	$(window).width(),
		cx: $(window).width() / 2,
		xy: $(window).height() / 2
	};

	or.s = Snap("#map-container");

	var headerHeight = $("header").outerHeight(),
			height = $(window).height() - headerHeight;

	$(".main-content").height( height );
	or.map.init();

});
// End DOM ready

// Window resize
$(window).resize(function(){
	or.map.place();
});
// End Window resize
