o.setHeight = function() {

	var headerHeight = o.$mainContent.offset().top,
			height = window.innerHeight - headerHeight;
	o.$mainContent.height( height );

}

o.loadCountriesAndProjects = function() {
  
  var bothComplete = 0; //bothComplete has to be == 2, it means that we have loaded both jsons
  var url = $('#map-container').attr('data-json-url');

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/countries",
    'dataType': "json",
    'success': function (data) {
      o.countriesJson = data;
      //o.map.highlightCountriesWithProject();
      bothComplete++;
      if (bothComplete == 2) {
      	//o.countries.initHoverAndClick();
      	//o.countries.center();
      }
    }
  });

  $.ajax({
    'async': false,
    'global': false,
    'url': url + "json/projects",
    'dataType': "json",
    'success': function (data) {
      o.projectsJson = data;
      bothComplete++;
      if (bothComplete == 2) {
      	//o.countries.initHoverAndClick();
      	//o.countries.center();
      }
    }
  });

}

$(function(){

	o.$mainContent = $(".main-content");
	o.setHeight();

	L.mapbox.accessToken = 'pk.eyJ1Ijoib25kcmVqcm9ob24iLCJhIjoiVFVwWWtPOCJ9.tqWegHdwlqVYKPD-d2IFhQ';
	var map = L.mapbox.map('map-container', 'ondrejrohon.oeyfzuxr')
  					 .setView([40, -74.50], 3);

  o.loadCountriesAndProjects();

});

$(window).resize(function(){
	o.setHeight();
});
