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
		$("body").addClass("project-preview");

		//scroll to top, but save scroll position after preview close
		var currentScroll = $(window).scrollTop();
		$(window).scrollTop(0);

		//adjust window height
		var menuHeight = $(".main-nav").height(),
				previewHeight = $("#project-preview").height(),
				height = menuHeight + previewHeight;

		$("#outer-wrapper").height( height );

		o.closeProjectPreview( currentScroll );

	});

}
o.closeProjectPreview = function(scrollBefore) {

	$(".close-full-preview").click(function(e){
		
		e.preventDefault();
		$("body").removeClass("project-preview");
		$(window).scrollTop(scrollBefore);
		$(this).unbind("click");

		//reset height
		$("#outer-wrapper").css("height", "auto");

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
