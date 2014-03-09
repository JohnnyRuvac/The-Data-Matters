o.hp = {}; //homepage

o.hp.initVars = function () {

	o.$mainContent = $(".main-content");
	o.$hpContainer = $("#hp-container");
	o.$hpSlogan = $("#homepage-slogan");
	o.centerLogo = null; //determines if logo should be vertically centered

}

o.hp.setContainerHeight = function() {

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;

	o.$mainContent.height( height );

}

o.hp.fixIpad = function () {

	// fix ios7 ipad landscape height bug
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    o.$html.addClass('ipad ios7');
	}

}

// Init homepage interactivity
o.hp.init = function() {

	o.s = Snap("#hp-container");
	var url = o.$hpContainer.attr("data-url");

	Snap.load( url + "homepage.svg", function(d) {

		//load countries json to get list of countries in which are projects
		var jsonUrl = o.$hpContainer.attr("data-json-url");
		$.ajax({
	    'async': false,
	    'global': false,
	    'url': jsonUrl + "json/countries",
	    'dataType': "json",
	    'success': function (data) {
	      o.countriesJson = data;
	      o.appendCountriesWithProject( d );
	      o.appendFieldsRelationships( d );
	      o.appendFieldsInfo( d );
	      o.placeLogo();
	    }
	  });

	});

}
// END Init homepage interactivity
o.appendFieldsRelationships = function (d) {

	o.fieldsRels = d.select("#fields-relationships");
	o.fieldsRels.attr({
		opacity: 0
	});
	o.s.append( o.fieldsRels );

	//prepare vars for placement, we are using estonia logo pixel as control point
	o.estonia = o.s.select("#estonia_pixel rect");
	o.estoniaCP = o.s.select("#estonia-control-pixel");

}
o.placeFieldsRels = function () {

	var offset = $("#estonia_pixel rect").offset(),
			offsetCP = $("#estonia-control-pixel").offset(),
			shift = {
				x: offset.left - offsetCP.left,
				y: offset.top - offsetCP.top
			};

	console.log("e: " + offset.left + " " + offset.top);
	console.log("eCP: " + offsetCP.left + " " + offsetCP.top);
	console.log("x: " + shift.x + " y: " + shift.y);

	o.fieldsRels.transform("t" + shift.x + "," + shift.y + "...");

}
o.appendFieldsInfo = function (d) {

	o.fieldsInfo = d.select("#fieldsInfo");
	o.fieldsInfo.attr({
		opacity: 0
	});
	o.s.append( o.fieldsInfo );

	//place it
	o.placeFieldsInfo();

}
o.placeFieldsInfo = function () {

	var bbox = o.fieldsInfo.getBBox(),
			w = {
				cx: o.ww / 2,
				cy: o.wh / 2
			},
			shift = {
				x: w.cx - bbox.cx,
				y: w.cy - bbox.cy
			};

	shift.x -= 256; //in design, it is offset by 256px to the left
	shift.y -= 38; //offset to the top because of red arrow in the bottom
	
	o.fieldsInfo.transform("t" + shift.x + "," + shift.y + "...");

}
o.appendCountriesWithProject = function ( d ) {

	//firstly create group for countries, logo and logo pixels
	o.countries = o.s.g();
	o.countries.attr({
		"class": "countries",
		"stroke": "#ccc",
		opacity: 0
	});
	o.logo = o.s.g();
	o.logo.attr({
		"class": "logo"
	});
	o.logoPixels = o.s.g();
	o.logoPixels.attr({
		"class": "logo-pixels"
	});
	o.logo.add( o.logoPixels );

	//now fill those groups
	for (var i = 0; i < o.countriesJson.length; i++) {

		//get country
		var country = d.select( "#" + o.countriesJson[i].country.safe_name );
		//get its city
		var city = d.select( "#" + o.countriesJson[i].country.safe_name + "_pixel" );
		//append them
		o.countries.add(country);
		o.logoPixels.add(city);

	}

	//add logo text as well
	o.logoText = d.select("#logo-text");
	o.logo.add( o.logoText );

	//show cities/logo pixels
	o.logoPixels.selectAll("rect").attr({
		fill: "#000"
	});

}

o.placeLogo = function () {

	o.hp.setContainerHeight();

	var top = ( o.centerLogo ) ? o.centerLogo : o.wh * 0.1111 //top of the logo should be at 11.111% of screen height, or center
			textBBox = o.logoText.node.getBoundingClientRect(),
			logoBBox = o.logo.getBBox(),
			shift = {},
			w = { //window
				cx: o.ww / 2,
				t: top
			};

	//calculate difference between center of screen
	var logoCX = (textBBox.left + textBBox.right) / 2;
	shift.x = w.cx - logoCX;
	shift.y = w.t - o.logo.node.getBoundingClientRect().top;

	//apply transform
	if ( !o.logo.matrix ) {
		var m = new Snap.Matrix();	
	} else {
		var m = o.logo.matrix;
	}
	
	m.translate(shift.x, shift.y);
	o.countries.transform(m);
	o.logo.transform(m);

	//place vertically slogan
	var textTop = $("#logo-text").offset().top,
			textBottom = textTop + textBBox.height,
			headerHeight = o.$headerContent.height(),
			sloganTop = textBottom + 48 - headerHeight;

	o.$hpSlogan.css("top", sloganTop);

}

// Storytelling
o.showFirstScreen = function () {

	//place again logo
	o.centerLogo = null;
	o.placeLogo();

	o.$hpSlogan.addClass("active");
	o.logoText.attr({
		opacity: 1
	});

	o.logoPixels.selectAll("rect").attr({
		fill: "#000"
	});

}
o.hideFirstScreen = function () {

	o.$hpSlogan.removeClass("active");

}
o.showCountries = function () {

	o.countries.attr({
		opacity: 1
	});

	o.logoText.attr({
		opacity: 0
	});

	o.logoPixels.selectAll("rect").attr({
		fill: "#f00"
	});

	//center logo vertically
	var bbox = o.logo.getBBox(),
			svgHeight = o.$hpContainer.height(),
			logoHeight = bbox.y + bbox.h,
			top = ( svgHeight - logoHeight ) / 2;

	//if its not already centered
	if ( !o.centerLogo ) {
		o.centerLogo = top;
		o.placeLogo();
		o.placeFieldsRels();
	}

}
o.hideCountries = function () {

	o.countries.attr({
		opacity: 0
	});

}
o.showFieldsRelationships = function () {

	o.logo.attr({
		opacity: 1
	});

	o.fieldsInfo.attr({
		opacity: 0
	});

	o.fieldsRels.attr({
		opacity: 1
	});

}
o.hideFieldsRelationships = function () {

	o.fieldsRels.attr({
		opacity: 0
	});

}
o.showFieldsInfo = function () {

	o.logo.attr({
		opacity: 0
	});

	o.fieldsInfo.attr({
		opacity: 1
	});

	//show first one
	o.currentFieldInfo = 1;
	o.showFieldInfoNum();

}
o.showFieldInfoNum = function () {

	var num = o.currentFieldInfo;

	//active is red
	o.fieldsInfo.select(".fieldInfo" + num).attr({
		stroke: "#f00",
		strokeDasharray: 0
	});

	//already seen is black solid
	var seen = o.fieldsInfo.select(".fieldInfo" + (num - 1));
	if (seen) {
		seen.attr({
			stroke: "#000",
			strokeDasharray: 0
		});
	}

}
o.hideFieldInfoNum = function () {

	var num = o.currentFieldInfo;

	o.fieldsInfo.select(".fieldInfo" + num).attr({
		stroke: "#ccc",
		strokeDasharray: 1
	});

}
o.hideFieldsInfo = function () {

	o.fieldsInfo.attr({
		opacity: 0
	});

}
o.exitCurrentSlide = function () {

	switch ( o.currentSlide ) {
		case 0:
			o.hideFirstScreen();
			break;
		case 1:
			o.hideCountries();
			break;
		case 2:
			o.hideFieldsRelationships();
			break;
		case 3:
			o.hideFieldInfoNum();
			break;
		case 4:
			o.hideFieldInfoNum();
			break;
		case 5:
			o.hideFieldInfoNum();
			break;
		case 6:
			o.hideFieldInfoNum();
			break;
		case 7:
			o.hideFieldInfoNum();
			break;
		case 8:
			o.hideFieldInfoNum();
			break;
		case 9:
			o.hideFieldInfoNum();
			break;
		case 10:
			o.hideFieldsInfo();
			break;
		default:
			break;
	}

}
o.anotherSlide = function (direction) {

	//do needed stuff on current slide exit
	o.exitCurrentSlide();
	
	//update current slide index
	if ( direction == "next" )
		o.currentSlide++;
	else
		o.currentSlide--;

	if ( o.currentSlide < 0 )
		o.currentSlide = 0;
	if ( o.currentSlide > 10 )
		o.currentSlide = 10;

	//based on slide index, do needed stuff
	switch ( o.currentSlide ) {
		case 0:
			o.showFirstScreen();
			break;
		case 1:
			o.showCountries();
			break;
		case 2:
			o.showFieldsRelationships();
			break;
		case 3:
			o.showFieldsInfo();
			break;
		case 4:
			o.currentFieldInfo = 2;
			o.showFieldInfoNum();
			break;
		case 5:
			o.currentFieldInfo = 3;
			o.showFieldInfoNum();
			break;
		case 6:
			o.currentFieldInfo = 4;
			o.showFieldInfoNum();
			break;
		case 7:
			o.currentFieldInfo = 5;
			o.showFieldInfoNum();
			break;
		case 8:
			o.currentFieldInfo = 6;
			o.showFieldInfoNum();
			break;
		case 9:
			o.currentFieldInfo = 7;
			o.showFieldInfoNum();
			break;
		default:
			console.log("some other slide: " + o.currentSlide);
			break;
	}

}
o.initSlideScrolling = function () {

	//init vars
	o.scrolled = false;
	o.currentSlide = 0;

	//touch devices
	if ( o.isTouch ) {

		document.ontouchmove = function (e) {
			e.preventDefault();
		}

		$(document)
			.on("swipeup", function(e){
				o.anotherSlide("next");
			})
			.on("swipedown", function(e){
				e.preventDefault();
				o.anotherSlide("prev");
			});

	}
	//end of touch devices

	//no-touch devices
	if ( !o.isTouch ) {

		o.$hpContainer.on("mousewheel", function(e){
		
			var up = ( e.deltaY < 0 );
			if ( !o.scrolled ) {

				o.scrolled = true;
				if (up)
					o.anotherSlide("next");
				else
					o.anotherSlide("prev");

				//timeout because of momentum scroll on Apple devices
				window.setTimeout(function(){
					o.scrolled = false;
				}, 700);

			}

		});

	}
	//end of no-touch devices	

}
o.initStoryTelling = function () {

	o.initSlideScrolling();

	// arrow click
	$(".continue-arrow").click(function(e){
		e.preventDefault();
		o.anotherSlide("next");
	});

	//hide preload here

}
// o.applyTweens = function(tween, snapEl) {

// 	var x = tween.target.x,
// 			y = tween.target.y;

// 	snapEl.transform("t" + x + "," + y);

// }
// END Storytelling

// DOM ready
$(function(){

	o.checkSVG();

	o.hp.initVars();
	o.hp.setContainerHeight();
	o.hp.fixIpad();
	o.hp.init();

});
// END DOM ready

// Window resize
$(window).resize(function(){

	o.placeLogo();
	o.placeFieldsInfo();
	o.placeFieldsRels();

});
// END Window resize

//Window load
$(window).load(function(e){

	//hide preload init story telling
	o.$body.addClass("all-loaded");
	o.initStoryTelling();

});
//END Window load

// Add swipedown, and up to jquery mobile
(function() {
    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();

