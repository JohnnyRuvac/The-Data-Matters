/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:800};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);

var nameArray = [];

jQuery(document).ready(function($) {
	
	if(jQuery("#editormenu").length > 0){
		
			jQuery("#editormenu").hoverIntent(function(){
				jQuery(this).animate({width: "150", paddingLeft: "15"}, 200);
			}, function(){
				jQuery(this).animate({width: "30", paddingLeft: "5"}, 300);
			});
			
			jQuery(".action-links a").each(function(){
				$(this).addClass($(this).html().toLowerCase().replace(" ", "_"));
			})
			
	}


	$(window).load(function(){
		$.getJSON("/json/countries", function(data){
			$.each(data, function(key, val){
				nameArray.push({"name":val.country.name, "low":val.country.name.toLowerCase(), "link":val.country.link});
			})
		})
		$.getJSON("/json/fields", function(data){
			$.each(data, function(key, val){
				nameArray.push({"name":val.field.name,"low":val.field.name.toLowerCase(), "link":val.field.link});
			})
		})
		$.getJSON("/json/projects", function(data){
			$.each(data, function(key, val){
				nameArray.push({"name":val.node.title, "low":val.node.title.toLowerCase(), "link":val.node.path});
			})

		})
		
		$(".menu-search input, #slideout-menu .search-input").keyup(function(e){
			var str = $(this).val().toLowerCase();
			
			$(".menu-search .search-results, #slideout-menu ul.clearfix")
			.html(searchArray(str, nameArray));
			if(!$(this).hasClass("search-input")) $(".menu-search .search-results").parent().addClass("active");

		})
		
	})


});


function searchArray(str, arr){
	var items = [];
		
	$.each(arr, function(key, val){
		if(val.low.search(str.toLowerCase()) >= 0) items.push("<li><a href='"+val.link+"'>"+val.name+"</a></li>");
	})

	return items.join("");
}

