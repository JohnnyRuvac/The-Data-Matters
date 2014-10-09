<!DOCTYPE html>
<!--[if lt IE 7]>  <html class="ie ie6 lte9 lte8 lte7"> <![endif]-->
<!--[if IE 7]>     <html class="ie ie7 lte9 lte8 lte7"> <![endif]-->
<!--[if IE 8]>     <html class="ie ie8 lte9 lte8"> <![endif]-->
<!--[if IE 9]>     <html class="ie ie9 lte9"> <![endif]-->
<!--[if gt IE 9]>  <html class="ie"> <![endif]-->
<!--[if !IE]><!--> <html> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, width=device-width">
  <meta name="viewport" content="initial-scale=1, maximum-scale=1" media="(device-height: 568px)">

  <meta name="copyright" content="Open Society Foundations © 2014">
  <!-- 
  
    This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
    http://creativecommons.org/licenses/by-nc-nd/4.0/
  
  -->
  
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-title" content="Visualizing Data" />
  <link rel="shortcut icon" sizes="196x196" href="/sites/all/themes/datamatters_static/icons/icon196.png">
  <link rel="shortcut icon" sizes="128x128" href="/sites/all/themes/datamatters_static/icons/icon128.png">

  <meta name="apple-mobile-web-app-title" content="Visualizing Data" />
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/sites/all/themes/datamatters_static/icons/icon144.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/sites/all/themes/datamatters_static/icons/icon114.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/sites/all/themes/datamatters_static/icons/icon72.png">
  <link rel="apple-touch-icon-precomposed" href="/sites/all/themes/datamatters_static/icons/icon57.png">
  
  <link rel="shortcut icon" href="/misc/favicon.ico">

  <?php
    if (drupal_is_front_page()) {
      echo "<script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.2/mapbox.js'></script>";
      echo "<link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.2/mapbox.css' rel='stylesheet' />";
    }
  ?>

  <?php //print $head; ?>
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <!--[if IE 8]>
	  <link type="text/css" rel="stylesheet" href="/sites/all/themes/datamatters_static/css/ie8.css" media="screen" />
  <![endif]-->
  <!--[if lt IE 9]>
  <script src="/<?=path_to_theme()?>/js/html5shiv.js"></script>
	<script src="/<?=path_to_theme()?>/js/respondjs-min.js"></script>
  <![endif]-->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  
    ga('create', 'UA-2765806-36', 'auto');
    ga('send', 'pageview');
  </script> 
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom ?>
  <?php print $scripts; ?>
</body>
</html>
