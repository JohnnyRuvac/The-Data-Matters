var o = {};
var $ = jQuery;

// Init variables
o.initVars = function() {

	o.$html = $("html");
	o.$body = $("body");
	o.$headerContent = $("header .content");
	o.$window = $(window);
	o.ww = o.$window.width();
	o.wh = o.$window.height();
	o.$mainMenu = $(".main-nav");
	o.$projectPreview = $("#project-preview");
	o.$wrapper = $("#wrapper");
	o.$outerWrapper = $("#outer-wrapper");
	o.$slideoutMenu = $("#slideout-menu");
	o.$filterContents = $(".filter-content");
	o.$mainSearch = $(".main-nav .menu-search");

	o.isTouch = o.$html.hasClass("touch");
	o.svgSupport = o.$html.hasClass("svg");

}
// END Init variables

// Slideout menu
o.slideoutMenu = function () {

	$(".main-nav .menu-icon").click(function(e){
		e.preventDefault();
		o.slideoutMenuHeight();
		o.$body.toggleClass("slideout-menu-opened");
		
		// Jump tp top to see menu
		o.$window.scrollTop(0);
	});

}
o.slideoutMenuHeight = function () {

	var wraph = o.$wrapper.outerHeight(),
			height = (wraph < o.wh) ? o.wh : wraph;
			//o.wh is window height
	o.$slideoutMenu.height( height );

}
o.swipeToOpenMenu = function () {

	//return if it's not touch device, or interactive map
	var isMap = o.$body.hasClass("page-node-19");

	if ( !o.isTouch || isMap ) return;
	
	o.$wrapper
		.on("swipeleft", function() {
			//close it
			if (o.ww > 768) return;
			o.slideoutMenuHeight();
			o.$body.toggleClass("slideout-menu-opened");
		})
		.on("swiperight", function() {
			//open it
			if (o.ww > 768) return;
			o.slideoutMenuHeight();
			o.$body.toggleClass("slideout-menu-opened");
		});
	
}
// END slideout menu

// Filter dropdown
o.activateProjectFilters = function () {
	
	$(".filter-button .label").click(function(e){
		
		e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");
		o.$currentOpenedFilter = $filterContent;

		//fix filter dimensions of filter before opening
		o.fixFilters();

		//close slideoutmenu
		o.$body.removeClass("slideout-menu-opened");

		//add active class to filter button to remove position relative
		$(this).closest(".filter-button").addClass("active");

		//change color of body to grey for mobiles and jump to top
		if (o.ww < 769) {
		  o.$body.addClass("grey");
		  $(window).scrollTop(0);
	  }

		//close other filters if they are open
		var isActive;
		if ( $filterContent.hasClass("active") ) isActive = true;
		o.$filterContents.removeClass("active");
		
		//for mobile devices filter should be fullscreen, for tablets and larger it should be dropdown
		var width  = (o.ww < 769) ? o.ww : $filterContent.css("width");

		$filterContent
			.css("width", width )
			.addClass("active");

		if (isActive) $filterContent.removeClass("active");

	});

	//close
	$(".filter-content .close").click(function(e){
		e.preventDefault();
		$(this).closest(".filter-content").removeClass("active");
		$(this).closest(".filter-button").removeClass("active");
		//change body color back
		if (o.ww < 769) o.$body.removeClass("grey");
		//remove outer wrapper inline height
		o.$outerWrapper.css("height", "auto");
		o.$currentOpenedFilter = null;
	});

	//filter li click
	$(".filter-button:not(.menu-tablet) .filter-content li a").click(function(e){

		e.preventDefault();

		//check if the name should be shorten
		var text = $(this).text();
		//if ( text.length > 15 ) text = text.slice(0, 15) + "...";

		var $filterButton = $(this).closest(".filter-button");
		$filterButton
					 .find(".label")
					 .text( text )
					 .addClass("active");

		//close filter
		$filterButton
						.removeClass("active")
						.find(".filter-content")
						.removeClass("active");

		//change body color back
		if (o.ww < 769) o.$body.removeClass("grey");
		//remove outer wrapper inline height
		o.$outerWrapper.css("height", "auto");
		o.$currentOpenedFilter = null;
		
		//show clear filter icon
		$filterButton.find(".clear-filter").addClass("active");

	});

}
o.fixFilters = function() {

	//if there is no opened filter, return, we don't need to check this on every window resize
	if ( !o.$currentOpenedFilter ) return;

	var filterHeight = o.$currentOpenedFilter.outerHeight();

	if (o.ww > 768) {

		//after resize from tablet to large desktop, we have to remove inline width and height
		o.$filterContents.removeAttr("style");
		//also on wrapper
		o.$outerWrapper.removeAttr("style");

	} else {
		
		//adjust width and height to fill whole screen on mobiles, check if filter isn't taller than screen
		var newHeight = ( filterHeight > o.wh ) ? filterHeight : o.wh;
		//shorten outer wrapper, so there's no scroll on opened filter
		o.$outerWrapper.height( newHeight );
		o.$currentOpenedFilter.css({"height": newHeight});
		o.ww = o.$window.width();
		o.$currentOpenedFilter.css({"width": o.ww});

	}
}
// END Filter dropdown

// Project preview
o.activateProjectPreview = function() {

	if($("body").hasClass("node-type-project")) $("body").addClass("project-preview");

  o.hashOnLoad = window.location.hash;

  if(o.hashOnLoad){
    $(".close-full-preview").attr("href", $(".close-full-preview").attr("href") + window.location.hash);
  }

	$(".project").click(function(e){
		
		// e.preventDefault();
		// $("body").addClass("project-preview");

		//scroll to top, but save scroll position after preview close
		// var currentScroll = $(window).scrollTop();
		// $(window).scrollTop(0);

		// o.fixProjectPreviewHeight();
		// o.closeProjectPreview( currentScroll );

	});

}
o.closeProjectPreview = function(scrollBefore) {

	$(".close-full-preview").click(function(e){
		
		e.preventDefault();
		$("body").removeClass("project-preview");
		$(window).scrollTop(scrollBefore);
		$(this).unbind("click");
		//clean up heights
		o.$wrapper.css("height", "auto");
		o.$projectPreview.css("height", "auto");

	});

}
o.fixProjectPreviewHeight = function () {

	var menuHeight = o.$mainMenu.outerHeight(),
			projectHeight = o.$projectPreview.outerHeight(),
			height;

	//cover whole window on tall screens
	if ( menuHeight + projectHeight < o.wh ) {
		height = o.wh - menuHeight;
		o.$projectPreview.height( height );
		o.$wrapper.height( height );
	}
	else {
		height = projectHeight + menuHeight;
		o.$wrapper.height( height );
	}

	//clean up heights if preview is not opened
	if ( !$("body").hasClass("project-preview") ) {
		o.$wrapper.css("height", "auto");
		o.$projectPreview.css("height", "auto");
	}

}
// END project preview

// Affix navi
o.affixNavi = function() {

	o.$headerContent.affix({
		offset: {
			top: function(){return (o.ww < 769) ? 140 : 0}
		}
	});
	
	o.$headerContent.on('affix.bs.affix', function () {
    console.log('Fired!1');
  });
  
  o.$headerContent.on('affixed.bs.affix', function () {
    console.log('Fired!2');
  });

}
// END Affix navi

// Search
o.activateSearch = function () {

	// in slideout menu
	$(".slideout-search").click(function(e){
		
		//e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");
		o.$currentOpenedFilter = $filterContent;

		$filterContent
			.height( $(document).height() )
			.css("width", o.ww )
			.addClass("active");

		//focus on input
		$(this).parent().find(".search-input").focus();

	});

  $(".search-results a").click(function(){
    var link = $(this).attr("href");
  })

	//in header
	$(".menu-search input").focus(function(){
		//$(this).parent().addClass("active");
	});
	$(".menu-search input").blur(function(){
		//$(this).parent().removeClass("active");
	});	

}
// END Search

// Projects sorting
o.projectsFiltering = function () {

	//init mixitup if there is no hash tag, otherwise init it in o.filterProjectsByString();
	o.hashOnLoad = window.location.hash;

  o.emptyString = function(){

  }

	if (!o.hashOnLoad)
		$("#grid").mixItUp({
  		callbacks: {
        //onMixFail: o.emptyString()
        }
    });

	//update filters according to hash tag
	o.filterProjectsByHash();

	// save active filter for later use
	$(".project-filter a, .project .country a, .project .field a").click(function(e){
		
		e.preventDefault();
		var group = $(this).parent().attr("data-group");

		if (group == "country")
			o.activeCountryFilter = $(this).parent().attr("data-filter");
		else
			o.activeFieldFilter = $(this).parent().attr("data-filter");

		o.filterProjectsByString();

	});

	//clear filter
	$(".clear-filter").click(function(e){

		e.preventDefault();
		//hide clear filter icon
		$(this).removeClass("active");
		//show original label name
		$label = $(this).parent().find(".label");
		$label.removeClass("active")
					.html( $label.attr("data-orig-name") );

		//clear filter variable
		var group = $(this).attr("data-group");
		if (group == "countries") 
			o.activeCountryFilter = undefined;
		else 
			o.activeFieldFilter = undefined;

       window.location.hash = "";
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  );
		});

		o.filterProjectsByString();

	});

}
o.filterProjectsByString = function () {

	var filterString = '';
	//only field
	if ( o.activeFieldFilter ) {
		filterString = "." + o.activeFieldFilter;
		window.location.hash = "field=" + o.activeFieldFilter;
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//only country
	if ( o.activeCountryFilter ) {
		filterString = "." + o.activeCountryFilter;
		window.location.hash = "country=" + o.activeCountryFilter;
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//both
	if ( o.activeFieldFilter && o.activeCountryFilter ) {
		filterString = "." + o.activeFieldFilter + '.' + o.activeCountryFilter;
		window.location.hash = "field=" + o.activeFieldFilter + "/country=" + o.activeCountryFilter;	
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//none of them
	if ( !filterString ) {
		filterString = 'all';
		window.location.hash = "";
	}
	
	//if there is hash, init mixit up with this filter string, otherwise just filter it
	if ( o.hashOnLoad ) {

		$("#grid").mixItUp({
			load: {
				filter: filterString
			}
		});
		o.hashOnLoad = false;

	} else {
		
		$("#grid").mixItUp("filter", filterString);

	}

}
o.searchStringInArray = function(str, strArray) {

  for (var j=0; j<strArray.length; j++) {
    if (strArray[j].match(str)) 
    	return strArray[j].replace(str, "");
  }
  return false;

}
o.filterProjectsByHash = function () {

	//check hash tag for activeFieldFilter, activeCountryFilter, and update those variables
	var s = window.location.hash;

	//return on no hash
	if (!s)
		return;

	s = s.replace("#","");
	s = s.split("/");
	o.activeFieldFilter = o.searchStringInArray( "field=", s );
	o.activeCountryFilter = o.searchStringInArray( "country=", s );

	//activate Field Filter
	if ( o.activeFieldFilter ) {

		var $filterLi = $('.project-filter[data-filter="' + o.activeFieldFilter + '"]'),
				$filterButton = $filterLi.closest(".filter-button"),
				text = $filterLi.text();

		$filterButton
			.find(".label")
			.text( text )
			.addClass("active");

		//show clear filter icon
		$filterButton.find(".clear-filter").addClass("active");

	}

	//activate Country Filter
	if ( o.activeCountryFilter ) {

		var $filterLi = $('.project-filter[data-filter="' + o.activeCountryFilter + '"]'),
				$filterButton = $filterLi.closest(".filter-button"),
				text = $filterLi.text();

		$filterButton
			.find(".label")
			.text( text )
			.addClass("active");

		//show clear filter icon
		$filterButton.find(".clear-filter").addClass("active");

	}


	//filter projects
	o.filterProjectsByString();

}
// END projects sorting

//project detail, show NGO contact
o.showNGO = function () {
	$(".info .ngo").click(function(e){
		e.preventDefault();
		$(this).toggleClass("active");
		$(".info .contacts").toggleClass("show");
	});
}
//END project detail, show NGO contact

//organisations page, rearange DOM
o.sortNGO = function(){
  if($(".view-organisations").length > 0){
    var colViewNew;
    var colViewOld = $(".view-organisations").attr("class").split(" ")[1];
  
    if(o.ww > 0 && o.ww <= 492) colViewNew = "col-view1";
    else if(o.ww > 492 && o.ww <= 769) colViewNew = "col-view2";
    else colViewNew = "col-view3";
    
    if(colViewOld != colViewNew){
      $(".view-organisations").removeClass(colViewOld).addClass(colViewNew);
      
      var modulo = parseFloat(colViewNew.replace("col-view", ""));
      
      $(".view-organisations .grouping-level0").each(function(i, e){
        
        var e = $(".view-organisations .grouping-level0.grouping" + (i+1));
        e.appendTo(".view-organisations .col-" + (i%modulo + 1));
        
      })
    }
  }
  
}
//END organisations page, rearange DOM

// Page load

o.welcome = function(){
  $(window).load(function(){
    o.$body.addClass("loaded");
  })
}

//END Page load

// Check SVG support
o.checkSVG = function () {

	var mobile = o.ww < 768;

	if ( !o.svgSupport || mobile) {
		window.location = "/projects";
	}

}
// END check SVG support

// Check SVG support
o.trimTitles = function () {

	var miniMobile = o.ww < 400;

	if ( miniMobile) {
		$(".project h2").each(function(){
  		var lines = $(this).height() / 17;
  		var text = $(this).find("a").html();
  		if(text.length > 34){
  		  text = text.slice(0, 35) + "...";
  		  $(this).find("a").html(text);
  		}
		})
	}

}
// END check SVG support

// DOM ready
$(function(){

	o.initVars();
	o.slideoutMenu();
	o.swipeToOpenMenu();
	o.activateProjectFilters();
	o.activateProjectPreview();
	o.affixNavi();
	o.activateSearch();
	o.projectsFiltering();
	o.showNGO();
  o.sortNGO();
  o.welcome();

});
// END DOM ready

// Window Load
$(window).load(function(){

	  o.trimTitles();

});
// END of Window Load

// Window resize
$(window).resize(function(){

	o.ww = o.$window.width();
	o.wh = o.$window.height();
	o.fixFilters();
	//o.fixProjectPreviewHeight();
  o.sortNGO();
  
  o.trimTitles();
  
  //neviem kam s tymto
  if(o.$mainSearch.hasClass("focus")) o.$mainSearch.find("input").trigger("focusout").blur();
});
// END window resize
