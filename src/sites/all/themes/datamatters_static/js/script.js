var o = {};

// Init variables
o.initVars = function() {

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

}
// END Init variables

// Slideout menu
o.slideoutMenu = function () {

	$(".main-nav .menu-icon").click(function(e){
		e.preventDefault();
		o.slideoutMenuHeight();
		o.$body.toggleClass("slideout-menu-opened");
	});

}
o.slideoutMenuHeight = function () {

	var wraph = o.$wrapper.outerHeight(),
			height = (wraph < o.wh) ? o.wh : wraph;
			//o.wh is window height
	o.$slideoutMenu.height( height );

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

		//change color of body to grey for mobiles
		if (o.ww < 769) o.$body.addClass("grey");

		//add active class to filter button to remove position relative
		$(this).closest(".filter-button").addClass("active");

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
		if ( text.length > 15 ) text = text.slice(0, 15) + "...";

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

	if (o.ww > 767) {

		//after resize from tablet to large desktop, we have to remove inline width and height
		o.$filterContents.removeAttr("style");

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

// Trim long texts
o.trimLongTexts = function () {

	//project names
	if (o.ww < 340) {
		if (o.projectTrimmed) return;
		$(".project h2").each(function() {
			if ( $(this).text().length > 36 ) {
				var text = $(this).text();
				$(this).addClass("trimmed")
							 .attr("data-text", text);
				$(this).text( text.slice(0, 32) + "..." );
			}
		});
		o.projectTrimmed = true;

	} else {

		if (!o.projectTrimmed) return;
		$(".project .trimmed").each(function(){
			$(this).text( $(this).attr("data-text") );
		});
		o.projectTrimmed = false;
	}
	//END project names

}
// END Trim long texts

// Affix navi
o.affixNavi = function() {

	o.$headerContent.affix({
		offset: {
			top: function(){return (o.ww < 769) ? 140 : 0}
		}
	});

}
// END Affix navi

// Search
o.activateSearch = function () {

	// in slideout menu
	$(".slideout-search").click(function(e){
		
		e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");
		o.$currentOpenedFilter = $filterContent;

		$filterContent
			.height( $(document).height() )
			.css("width", o.ww )
			.addClass("active");

		//focus on input
		$(this).parent().find(".search-input").focus();

	});

	//in header
	$(".menu-search input").focus(function(){
		//$(this).parent().addClass("active");
	});
	$(".menu-search input").blur(function(){
		$(this).parent().removeClass("active");
	});	

}
// END Search

// Projects sorting
o.projectsSorting = function () {

	// $("#grid").mixitup({
	// 	onMixStart: function(){
	// 		console.log("start");
	// 	}
	// });

	// save active filter for later use
	$(".filter a").click(function(){
		var group = $(this).parent().attr("data-group");
		if (group == "country") o.activeCountryFilter = $(this).parent().attr("data-filter");
		else o.activeFieldFilter = $(this).parent().attr("data-filter");

		console.log( o.activeFieldFilter );
		console.log( o.activeCountryFilter );
	});

	$("#grid").mixitup({
		multiFilter: true,
		filterLogic: 'and'
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
		//show all results
		$('#grid').mixitup('filter','all');

	});

}
o.clearProjectsSorting = function () {



}
// END projects sorting

// DOM ready
$(function(){

	o.initVars();
	o.slideoutMenu();
	o.activateProjectFilters();
	o.activateProjectPreview();
	o.trimLongTexts();
	o.affixNavi();
	o.activateSearch();
	o.projectsSorting();

});
// END DOM ready

// Window Load
$(window).load(function(){

	

});
// END of Window Load

// Window resize
$(window).resize(function(){

	o.ww = o.$window.width();
	o.wh = o.$window.height();
	o.fixFilters();
	//o.fixProjectPreviewHeight();
	o.trimLongTexts();

});
// END window resize
