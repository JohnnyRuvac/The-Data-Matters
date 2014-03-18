o.hp = {}; //homepage

o.hp.initVars = function () {

	o.$mainContent = $(".main-content");
	o.$hpContainer = $("#hp-container");
	o.$hpSlogan = $("#homepage-slogan");
	o.centerLogo = null; //determines if logo should be vertically centered
	o.$fieldsDesc = $(".fields-descriptions");
	o.$lastPage = $(".last-page");
	o.$continueArrow = $(".continue-arrow");

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
	      o.placeFieldsRels();
	      o.placeLogo();
	      //o.placeFieldsInfo();
	      o.prepareAnims();
	    }
	  });

	});

}
// END Init homepage interactivity
o.appendFieldsRelationships = function (d) {

	o.fieldsRels = d.select("#fields-relationships");
	o.s.append( o.fieldsRels );
	o.fieldsRels.attr({
		opacity: 0
	});
	//prepare vars for placement, we are using estonia logo pixel as control point
	o.estonia = o.s.select("#estonia_pixel rect");
	o.estoniaCP = o.s.select("#estonia-control-pixel");

}
o.placeFieldsRels = function () {

	//manual transform before placement of logo, because of firefox
	var x = 1006.172 - 184.806,
			y = 1087.754 - 328.066;

	o.fieldsRels.transform("t" + x + "," + y);

}
o.appendFieldsInfo = function (d) {

	o.fieldsInfo = d.select("#fieldsInfo");
	o.s.append( o.fieldsInfo );

	//place it
	o.placeFieldsInfo();

}
o.placeFieldsInfo = function () {

	var bbox = o.fieldsInfo.getBBox(),
			w = {
				cx: o.ww / 2,
				y: o.wh * 0.11111
			},
			shift = {
				x: w.cx - bbox.cx,
				y: w.y - bbox.y
			};

	shift.x -= 256; //in design, it is offset by 256px to the left
	
	o.fieldsInfo.transform("t" + shift.x + "," + shift.y + "...");

	//shift fields names and text
	bbox = o.fieldsInfo.getBBox();

	var width = bbox.w,
			top = bbox.y + 13,
			left = bbox.x + width;

	o.$fieldsDesc.css({
		"top": top,
		"left": left
	});

}
o.appendCountriesWithProject = function ( d ) {

	//firstly create group for countries, logo and logo pixels
	o.countries = o.s.g();
	o.countries.attr({
		"class": "countries"
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

	o.countries.selectAll("polygon").attr({
		"stroke": "#ccc"
	});

	//make logo bg, so it can be clickable
	var bbox = o.logo.getBBox();
	o.logoBg = o.s.rect(bbox.x, bbox.y, 341, 378);
	o.logoBg.attr({
		opacity: 0,
		"cursor": "pointer"
	});
	o.logoBg.click(function(){
		o.anotherSlide("next");
	});
	o.logo.add( o.logoBg );

}

o.getLogoCenterPos = function (snapEl, newX, newY) {

	//calculates shift that is needed to position logo center to new x&y

	//get its position regarded to window
	var bbox = snapEl.node.getBoundingClientRect();
	//calculate its center x,y
	bbox.cx = bbox.left + bbox.width / 2;
	bbox.cy = bbox.top + bbox.height / 2;
	//console.log("cur pos in window x,y: " + bbox.cx + ", " + bbox.cy);

	//now get the difference between it's current x,y and new x,y
	var shift = {
		x: newX - bbox.cx,
		y: newY - bbox.cy
	};
	//console.log("shift x,y: " + shift.x + ", " + shift.y);

	//save y shift for animation of slogan
	o.logoYShiftToCenter = shift.y;

	//get its current position regarded to svg element
	var m = o.logo.matrix;
	//console.log("matrix x,y: " + m.e + ", " + m.f);

	//now return it's new position regarded to svg element
	var newPos = {
		x: m.e + shift.x,
		y: m.f + shift.y
	};
	//console.log("newPos x,y: " + newPos.x + ", " + newPos.y);

	return newPos;

}

o.placeLogo = function () {

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

	o.fieldsRels.transform("t" + shift.x + "," + shift.y + "...");

	//place vertically slogan
	var textTop = $("#logo-text").offset().top,
			textBottom = textTop + textBBox.height,
			headerHeight = o.$headerContent.height(),
			sloganTop = textBottom + 48 - headerHeight;

	o.$hpSlogan.css("top", sloganTop);

}

// GSAP anim
o.pauseAnim = function () {

	//reset timeScale
	o.tl.timeScale(1);

	var dirChanged = ( o.dir != o.lastDir );
	
	if ( !dirChanged )
		o.tl.pause();
	else
		o.lastDir = o.dir;

}
o.anotherSlide = function(dir) {

	//on first slide, stop bouncing arrow, remove rect behind logo
	if (o.isArrowBouncing) {
		o.isArrowBouncing = false;
		TweenLite.killTweensOf( o.$continueArrow );
		TweenLite.to( o.$continueArrow, 0.6, {bottom: 18} );
		o.logoBg.remove();
	}

	//save last direction because of play/pause issue
	o.lastDir = o.dir;
	o.dir = dir;

	if ( !o.tl._paused ) {
		o.tl.timeScale(8);
	}

	if ( dir == "next" )
		o.tl.play();
	else
		o.tl.reverse();

}
o.prepareAnims = function () {

	o.tl = new TimelineMax();

	//prepare vars
	o.$allCities = $(".logo-pixels rect");
	o.$allCountries = $("g.countries");
	o.$countriesText = $("#countries-text");
	o.$relsText = $("#relationships-text");
	o.$fieldsDescPoly = $("#fieldsInfo polygon");
	o.$fieldsDescUl = $(".fields-descriptions ul");
	o.polyArray = [];
	o.polyLiArray = [];
	o.polyPsArray = [];
	o.$fieldsDescPs = $(".fields-descriptions p");
	o.$lastP = $(".last-page p");
	o.$intMapLink = $(".int-map-link");
	o.$projLink = $(".projects-link");
	o.$osfLogo = $(".osf-logo");
	o.lastDir = "next";
	o.dir = "next";

	for (var i = 1; i <= o.$fieldsDescPoly.length; i++) {
		o.polyArray.push( $("#fieldsInfo").find(".fieldInfo" + i) );
		o.polyLiArray.push( o.$fieldsDescUl.find("li:nth-child(" + i + ")") );
		o.polyPsArray.push( $("#fdp" + i) );
	}
		

	//time variables
	var tmark = 0.5,
			tShowPoly = 0.25,
			tP = 0.3;

	//calculate logo position in center of screen and tween to it later
	//don't forget to recalc its position on window resize
	o.logoCenterPos = o.getLogoCenterPos( o.logo, o.ww / 2, o.wh / 2 );

	o.tl.call( o.pauseAnim )
			.to( o.$hpSlogan, 0.6, {opacity: 0}, "hideSloganAndLogoText" )
			.to( o.logoText.node, 0.4, {opacity: 0}, "hideSloganAndLogoText" )
			.to( o.$hpContainer, 0.8, {y: o.logoYShiftToCenter})
			.to( o.$fieldsDescUl, 0, {y: o.logoYShiftToCenter})
			.to( o.$fieldsDescPs, 0, {y: o.logoYShiftToCenter})
			.to( o.$allCities, 0, {fill: "#f00"} )
			.to( o.$allCountries, 0.8, {opacity: 1}, "+=0.4" )
			.to( o.$countriesText, 1, {opacity: 1} )
			.call( o.pauseAnim )
			//exit slide 1
			.to( o.$countriesText, 2, {top: -600, opacity: 0} )
			.to( o.$allCountries, 0.8, {opacity: 0}, "-=1")
			.to( o.fieldsRels.node, 0.8, {opacity: 1} )
			.to( o.$relsText, 1, {opacity: 1}, "+=0.2" )
			.call( o.pauseAnim )
			//exit slide 2
			.to( o.$relsText, 2, {top: -600, opacity: 0} )
			.to( o.fieldsRels.node, 0.8, {opacity: 0}, "-=1")
			.to( o.$allCities, 0.4, {opacity: 0}, "+=1" )
			//fields info show
			.to( o.polyArray[7], tShowPoly, {opacity: 1}, "polyLabel1" )
			.to( o.polyArray[6], tShowPoly, {opacity: 1}, "polyLabel2" )
			.to( o.polyArray[5], tShowPoly, {opacity: 1}, "polyLabel3" )
			.to( o.polyArray[4], tShowPoly, {opacity: 1}, "polyLabel4" )
			.to( o.polyArray[3], tShowPoly, {opacity: 1}, "polyLabel5" )
			.to( o.polyArray[2], tShowPoly, {opacity: 1}, "polyLabel6" )
			.to( o.polyArray[1], tShowPoly, {opacity: 1}, "polyLabel7" )
			.to( o.polyArray[0], tShowPoly, {opacity: 1}, "polyLabel8" )
			//lis
			.to( o.polyLiArray[7], tShowPoly, {opacity: 1}, "polyLabel1" )
			.to( o.polyLiArray[6], tShowPoly, {opacity: 1}, "polyLabel2" )
			.to( o.polyLiArray[5], tShowPoly, {opacity: 1}, "polyLabel3" )
			.to( o.polyLiArray[4], tShowPoly, {opacity: 1}, "polyLabel4" )
			.to( o.polyLiArray[3], tShowPoly, {opacity: 1}, "polyLabel5" )
			.to( o.polyLiArray[2], tShowPoly, {opacity: 1}, "polyLabel6" )
			.to( o.polyLiArray[1], tShowPoly, {opacity: 1}, "polyLabel7" )
			.to( o.polyLiArray[0], tShowPoly, {opacity: 1}, "polyLabel8" )
			//mark it
			.to( o.polyArray[0], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel8" )
			.to( o.polyLiArray[0], tmark, {color: "#f00"}, "markPolyLabel8" )
			.to( o.polyPsArray[0], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[0], tmark, {stroke: "#000"}, "unmarkPolyLabel8" )
			.to( o.polyLiArray[0], tmark, {color: "#000"}, "unmarkPolyLabel8" )
			.to( o.polyPsArray[0], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[1], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel7" )
			.to( o.polyLiArray[1], tmark, {color: "#f00"}, "markPolyLabel7" )
			.to( o.polyPsArray[1], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[1], tmark, {stroke: "#000"}, "unmarkPolyLabel7" )
			.to( o.polyLiArray[1], tmark, {color: "#000"}, "unmarkPolyLabel7" )
			.to( o.polyPsArray[1], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[2], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel6" )
			.to( o.polyLiArray[2], tmark, {color: "#f00"}, "markPolyLabel6" )
			.to( o.polyPsArray[2], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[2], tmark, {stroke: "#000"}, "unmarkPolyLabel6" )
			.to( o.polyLiArray[2], tmark, {color: "#000"}, "unmarkPolyLabel6" )
			.to( o.polyPsArray[2], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[3], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel5" )
			.to( o.polyLiArray[3], tmark, {color: "#f00"}, "markPolyLabel5" )
			.to( o.polyPsArray[3], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[3], tmark, {stroke: "#000"}, "unmarkPolyLabel5" )
			.to( o.polyLiArray[3], tmark, {color: "#000"}, "unmarkPolyLabel5" )
			.to( o.polyPsArray[3], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[4], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel4" )
			.to( o.polyLiArray[4], tmark, {color: "#f00"}, "markPolyLabel4" )
			.to( o.polyPsArray[4], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[4], tmark, {stroke: "#000"}, "unmarkPolyLabel4" )
			.to( o.polyLiArray[4], tmark, {color: "#000"}, "unmarkPolyLabel4" )
			.to( o.polyPsArray[4], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[5], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel3" )
			.to( o.polyLiArray[5], tmark, {color: "#f00"}, "markPolyLabel3" )
			.to( o.polyPsArray[5], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[5], tmark, {stroke: "#000"}, "unmarkPolyLabel3" )
			.to( o.polyLiArray[5], tmark, {color: "#000"}, "unmarkPolyLabel3" )
			.to( o.polyPsArray[5], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[6], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel2" )
			.to( o.polyLiArray[6], tmark, {color: "#f00"}, "markPolyLabel2" )
			.to( o.polyPsArray[6], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[6], tmark, {stroke: "#000"}, "unmarkPolyLabel2" )
			.to( o.polyLiArray[6], tmark, {color: "#000"}, "unmarkPolyLabel2" )
			.to( o.polyPsArray[6], tmark + tP, {opacity: 0}, "-=" + tmark )
			//mark it
			.to( o.polyArray[7], tmark, {stroke: "#f00", strokeDasharray: 0}, "markPolyLabel1" )
			.to( o.polyLiArray[7], tmark, {color: "#f00"}, "markPolyLabel1" )
			.to( o.polyPsArray[7], tmark + tP, {top: 0, opacity: 1}, "-=" + tmark )
			.call( o.pauseAnim )
			//unmark it
			.to( o.polyArray[7], tmark, {stroke: "#000"}, "unmarkPolyLabel1" )
			.to( o.polyLiArray[7], tmark, {color: "#000"}, "unmarkPolyLabel1" )
			.to( o.polyPsArray[7], tmark + tP, {opacity: 0}, "-=" + tmark )
			//hide fields descs
			.to( o.polyArray[0], 0.2, {opacity: 0}, "hidePolyLabel1" )
			.to( o.polyArray[1], 0.2, {opacity: 0}, "hidePolyLabel2" )
			.to( o.polyArray[2], 0.2, {opacity: 0}, "hidePolyLabel3" )
			.to( o.polyArray[3], 0.2, {opacity: 0}, "hidePolyLabel4" )
			.to( o.polyArray[4], 0.2, {opacity: 0}, "hidePolyLabel5" )
			.to( o.polyArray[5], 0.2, {opacity: 0}, "hidePolyLabel6" )
			.to( o.polyArray[6], 0.2, {opacity: 0}, "hidePolyLabel7" )
			.to( o.polyArray[7], 0.2, {opacity: 0}, "hidePolyLabel8" )
			//and lis
			.to( o.polyLiArray[0], 0.5, {opacity: 0}, "hidePolyLabel1" )
			.to( o.polyLiArray[1], 0.5, {opacity: 0}, "hidePolyLabel2" )
			.to( o.polyLiArray[2], 0.5, {opacity: 0}, "hidePolyLabel3" )
			.to( o.polyLiArray[3], 0.5, {opacity: 0}, "hidePolyLabel4" )
			.to( o.polyLiArray[4], 0.5, {opacity: 0}, "hidePolyLabel5" )
			.to( o.polyLiArray[5], 0.5, {opacity: 0}, "hidePolyLabel6" )
			.to( o.polyLiArray[6], 0.5, {opacity: 0}, "hidePolyLabel7" )
			.to( o.polyLiArray[7], 0.5, {opacity: 0}, "hidePolyLabel8" )
			//show last page
			.to( o.$lastP, 0.8, {opacity: 1, top: 0}, "+=0.3" )
			.call( o.pauseAnim )
			.to( o.$continueArrow, 0.1, {opacity: 0}, "+=0.3" )
			.to( o.$lastP, 0.8, {opacity: 0}, "+=0.3" )
			.to( o.$osfLogo, 1.4, {opacity: 1}, "+=0.5" )
			.to( o.$intMapLink, 1, {opacity: 1} )
			.to( o.$projLink, 1.2, {opacity: 1} )
			.call( o.pauseAnim );

	//when everything is ready, animate arrow to indicate scrolling to next slide
	o.isArrowBouncing = true;
	TweenMax.from( o.$continueArrow, 0.8, {bottom: 36, repeat: 10, yoyo: true}, 3 );

}
// END GSAP anim
o.initSlideScrolling = function () {

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
				o.anotherSlide("prev");
			});

	}
	//end of touch devices

	//no-touch devices
	if ( !o.isTouch ) {

		//scroll functionality based on One Page Scroll by Pete R.
		//https://github.com/peachananr/onepage-scroll
		o.lastAnimation = 0;
		o.quietPeriod = 500;
		o.animationTime = 1000;

		$(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      o.init_scroll(event, delta);
    });

	}
	//end of no-touch devices	

}

o.init_scroll = function (event, delta) {

	var deltaOfInterest = delta,
      timeNow = new Date().getTime();
  // Cancel scroll if currently animating or within quiet period
  if(timeNow - o.lastAnimation < o.quietPeriod + o.animationTime) {
    event.preventDefault();
    return;
  }

  if (deltaOfInterest < 0) {
    o.anotherSlide("next");
  } else {
  	o.anotherSlide("prev");
  }
  o.lastAnimation = timeNow;

}
o.initStoryTelling = function () {

	o.initSlideScrolling();

	// arrow click
	o.$continueArrow.click(function(e){
		e.preventDefault();
		o.anotherSlide("next");
	});

	//keyboard
	$(window).keyup(function(e){
		
		var code = e.keyCode || e.which;
		switch (code) {
			case 38:
				o.anotherSlide("prev");
				break;
			case 37:
				o.anotherSlide("prev");
				break;
			case 39:
				o.anotherSlide("next");
				break;
			case 40:
				o.anotherSlide("next");
				break;
			default:
				break;
		}

	});

	//hide preload here
	window.setTimeout(function(){
		o.$body.addClass("all-loaded");
	}, 50);

}

// DOM ready
$(function(){

	o.checkSVG();

	o.hp.initVars();
	o.hp.setContainerHeight();
	o.hp.fixIpad();
	

});
// END DOM ready

// Window resize
$(window).resize(function(){

	if ( !o.$body.hasClass("logged-in") )
		window.location.href = window.location.href;

});
// END Window resize

//Window load
$(window).load(function(e){

  o.hp.init();
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

