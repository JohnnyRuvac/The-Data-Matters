// Map
o.map = {};
o.minZoom = 2;
o.maxZoom = 6;

o.map.init = function () {

	o.$mapContainer = $("#map-container");

	var url = o.$mapContainer.attr("data-url");
	Snap.load( url + "worldmap.svg", function(d) {

		o.map.setContainerHeight();

		//pattern
		var pattern = d.select("#pattern-active");
		var pattern2 = d.select("#pattern-inactive");
		o.s.append(pattern);
		o.s.append(pattern2);
	
		o.map.countries = d.select("#worldmap");
		o.s.append(o.map.countries);
		o.map.countries.attr({
			opacity: 0
		});	
		o.map.countries.selectAll("path").attr({
			fill: "#ffffff",
			stroke: "#bababa",
			"vector-effect": "non-scaling-stroke",
			strokeWidth: 1
		});
		o.map.countries.selectAll('circle').attr({
			strokeOpacity: 0,
			fillOpacity: 0
		});

		//make it dragable
		o.map.activateDrag();

		o.map.activateZoomBtns();

		//countries with project hover
		var url = o.$mapContainer.attr("data-json-url");
		o.map.loadCountriesWithProjects(url);

	});

};

o.saveStateToDummyObject = function () {

	var m = o.mainG.transform().globalMatrix;
		
	TweenLite.to(o.dummyObj, 0, {
	  x: m.e,
	  y: m.f,
	  sx: 0,
	  sy: 0,
	  s: m.a,
	  ease: Power1.easeOut,
	  onUpdate: o.applySnapTweens,
	  onUpdateParams:["{self}", o.mainG, m.a, 0, 0]
	});

};

o.map.activateDrag = function () {

	//add for map dragging also outside of the countries
	o.map.bgRect = o.s.rect(0, 36, 1000, 650).attr({fill: '#e8e8e8'});
	o.map.bgRect.prependTo( o.map.countries );

	o.drag = {
		x: 0,
		y: 0
	};
	
	var move = function(dx,dy) {

		if (o.pinchActive) {
			return;
		}

		var current = {
			x: o.mainG.transform().globalMatrix.e,
			y: o.mainG.transform().globalMatrix.f
		};

		var x = dx - o.drag.x;
		var y = dy - o.drag.y;
		
		TweenLite.to(o.dummyObj, 0, {
			x: x,
			y: y,
			ease: Power1.easeOut,
			onUpdate: o.applyMoveTweens,
			onUpdateParams:["{self}", o.mainG]
		});
		
		o.drag.x = dx;
		o.drag.y = dy;
	
	};
	var start = function() {
		o.saveStateToDummyObject();
		o.isDraggingMap = true;
		o.$mapContainer.css("cursor", "move");
	};
	var stop = function() {

		o.$mapContainer.css("cursor", "auto");

		o.drag.x = 0;
		o.drag.y = 0;

		o.saveStateToDummyObject();

		o.isDraggingMap = false;	
	};

	o.map.countries.drag(move, start, stop);

};
o.map.loadCountriesWithProjects = function(url) {
  
  var bothComplete = 0; //bothComplete has to be == 2, it means that we have loaded both jsons
  var prepareMap = function() {
  	o.countries.initHoverAndClick();
  	o.s.zpd({
  		drag: false,
  		pan: false,
  		zoomThreshold: [o.minZoom, o.maxZoom]
  	});
  	o.mainG = o.s.select('g');
  	o.countries.center();
  	o.map.show();
  };

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
      	prepareMap();
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
      	prepareMap();	
      }
    }
  });

};
o.map.highlightCountriesWithProject = function () {

	//define patterns, scale them
	o.patternInactive = Snap("#pattern-inactive");
	o.patternActive = Snap("#pattern-active");
	
	// o.patternActive.attr({
	// 	"vector-effect": "non-scaling-stroke"
	// });
	// o.patternInactive.attr({
	// 	"vector-effect": "non-scaling-stroke"
	// });
	o.patternActive.selectAll('line').attr({
		"vector-effect": "non-scaling-stroke",
		strokeWidth: 1
	});
	o.patternInactive.selectAll('line').attr({
		"vector-effect": "non-scaling-stroke",
		strokeWidth: 1
	});

	//highlight countries
	o.countries.withProject = [];
	
	for (var i = 0; i < o.countriesJson.length; i++) {
		
		o.countries.withProject.push( o.countriesJson[i].country.safe_name );

		o.s.selectAll("#" + o.countries.withProject[i] + " path").attr({
			fill: o.patternInactive,
			stroke: "#b3b3b3"
		});

	}

};
o.map.setContainerHeight = function () {

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;

	o.$mainContent.height( height );

};
o.map.fixIpad = function () {

	// fix ios7 ipad landscape height bug
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    o.$html.addClass('ipad ios7');
	}

	document.ontouchmove = function(e) {
		e.preventDefault();
	}
};

o.map.show = function () {

	o.$body.addClass("map-shown");

	//show it
	o.map.countries.animate({opacity: 1}, 600);

};

o.listenToGestures = function () {

	var elem = $('.main-content')[0];
	var hammertime = new Hammer(elem);
	hammertime.get('pinch').set({
		enable: true
	});

	hammertime.on('pinchstart', function(e){
		console.log('pinch recognized');
		o.lastPinchVal = 0;
		o.pinchActive = true;
		o.pinchAlreadyZoomed = false;
	});

	hammertime.on('pinchmove', function(e){

		if ( e.pointers.length < 2 ) {
			return;
		}

		if (o.pinchAlreadyZoomed) {
			return;
		}
		
		if ( !o.lastPinchVal) {
			o.lastPinchVal = e.scale;
			return;
		}

		console.log( o.lastPinchVal );
		var isZoomingIn = ( e.scale > o.lastPinchVal );

		if (isZoomingIn) {
			//console.log('zoomin!');
			o.pinchAlreadyZoomed = true;
			o.map.zoomIn();
		} else {
			//console.log('zoomout!');
			o.pinchAlreadyZoomed = true;
			o.map.zoomOut();
		}

	});

	hammertime.on('pinchend', function(){
		o.saveStateToDummyObject();
		setTimeout(function(){
			o.pinchActive = false;
			o.pinchAlreadyZoomed = false;
		}, 500);
	});

	hammertime.on('pinchcancel', function(){
		o.saveStateToDummyObject();
		setTimeout(function(){
			o.pinchActive = false;
			o.pinchAlreadyZoomed = false;
		}, 500);
	});

};
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
					if ( !o.isDraggingMap )
						o.countries.hoverIn(e);
				},
				function(e){
					if ( !o.isDraggingMap )
						o.countries.hoverOut(e);
				}
			);
		}

		//bind touch/click event for countries
		if ( !o.isTouch ) {
			country.click(function(e){
				o.countries.click(e, this);
			});
		} else {


			country.touchstart(function(e){
				o.lastParentId = e.target.parentNode.id;
			});
			country.touchend(function(e){
				
				if (o.pinchActive) {
					return;
				}

				var curParentId = e.target.parentNode.id,
						same = ( o.lastParentId == curParentId ),
						didDrag = ( (o.drag.x > 2) || (o.drag.y > 2) || (o.drag.x < -2) || (o.drag.y < -2) );

				if (same && !didDrag)
					o.countries.click(e, this);

			});

		}

	}

};
o.countries.hoverIn = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;

	o.s.selectAll("#" + id + " path").attr({
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
		o.s.select("#" + id).appendTo( o.map.countries );
	}

};

o.countries.hoverOut = function (e) {

	var id = e.target.parentNode.id,
			isActive = $("#" + id).hasClass("has-project");

	if ( isActive ) return;

	var dataActive = $("#" + id).attr("data-active"); 
	var fillCol = ( dataActive ) ? o.patternActive : o.patternInactive;
	var strokeCol = ( dataActive ) ? "#f00" : "#b3b3b3";

	o.s.selectAll("#" + id + " path").attr({
		fill: fillCol,
		stroke: strokeCol
	});

};
o.countries.click = function (e, that) {

	o.saveStateToDummyObject();

	var id = that.attr("id"),
			$clicked = $("#" + id),
			isActive = $clicked.attr("data-active");

	//save reference to active one for later use
	o.selectedCountry = that;

	//activate or deactivate country
	if ( isActive ) {

		$clicked.removeAttr("data-active");
		that.selectAll("path").attr({
			fill: o.patternInactive,
			stroke: "#b3b3b3"
		});
		o.$countryInfo.removeClass("active");
		o.selectedCountry = null;
		
	} else {
		//deactivate active one
		if ( o.activeCountry ) {
			o.$activeCountry.removeAttr("data-active");
			o.activeCountry.selectAll("path").attr({
				fill: o.patternInactive,
				stroke: "#b3b3b3"
			});
		}
		//activate new one
		$clicked.attr("data-active", "true");
		that.selectAll("path").attr({
			fill: o.patternActive,
			stroke: "#f00"
		});

		that.appendTo( o.map.countries );

		o.activeCountry = that;
		o.$activeCountry = $clicked;

		o.countries.zoomToActive(that);
		o.countries.showInfo(that);
	}

};
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
	  s: 4,
	  ease: Power1.easeOut,
	  onUpdate: o.applySnapTweens,
	  onUpdateParams:["{self}", o.mainG, 2, bbox.cx, bbox.cy]
	});

};
o.map.zoomOut = function (e) {

	if (e) {
		e.preventDefault();
	}
	var m = o.mainG.transform().globalMatrix;
	var currentScale = m.a;
	var rounded = Math.round(currentScale);
	
	if ( (rounded - 1) >= o.minZoom ) {
		o.mainG.transform('s0.5,0.5...');
	}

};
o.map.zoomIn = function (e) {

	if (e) {
		e.preventDefault();
	}
	var m = o.mainG.transform().globalMatrix;
	var currentScale = m.a;
	var rounded = Math.round(currentScale);
	
	if ( (rounded + 1) <= o.maxZoom ) {
		o.mainG.transform('s2,2...');
	}

};
o.map.activateZoomBtns = function () {

	o.map.zoomLevels = [2, 3, 4, 5, 6];

	//out
	$('#map-zoom-out').click(function(e){
		o.map.zoomOut(e);
	});

	//in
	$('#map-zoom-in').click(function(e){
		o.map.zoomIn(e);
	});

};
o.countries.zoomToActive = function(that){

	var city = o.s.select('#circ-' + that.node.id);
	var cx = city.attr('cx');
	var cy = city.attr('cy');
	var shift = {
		x: ( cx - o.ww / 2 ) * -1,
		y: ( cy - o.wh / 2 ) * -1
	};

	time = 0.3;

	var matrix = o.mainG.transform().globalMatrix;
	
	TweenLite.to(o.dummyObj, time, {
	  x: shift.x,
	  y: shift.y,
	  sx: cx,
	  sy: cy,
	  s: matrix.a,
	  ease: Power1.easeOut,
	  onUpdate: o.applySnapTweens,
	  onUpdateParams:["{self}", o.mainG, matrix.a, cx, cy]
	});

};

// Animating with Greensock!
o.dummyObj = {
	x: 0,
	y: 0,
	sx: 0,
	sy: 0,
	s: 0
}
o.applySnapTweens = function(tween, snapEl, s, sx, sy) {

	//if we are scaling the map, we need fixed scale control points, not animated

	var scaleing = snapEl.matrix && snapEl.matrix.a != s; //check if we are scaleing
			x = tween.target.x,
			y = tween.target.y,
			sx = (scaleing) ? sx : tween.target.sx,
			sy = (scaleing) ? sy : tween.target.sy,
			s = tween.target.s;

	snapEl.transform("t" + x + "," + y + "s" + s + "," + s + "," + sx + "," + sy);

};
o.applyMoveTweens = function(tween, snapEl) {

	var x = tween.target.x,
			y = tween.target.y;

	snapEl.transform("t" + x + "," + y + '...');

};
// END Animating with Greensock!
o.countries.showInfo = function (that) {

	var safe_country = that.node.id,
			html = '';

	//get projects of that country
	for (var i = 0; i < o.projectsJson.length; i++) {
		if ( o.projectsJson[i].node.safe_name_country == safe_country ) {
			
			var title = o.projectsJson[i].node.title,
					field = o.projectsJson[i].node.field,
					field_safe_name = o.projectsJson[i].node.safe_name_field,
					path =  o.projectsJson[i].node.path;

			html += '<li>';
			html += '<a href="' + path + '" class="project-name">' + title + '</a>';
			html += '<a href="/projects#field=' + field_safe_name + '" class="field icon">' + field + '</a>';
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

};
// END Countries

// DOM ready
$(function(){

	o.checkSVG();

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
	o.listenToGestures();

});
// End DOM ready

// Window resize
$(window).resize(function(){
	o.map.setContainerHeight();
	//o.countries.zoomToActive( o.selectedCountry, o.map.scale );
});
// End Window resize

$(window).load(function(){
	//hide preload here
	window.setTimeout(function(){
		o.$body.addClass("all-loaded");
	}, 50);
});
