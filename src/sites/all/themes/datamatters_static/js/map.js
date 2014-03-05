// Map
o.map = {};

o.map.init = function () {

	var url = $("#map-container").attr("data-url");
	Snap.load( url + "map_logo.svg", function(d) {

		//pattern
		var pattern = d.select("#pattern-active");
		var pattern2 = d.select("#pattern-inactive");
		o.s.append(pattern);
		o.s.append(pattern2);
	
		o.map.countries = d.select(".countries");
		o.s.append(o.map.countries);
		o.map.countries.attr({
			opacity: 0
		});	
		o.map.countries.selectAll("polygon, path").attr({
			fill: "#ffffff",
			stroke: "#ccc",
			strokeWidth: 0.25
		});

		o.europe = o.s.select("#europe-countries");

		o.map.place();

		//add rectangle behind map, so it can be draggable also on empty spaces
		o.map.bg = o.s.rect(0, 700, 2560, 1440);
		o.map.bg.attr({
			fill: "#efefef"
		});
		o.map.countries.select("#other-countries").before( o.map.bg );

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
      	o.map.show();
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
      	o.map.show();
      }
    }
  });

}
o.map.highlightCountriesWithProject = function () {

	o.patternInactive = Snap("#pattern-inactive");
	o.patternActive = Snap("#pattern-active");

	o.countries.withProject = [];
	
	for (var i = 0; i < o.countriesJson.length; i++) {
		
		o.countries.withProject.push( o.countriesJson[i].country.safe_name );

		o.s.selectAll("#" + o.countries.withProject[i] + " polygon").attr({
			fill: o.patternInactive,
			stroke: "#aaa"
		});

	}

}
o.map.place = function () {

	

}
o.map.show = function () {

	$("body").addClass("map-shown");

	//show it
	o.map.countries.animate({opacity: 1}, 600);

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

	o.s.selectAll("#" + id + " polygon").attr({
		fill: o.patternActive,
		stroke: "#f00"
	});

	if ( o.activeCountry )
		o.s.select("#" + id).insertBefore( o.activeCountry );
	else
		o.s.select("#" + id).appendTo( o.europe );

}

o.countries.hoverOut = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;

	var dataActive = $("#" + id).attr("data-active"); 
	var fillCol = ( dataActive ) ? o.patternActive : o.patternInactive;
	var strokeCol = ( dataActive ) ? "#f00" : "#aaa";

	o.s.selectAll("#" + id + " polygon").attr({
		fill: fillCol,
		stroke: strokeCol
	});

}
o.countries.click = function (e, that) {

	var id = that.attr("id"),
			$clicked = $("#" + id),
			isActive = $clicked.attr("data-active");

	//save reference to active one for later use
	o.selectedCountry = that;

	//activate or deactivate country
	if ( isActive ) {

		$clicked.removeAttr("data-active");
		that.selectAll("polygon").attr({
			fill: o.patternInactive,
			stroke: "#aaa"
		});
		o.$countryInfo.removeClass("active");
		
	} else {
		//deactivate active one
		if ( o.activeCountry ) {
			o.$activeCountry.removeAttr("data-active");
			o.activeCountry.selectAll("polygon").attr({
				fill: o.patternInactive,
				stroke: "#aaa"
			});
		}
		//activate new one
		$clicked.attr("data-active", "true");
		that.selectAll("polygon").attr({
			fill: o.patternActive,
			stroke: "#f00"
		});

		that.appendTo( o.europe );

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

	//update strokes in patterns
	o.patternActive.selectAll("line").attr({strokeWidth: o.map.scale * 0.058})
	o.patternInactive.selectAll("line").attr({strokeWidth: o.map.scale * 0.058})

	//update matrix because of potentional drag
	o.map.matrix = o.map.countries.matrix

	//apply it
	o.map.matrix.translate( shift.x, shift.y )
	o.map.countries.transform( o.map.matrix );

}
o.countries.showInfo = function (that) {

	var safe_country = that.node.id,
			html = '';

	//get projects of that country
	for (var i = 0; i < o.projectsJson.length; i++) {
		if ( o.projectsJson[i].node.safe_name_country == safe_country ) {
			
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
		if ( o.countriesJson[i].country.safe_name == safe_country ) {
			var country = o.countriesJson[i].country.name,
					gdp = o.countriesJson[i].country.gdp,
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

// DOM ready
$(function(){

	//cache vars
	o.w = {
		h: 	$(window).height(),
		w: 	$(window).width(),
		cx: $(window).width() / 2,
		xy: $(window).height() / 2
	};
	o.$mainContent = $(".main-content");
	o.s = Snap("#map-container");

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;

	o.$mainContent.height( height );
	o.map.init();

});
// End DOM ready

// Window resize
$(window).resize(function(){
	o.map.place();
});
// End Window resize
