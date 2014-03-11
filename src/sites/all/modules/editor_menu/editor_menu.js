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

(function($) {
	$(document).ready(function() {
		
		if($("#editormenu").length > 0){
			
				$("#editormenu").hoverIntent(function(){
					$(this).animate({width: "150", paddingLeft: "15"}, 200);
				}, function(){
					$(this).animate({width: "30", paddingLeft: "5"}, 300);
				});
				
				$(".action-links a").each(function(){
					$(this).addClass($(this).html().toLowerCase().replace(" ", "_"));
				})
				
		}
	
	
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
	
		$(window).load(function(){
			
			$(".menu-search .submit").click(function(e){
  			e.preventDefault();
  			
  			$(".menu-search input").trigger("focusin").focus();
  			
			});
			
			$("#slideout-menu .filter-content li a, .main-nav .search-results li a").live("click", function(e){
			  
			  o.clickSearch = true;
  			
  			var windowLink = window.location.pathname;
  			var newLink = $(this).attr("href");
  			
  			if(windowLink == "/projects" && !newLink.indexOf("/projects")){
  			  e.preventDefault();
  			  var filter = newLink.split("#")[1].split("=")[1];
    			var group = newLink.split("#")[1].split("=")[0];
    			
    			if($(window).width() <= 768){
    			  window.location.hash = "#" + group + "=" + filter;
            window.location.reload(true);
  			  }
    			
    			
    			var $filterLi = $('.project-filter[data-filter="' + filter + '"]'),
      				$filterButton = $filterLi.closest(".filter-button"),
      				text = $filterLi.text();
              
              console.log(group, $filterLi.html(), $filterButton, text);
      
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
			})
			
			$(".menu-search input, #slideout-menu .search-input").keyup(function(e){
				var str = $(this).val().toLowerCase();
				
				if(str.length > 0){
  				$(".menu-search .search-results, #slideout-menu ul.clearfix").html(searchArray(str, nameArray));
  				if(!$(this).hasClass("search-input")) $(".menu-search .search-results").parent().addClass("active");
				}else{
  				$(".menu-search .search-results").parent().removeClass("active");
				}
	
			}).focusin(function(){
  			if(!$(this).hasClass("search-input")){
    			 $(this).parent().addClass("focus");
    			 
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
    			 //console.log(leftSpace);
        }
			}).focusout(function(){
  			if(!$(this).hasClass("search-input")){
    			var search = $(this);
    			setTimeout(function(e){
    			  console.log(o.clickSearch);
      			if(!o.clickSearch) {
        			search.parent().removeClass("focus").removeClass("active");
      			} 
    			}, 200);
  			} 
			})
			
			
			
			
		})
	
	
	});
})(jQuery); 

function searchArray(str, arr){
  o.clickSearch = false;
  var items = [];
  var count = 0;
	$.each(arr, function(key, val){
	  count++;
		if(val.low.search(str.toLowerCase()) >= 0){
		  items.push("<li><a href='"+val.link+"'>"+val.name+"</a></li>");
		  $("#slideout-menu .filter-content").addClass("populated");
		}else{
		  $("#slideout-menu .filter-content").removeClass("populated");  		
		}
		//if(count > 10) return false;
	})

	return items.join("");
}

