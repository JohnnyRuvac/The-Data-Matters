// Map
o.map = {};

o.map.init = function () {

	var url = $("#map-container").attr("data-url");
	Snap.load( url + "map_logo.svg", function(d) {

		o.map.setContainerHeight();

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

		//add rectangle behind map, so it can be draggable also on empty spaces
		o.map.bg = o.s.rect(0, 700, 2560, 1440);
		o.map.bg.attr({
			fill: "#efefef"
		});
		o.map.countries.select("#other-countries").before( o.map.bg );

		//make it dragable
		o.map.activateDrag();

		//countries with project hover
		var url = $("#map-container").attr("data-json-url");
		o.map.loadCountriesWithProjects(url);

	});

}
o.map.activateDrag = function () {

	if ( o.isTouch )
		return;
	
	var move = function(dx,dy) {
		
		var bbox = this.getBBox(),
				top = (bbox.x + dx) > 0,
				left = (bbox.y + dy) > 0,
				right = (-bbox.x - dx + o.ww) > 2560 * o.map.scale, //2560 is the initial width of svg map
				bottom = (-bbox.y - dy + o.wh) > 1440 * o.map.scale; //1440 is the initial height of svg map

		if ( top || left || right || bottom)
			return;
		
		this.attr({
	    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
	   });
	
	} 
	var start = function() {
		this.data('origTransform', this.transform().local );
	}
	var stop = function() {
		
	}

	o.map.countries.drag(move, start, stop);

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
      	o.countries.center();
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
      	o.countries.center();
      	o.map.show();
      }
    }
  });

}
o.map.highlightCountriesWithProject = function () {

	//define patterns, scale them
	o.patternInactive = Snap("#pattern-inactive");
	o.patternActive = Snap("#pattern-active");

	var m = new Snap.Matrix();
	m.scale(1.5);
	o.patternInactive.transform(m);
	o.patternActive.transform(m);

	//highlight countries
	o.countries.withProject = [];
	
	for (var i = 0; i < o.countriesJson.length; i++) {
		
		o.countries.withProject.push( o.countriesJson[i].country.safe_name );

		o.s.selectAll("#" + o.countries.withProject[i] + " polygon").attr({
			fill: o.patternInactive,
			stroke: "#aaa"
		});

	}

}
o.map.setContainerHeight = function () {

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;

	o.$mainContent.height( height );

}
o.map.fixIpad = function () {

	// fix ios7 ipad landscape height bug
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    o.$html.addClass('ipad ios7');
	}

	document.ontouchmove = function(e) {
		e.preventDefault();
	}
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
		
		//don't apply hovers for touch devices
		if ( !o.isTouch ) {
			country.hover(
				function(e){
					o.countries.hoverIn(e);
				},
				function(e){
					o.countries.hoverOut(e);
				}
			);
		}

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

	// !!!!!!!!!!!
	//put this country on top, so borders are not clipped by other country
	//skip for ie, there is bug that disables hover out event because of this
	if (o.isIE)
		return;

	if ( o.selectedCountry ) {
		o.s.select("#" + id).insertBefore( o.activeCountry );
	}
	else {
		o.s.select("#" + id).appendTo( o.europe );
	}

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
		o.selectedCountry = null;
		
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
o.countries.unzoomPatterns = function () {

	var m = o.patternActive.matrix;
	m.scale( 1 / m.a * 1.5);
	o.patternActive.transform(m);
	o.patternInactive.transform(m);

}
o.countries.center = function () {

	var hu = o.s.select("#hungary"),
			bbox = hu.getBBox(),
			x = ( bbox.cx - o.ww / 2 ) * -1,
			y = ( bbox.cy - o.wh / 2 ) * -1;

	TweenLite.to(o.dummyObj, 0, {
	  x: x,
	  y: y,
	  sx: bbox.cx,
	  sy: bbox.cy,
	  s: 1,
	  ease: Power1.easeOut,
	  onUpdate: o.applySnapTweens,
	  onUpdateParams:["{self}", o.map.countries]
	});

}
o.countries.zoomToActive = function(that){

	var bbox = that.getBBox();
	var win = {
		w: $(window).width(),
		h: $(window).height(),
		cx: $(window).width() / 2,
		cy: $(window).height() / 2
	};
	var shift = {
		x: ( bbox.cx - o.ww / 2 ) * -1,
		y: ( bbox.cy - o.wh / 2 ) * -1
	};
	console.log(shift.x);
	var time = 1 / ( shift.x / -100 );
	console.log(time);
	time = 0.3;

	//update strokes in patterns
	o.patternActive.selectAll("line").attr({strokeWidth: o.map.scale * 0.058})
	o.patternInactive.selectAll("line").attr({strokeWidth: o.map.scale * 0.058})

	TweenLite.to(o.dummyObj, time, {
	  x: shift.x,
	  y: shift.y,
	  sx: bbox.cx,
	  sy: bbox.cy,
	  s: 3,
	  ease: Power1.easeOut,
	  onUpdate: o.applySnapTweens,
	  onUpdateParams:["{self}", o.map.countries]
	});

	//unzoom patterns
	o.countries.unzoomPatterns();

}

// Animating with Greensock!
o.dummyObj = {
	x: 0,
	y: 0,
	sx: 0,
	sy: 0,
	s: 0
}
o.applySnapTweens = function(tween, snapEl) {

	var x = tween.target.x,
			y = tween.target.y,
			sx = tween.target.sx,
			sy = tween.target.sy,
			s = tween.target.s;

	snapEl.transform("t" + x + "," + y + "s" + s + "," + s + "," + sx + "," + sy);

}
// END Animating with Greensock!
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
			html += '<a href="' + path + '" class="field icon">' + field + '</a>';
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
	o.isTouch = o.$html.hasClass("touch");
	o.isIE = $("html").hasClass("ie") || !!navigator.userAgent.match(/Trident.*rv\:11\./) || !!navigator.userAgent.match(/Trident\/7\./);
	o.$mainContent = $(".main-content");
	o.s = Snap("#map-container");

	o.map.fixIpad();
	o.map.init();

});
// End DOM ready

// Window resize
$(window).resize(function(){
	o.map.setContainerHeight();
	//o.countries.zoomToActive( o.selectedCountry, o.map.scale );
});
// End Window resize
