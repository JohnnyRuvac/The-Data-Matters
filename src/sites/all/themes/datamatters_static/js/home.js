o.setHeight = function() {

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;
	o.$mainContent.height( height );

}

$(function(){

	o.$mainContent = $(".main-content");
	o.setHeight();

	L.mapbox.accessToken = 'pk.eyJ1Ijoib25kcmVqcm9ob24iLCJhIjoiVFVwWWtPOCJ9.tqWegHdwlqVYKPD-d2IFhQ';
	var map = L.mapbox.map('map-container', 'ondrejrohon.oeyfzuxr')
  					 .setView([40, -74.50], 9);

});

$(window).resize(function(){
	o.setHeight();
});
