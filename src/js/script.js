var o = {};

// Slideout menu
o.slideoutMenu = function () {

	o.$body = $("body");

	$(".main-nav .menu-icon").click(function(e){
		e.preventDefault();
		o.$body.toggleClass("slideout-menu-opened");
	});

}
// END slideout menu


$(function(){

	o.slideoutMenu();

});
