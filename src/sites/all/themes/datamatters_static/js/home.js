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
	      o.placeLogo();
	      o.initStoryTelling();
	    }
	  });

	});

}
// END Init homepage interactivity

o.appendCountriesWithProject = function ( d ) {

	//firstly create group for countries, logo and logo pixels
	o.countries = o.s.g();
	o.countries.attr({
		"class": "countries",
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

	//center logo vertically
	var bbox = o.logo.getBBox(),
			svgHeight = o.$hpContainer.height(),
			logoHeight = bbox.y + bbox.h,
			top = ( svgHeight - logoHeight ) / 2;

	//if its not already centered
	if ( !o.centerLogo ) {
		o.centerLogo = top;
		o.placeLogo();
	}

}
o.hideCountries = function () {

	o.countries.attr({
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
		default:
			console.log("some other slide: " + o.currentSlide);
			break;
	}

}
o.initSlideScrolling = function () {

	//init vars
	o.scrolled = false;
	o.lastY = null;
	o.swipeDisabled = false;
	o.currentSlide = 0;

	//touch devices
	document.ontouchmove = function(e) {
		
		e.preventDefault();

		if ( o.lastY && !o.swipeDisabled ) {

			//update slides
			if ( o.lastY < e.pageY )
				o.anotherSlide("prev");
			else
				o.anotherSlide("next");

			o.swipeDisabled = true;

		}
		o.lastY = e.pageY;

	}

	document.ontouchend = function (e) {

		o.lastY = null;
		o.swipeDisabled = false;

	}
	//end of touch devices

	//no-touch devices
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
	//end of no-touch devices	

}
o.initStoryTelling = function () {

	o.initSlideScrolling();

}
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

});
// END Window resize

