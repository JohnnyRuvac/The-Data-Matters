var o = {};
var $ = jQuery;

// Init variables
o.initVars = function() {

	o.$body = $("body");
	o.$window = $(window);
	o.ww = o.$window.width();
	o.wh = o.$window.height();
	o.$mainMenu = $(".main-nav");
	o.$projectPreview = $("#project-preview");
	o.$wrapper = $("#wrapper");
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
	
	$(".filter-button a").click(function(e){
		
		e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");

		//close other filters if they are open
		var isActive;
		if ( $filterContent.hasClass("active") ) isActive = true;
		o.$filterContents.removeClass("active");
		
		//for mobile devices filter should be fullscreen, for tablets and larger it should be dropdown
		var width  = (o.ww < 769) ? $(window).width() : $filterContent.css("width"),
			  height = (o.ww < 769) ? $(document).height() : $filterContent.height();

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

		o.fixProjectPreviewHeight();
		o.closeProjectPreview( currentScroll );

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

// DOM ready
$(function(){

	o.initVars();
	o.slideoutMenu();
	o.activateProjectFilters();
	o.activateProjectPreview();
	o.trimLongTexts();

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
	o.fixProjectPreviewHeight();
	o.trimLongTexts();

});
// END window resize
