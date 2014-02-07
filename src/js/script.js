var o = {};

// Slideout menu
o.slideoutMenu = function () {

	o.$body = $("body");
	o.$window = $(window);
	o.$slideoutMenu = $("#slideout-menu");

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

// Field dropdown
o.activateProjectFilters = function () {
	
	$(".filter-button").click(function(e){
		e.preventDefault();
		$(this).parent().find(".filter-content")
			.height( $(document).height() )
			.css("width", $(window).width() )
			.toggleClass("active");
	});

	//close
	$(".filter-content .close").click(function(e){
		e.preventDefault();
		$(this).parent().parent().removeClass("active");
	});

}
// END Field dropdown

// DOM ready
$(function(){

	o.slideoutMenu();
	o.activateProjectFilters();

});
// END DOM ready

// Window resize
$(window).resize(function(){
	o.slideoutMenuHeight();
});
// END window resize
