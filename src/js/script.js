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

// DOM ready
$(function(){

	o.slideoutMenu();

});
// END DOM ready

// Window resize
$(window).resize(function(){
	o.slideoutMenuHeight();
});
// END window resize
