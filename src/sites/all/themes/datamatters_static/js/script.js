var o = {};
var $ = jQuery;

// Init variables
o.initVars = function() {

	o.$html = $("html");
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
	o.$mainSearch = $(".main-nav .menu-search");
  o.isRetina = window.devicePixelRatio > 1;
	o.isTouch = o.$html.hasClass("touch");
	o.svgSupport = o.$html.hasClass("svg");

  o.nameArray = [];

}
// END Init variables

// Slideout menu
o.slideoutMenu = function () {

	$(".main-nav .menu-icon").click(function(e){
		e.preventDefault();
		o.slideoutMenuHeight();
		o.$body.toggleClass("slideout-menu-opened");
		
		// Jump tp top to see menu
		o.$window.scrollTop(0);
		
	});

}
o.slideoutMenuHeight = function () {

	var wraph = o.$wrapper.outerHeight(),
			height = (wraph < o.wh) ? o.wh : wraph;
			//o.wh is window height
	o.$slideoutMenu.height( height );

}
o.swipeToOpenMenu = function () {

	//return if it's not touch device, or interactive map
	var isMap = o.$body.hasClass("page-node-19");

	if ( !o.isTouch || isMap ) return;
	
	o.$wrapper
		.on("swipeleft", function() {
			//close it
			if (o.ww > 768) return;
			o.slideoutMenuHeight();
			o.$body.toggleClass("slideout-menu-opened");
		})
		.on("swiperight", function() {
			//open it
			if (o.ww > 768) return;
			o.slideoutMenuHeight();
			o.$body.toggleClass("slideout-menu-opened");
		});
	
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

		//add active class to filter button to remove position relative
		$(this).closest(".filter-button").addClass("active");

		//change color of body to grey for mobiles and jump to top
		if (o.ww < 769) {
		  o.$body.addClass("grey");
		  $(window).scrollTop(0);
	  }

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
		//if ( text.length > 15 ) text = text.slice(0, 15) + "...";

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

	o.$body.removeClass("slideout-menu-opened");

	//if there is no opened filter, return, we don't need to check this on every window resize
	if ( !o.$currentOpenedFilter ) return;

	var filterHeight = o.$currentOpenedFilter.outerHeight();

	if (o.ww > 768) {

		//after resize from tablet to large desktop, we have to remove inline width and height
		o.$filterContents.removeAttr("style");
		//also on wrapper
		o.$outerWrapper.removeAttr("style");

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

  o.hashOnLoad = window.location.hash;

  if(o.hashOnLoad){
    $(".close-full-preview").attr("href", $(".close-full-preview").attr("href") + window.location.hash);
  }

  
  $(".projects .project img").each(function(i){
    var img = $(this).attr("data-src");
      
    if(o.isRetina)
      img = img.replace("/preview/", "/preview_2x/");
    
    
    $(this).attr("src", img);
    $(this).removeAttr("data-src");
      
    console.log(img, i);
  })
  
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

// Affix navi
o.affixNavi = function() {

	o.$headerContent.affix({
		offset: {
			top: function(){return (o.ww < 769) ? 140 : 0}
		}
	});
	
	// affix-top event
	o.$headerContent.on("affix-top.bs.affix", function(){
  	if(o.ww < 769){
    	o.$headerContent.removeAttr("style");
    	o.$headerContent.removeClass("animate");

  	}
	})
	
 
	// affix event
	o.$headerContent.on("affix.bs.affix", function(){
  	if(o.ww < 769){
  	  o.$headerContent.css({top: "-100px"});
  	  setTimeout(function(){
  	    o.$headerContent.addClass("animate");
    	  o.$headerContent.css({top: "0px"});
  	  }, 10)

  	}
 
	})

}
// END Affix navi

// Search
o.activateSearch = function () {

	// in slideout menu
	$(".slideout-search").click(function(e){
		
		//e.preventDefault();
		var $filterContent = $(this).parent().find(".filter-content");
		o.$currentOpenedFilter = $filterContent;

		$filterContent
			.height( $(document).height() )
			.css("width", o.ww )
			.addClass("active");

		//focus on input
		$(this).parent().find(".search-input").focus();

	});

}
// END Search

// Projects sorting
o.projectsFiltering = function () {

	//init mixitup if there is no hash tag, otherwise init it in o.filterProjectsByString();
	o.hashOnLoad = window.location.hash;

	if (!o.hashOnLoad) {
		$("#grid").mixItUp({
			animation: {
				duration: 400,
				effects: 'fade stagger(20ms) scale(0.40)',
				easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)'
			}
		});
	}

	//update filters according to hash tag
	o.filterProjectsByHash();

	// save active filter for later use
	$(".project-filter a, .project .country a, .project .field a").click(function(e){
		
		e.preventDefault();
		var group = $(this).parent().attr("data-group");

		if (group == "country" || group == "countries")
			o.activeCountryFilter = $(this).parent().attr("data-filter");
		else
			o.activeFieldFilter = $(this).parent().attr("data-filter");

		o.filterProjectsByString();
		o.checkProjectFilters();
    
    if(o.ww < 769){
      o.$window.scrollTop(0);
    }
    
    
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

		//clear filter variable
		var group = $(this).attr("data-group");
		if (group == "countries") 
			o.activeCountryFilter = undefined;
		else 
			o.activeFieldFilter = undefined;

    window.location.hash = "";

		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  );
		});

		o.filterProjectsByString();

	});

}
o.filterProjectsByString = function () {

	var filterString = '';
	//only field
	if ( o.activeFieldFilter ) {
		filterString = "." + o.activeFieldFilter;
		window.location.hash = "field=" + o.activeFieldFilter;
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//only country
	if ( o.activeCountryFilter ) {
		filterString = "." + o.activeCountryFilter;
		window.location.hash = "country=" + o.activeCountryFilter;
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//both
	if ( o.activeFieldFilter && o.activeCountryFilter ) {
		filterString = "." + o.activeFieldFilter + '.' + o.activeCountryFilter;
		window.location.hash = "field=" + o.activeFieldFilter + "/country=" + o.activeCountryFilter;	
		$(".project a").each(function(){
		  var link = $(this).attr("href").split("#");
		  $(this).attr("href", link[0]  + window.location.hash);
		});
	}
	//none of them
	if ( !filterString ) {
		filterString = 'all';
		window.location.hash = "";
	}
	
	//if there is hash, init mixit up with this filter string, otherwise just filter it
	if ( o.hashOnLoad ) {

		$("#grid").mixItUp({
			load: {
				filter: filterString
			},
			animation: {
				duration: 300,
				effects: 'fade stagger(20ms) scale(0.40)',
				easing: 'cubic-bezier(0.47, 0, 0.745, 0.715)'
			}
		});
		o.hashOnLoad = false;

	} else {
		
		$("#grid").mixItUp("filter", filterString);

	}

}
o.checkProjectFilters = function () {

	//activate Field Filter
	if ( o.activeFieldFilter ) {

		var $filterLi = $('.project-filter[data-filter="' + o.activeFieldFilter + '"]'),
				$filterButton = $filterLi.closest(".filter-button"),
				text = $filterLi.text();

		$filterButton
			.find(".label")
			.text( text )
			.addClass("active");

		//show clear filter icon
		$filterButton.find(".clear-filter").addClass("active");

	}

	//activate Country Filter
	if ( o.activeCountryFilter ) {

		var $filterLi = $('.project-filter[data-filter="' + o.activeCountryFilter + '"]'),
				$filterButton = $filterLi.closest(".filter-button"),
				text = $filterLi.text();

		$filterButton
			.find(".label")
			.text( text )
			.addClass("active");

		//show clear filter icon
		$filterButton.find(".clear-filter").addClass("active");

	}

}
o.searchStringInArray = function(str, strArray) {

  for (var j=0; j<strArray.length; j++) {
    if (strArray[j].match(str)) 
    	return strArray[j].replace(str, "");
  }
  return false;

}
o.filterProjectsByHash = function () {

	//check hash tag for activeFieldFilter, activeCountryFilter, and update those variables
	var s = window.location.hash;

	//return on no hash
	if (!s)
		return;

	s = s.replace("#","");
	s = s.split("/");
	o.activeFieldFilter = o.searchStringInArray( "field=", s );
	o.activeCountryFilter = o.searchStringInArray( "country=", s );

	//filter projects
	o.filterProjectsByString();
	o.checkProjectFilters();

}
// END projects sorting

//project detail, show NGO contact
o.showNGO = function () {
	$(".info .ngo").click(function(e){
		e.preventDefault();
		$(this).toggleClass("active");
		$(".info .contacts").toggleClass("show");
	});
}
//END project detail, show NGO contact

//organisations page, rearange DOM
o.sortNGO = function(){
  if($(".view-organisations").length > 0){
    var colViewNew;
    var colViewOld = $(".view-organisations").attr("class").split(" ")[1];
  
    if(o.ww > 0 && o.ww <= 492) colViewNew = "col-view1";
    else if(o.ww > 492 && o.ww <= 769) colViewNew = "col-view2";
    else colViewNew = "col-view3";
    
    if(colViewOld != colViewNew){
      $(".view-organisations").removeClass(colViewOld).addClass(colViewNew);
      
      var modulo = parseFloat(colViewNew.replace("col-view", ""));
      
      $(".view-organisations .grouping-level0").each(function(i, e){
        
        var e = $(".view-organisations .grouping-level0.grouping" + (i+1));
        e.appendTo(".view-organisations .col-" + (i%modulo + 1));
        
      })
    }
  }
  
}
//END organisations page, rearange DOM

// Page load

o.welcome = function(){
  $(window).load(function(){
    o.$body.addClass("loaded");
  })
}

//END Page load

// Check SVG support
o.checkSVG = function () {

	var mobile = o.ww < 768;

	if ( !o.svgSupport || mobile) {
		window.location = "/projects";
	}

}
// END check SVG support

// Check SVG support
o.trimTitles = function () {

	var miniMobile = o.ww < 400;

	if ( miniMobile) {
		$(".project h2").each(function(){
  		var lines = $(this).height() / 17;
  		var text = $(this).find("a").html();
  		if(text.length > 34){
  		  text = text.slice(0, 35) + "...";
  		  $(this).find("a").html(text);
  		}
		})
	}

}
// END check SVG support


// Toggle image description

o.toggleImageDescription = function () {

	$(".has-description").click(function(){
  	$(this).toggleClass("open");
	})

}
// END Toggle image description


// Load JSON for search use

o.loadSearchJSON = function(){
  $.getJSON("/json/countries", function(data){
		$.each(data, function(key, val){
			o.nameArray.push({"name":val.country.name, "low":val.country.name.toLowerCase(), "link":val.country.link});
		})
	})
	$.getJSON("/json/fields", function(data){
		$.each(data, function(key, val){
			o.nameArray.push({"name":val.field.name,"low":val.field.name.toLowerCase(), "link":val.field.link});
		})
	})
	$.getJSON("/json/projects", function(data){
		$.each(data, function(key, val){
			o.nameArray.push({"name":val.node.title, "low":val.node.title.toLowerCase(), "link":val.node.path});
		})
	})
}

// END Load JSON for search use

// search in array function

o.searchArray = function(str, arr){
  var items = [];
  var count = 0;
	$.each(arr, function(key, val){
	  count++;
		if(val.low.search(str.toLowerCase()) >= 0){
		  items.push("<li><a href='"+val.link+"'>"+val.name+"</a></li>");
		  $("#slideout-menu .filter-content").addClass("populated");
		}else{
		  //$("#slideout-menu .filter-content").removeClass("populated");  		
		}
		//if(count > 10) return false;
	})

	return items.join("");
}

// END search in array function

// Search input function

o.searchFunction = function(){

  // Focus on search icon click
  $(".menu-search .submit").click(function(e){
		e.preventDefault();
		$(".menu-search input").trigger("focusin").focus();
	});
	
	
	// click on result item
	$("#slideout-menu .filter-content li a, .main-nav .search-results li a").live("click", function(e){
		
	  o.clickSearch = true;
		
		var windowLink = window.location.pathname;
		var newLink = $(this).attr("href");
		
		// if we are on projects page
		if(windowLink == "/projects" && !newLink.indexOf("/projects")){
		  e.preventDefault();
		  var filter = newLink.split("#")[1].split("=")[1];
			var group = newLink.split("#")[1].split("=")[0];
			
			// in case of mobile device search
			if($(window).width() <= 768){
			  window.location.hash = "#" + group + "=" + filter;
        window.location.reload(true);
		  }
			
			// set search filter
			var $filterLi = $('.project-filter[data-filter="' + filter + '"]'),
  				$filterButton = $filterLi.closest(".filter-button"),
  				text = $filterLi.text();
  
  		$filterButton
  			.find(".label")
  			.text( text )
  			.addClass("active");
  
  		//show clear filter icon
  		$filterButton.find(".clear-filter").addClass("active");
			
			if (group == "country")
  			o.activeCountryFilter = filter;
  		else
  			o.activeFieldFilter = filter;
      
      $(".menu-search input").val("");
      $(".menu-search").removeClass("focus").removeClass("active");
  		o.filterProjectsByString();
			
		}
	});
	
	// keyboard input in search field
	
	$(".menu-search input, #slideout-menu .search-input").keyup(function(e){
		var str = $(this).val().toLowerCase();
		
		// adding active class for search results
		if(str.length > 0){
			$(".menu-search .search-results, #slideout-menu ul.clearfix").html(o.searchArray(str, o.nameArray));
			if(!$(this).hasClass("search-input")) $(".menu-search .search-results").parent().addClass("active");
		}

	})
	.focusin(function(){
		if(!$(this).hasClass("search-input")){
			 $(this).parent().addClass("focus");
			 o.clickSearch = false;
			 
			 // checking if there enough space for focus expansion
			 var leftSpace = $(window).width() - $(this).offset().left;
			 if($(window).width() < 1200){
  			 if(leftSpace < 314){
    			 $(".main-nav .menu-search").css({maxWidth: leftSpace})
    			 .find("input").css({maxWidth: leftSpace - 36});
    			 $(".main-nav .search-results").css({maxWidth: leftSpace  - 36 + 2});
  			 }else if(leftSpace >= 314 && $(".main-nav .menu-search").css("max-width") != "auto"){
    			 $(".main-nav .menu-search").css({maxWidth: "auto"})
    			 .find("input").css({maxWidth: "auto"});
    			 $(".main-nav .search-results").css({maxWidth: "auto"});
    			 
  			 }
			 }
    }
	})
	.focusout(function(){
		if(!$(this).hasClass("search-input")){
			var search = $(this);

      // waiting after click with focus
			setTimeout(function(e){
  			if(!o.clickSearch) {
    			search.parent().removeClass("focus").removeClass("active");
  			} 
			}, 200);
		} 
	});
	
	
	
}

// END Search input function

// DOM ready
$(function(){

	o.initVars();
	o.slideoutMenu();
	o.swipeToOpenMenu();
	o.activateProjectFilters();
	o.activateProjectPreview();
	o.affixNavi();
	o.activateSearch();
	o.projectsFiltering();
	o.showNGO();
  o.sortNGO();
  o.welcome();
  o.toggleImageDescription();
  o.searchFunction();

});
// END DOM ready

// Window Load
$(window).load(function(){

	o.trimTitles();
	o.loadSearchJSON();

});
// END of Window Load

// Window resize
$(window).resize(function(){

	o.ww = o.$window.width();
	o.wh = o.$window.height();
	o.fixFilters();
	//o.fixProjectPreviewHeight();
  o.sortNGO();
  
  o.trimTitles();
  
  //neviem kam s tymto
  if(o.$mainSearch.hasClass("focus")) o.$mainSearch.find("input").trigger("focusout").blur();
});
// END window resize
