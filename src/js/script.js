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
	o.$slideoutMenu.height( o.$window.height() );
}
// END slideout menu

// Field dropdown
o.fieldDropdown = function () {

	$("#field-button, #field-dropdown .close").click(function(e){
		e.preventDefault();
		$("#field-dropdown").toggleClass("active");
	});

}
// END Field dropdown

// Country dropdown
o.countryDropdown = function () {

	$("#country-button, #country-dropdown .close").click(function(e){
		e.preventDefault();
		$("#country-dropdown").toggleClass("active");
	});

}
// END Country dropdown

// DOM ready
$(function(){

	o.slideoutMenu();
	o.fieldDropdown();
	o.countryDropdown();

});
// END DOM ready

// Window resize
$(window).resize(function(){
	o.slideoutMenuHeight();
});
// END window resize
