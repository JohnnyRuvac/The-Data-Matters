var o = {};

// Init variables
o.initVars = function() {

	o.$body = $("body");
	o.$window = $(window);
	o.ww = o.$window.width();

	o.$slideoutMenu = $("#slideout-menu");

	o.$filterContents = $(".filter-content");

}
// END Init variables

// Slideout menu
o.slideoutMenu = function () {

	$(".main-nav .menu-icon").click(function(e){
		e.preventDefault();
		o.$body.toggleClass("slideout-menu-opened");
	});

	//fix height
	o.slideoutMenuHeight();

}
o.slideoutMenuHeight = function () {
	o.$slideoutMenu.css({ "min-height": $(document).height() });
}
// END slideout menu

// Filter dropdown
o.activateProjectFilters = function () {
	
	$(".filter-button a").click(function(e){
		
		e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");

		//close other filters if they are open
		var isActive;
		if ( $filterContent.hasClass("active") ) isActive = true;
		o.$filterContents.removeClass("active");
		
		//for mobile devices filter should be fullscreen, for tablets and larger it should be dropdown
		var width  = (o.ww < 768) ? $(window).width() : $filterContent.css("width"),
			  height = (o.ww < 768) ? $(document).height() : $filterContent.height();

		$filterContent
			.height( height )
			.css("width", width )
			.addClass("active");

		if (isActive) $filterContent.removeClass("active");

	});

	//close
	$(".filter-content .close").click(function(e){
		e.preventDefault();
		$(this).parent().parent().removeClass("active");
	});

	//filter li click
	$(".filter-content li a").click(function(e){

		e.preventDefault();
		$(this).closest(".filter-button")
					 .find(".label")
					 .text( $(this).text() )
					 .addClass("active");

	});

}
o.fixFilters = function() {
	//after resize from tablet to large desktop, we have to remove inline width and height
	if (o.ww > 767) {
		o.$filterContents.removeAttr("style");
	}
}
// END Filter dropdown

// Project preview
o.activateProjectPreview = function() {

	$(".project").click(function(e){
		e.preventDefault();
		
	});

}
// END project preview

// DOM ready
$(function(){

	o.initVars();
	o.slideoutMenu();
	o.activateProjectFilters();
	o.activateProjectPreview();

});
// END DOM ready

// Window resize
$(window).resize(function(){

	o.ww = o.$window.width();
	o.slideoutMenuHeight();
	o.fixFilters();

});
// END window resize
