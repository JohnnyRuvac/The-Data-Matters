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

  <meta name="description" content="">
  <meta name="author" content="">

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
  
</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
  <div class="preload"></div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
  <?php print $scripts; ?>
</body>
</html>
