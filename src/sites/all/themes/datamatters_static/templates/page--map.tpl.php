  <div id="outer-wrapper" class="clearfix">
  	<div id="wrapper">
			<? include("header.inc.tpl.php"); ?>
			<div class="main-content">
				
				<div id="country-info">
					<a href="" class="country"></a>
					<p class="type"></p>
					<p class="population">Population: <span></span></p>
					<p class="gdp">GDP (PPP): <span></span></p>
					<ul></ul>
				</div>
				
				<svg id="map-container" data-url="<?php echo base_path() . path_to_theme();?>/svg/" data-json-url="<?php echo base_path();?>"></svg>

			</div>

  	</div>
  	
	<div id="slideout-menu">
		<ul>
			<li><a href="">Projects</a></li>
			<li><a href="">Organizations</a></li>
			<li><a href="">About</a></li>
			<li>
				<a href="" class="slideout-search">Search</a>
				<div class="filter-content">
					<h3>Search <a href="" class="close">Close</a></h3>
					<input type="text" class="search-input">
					<ul class="clearfix">
						<li><a href="">Search autocomplete</a></li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
  	
  </div>

	<?php if ($primary_local_tasks): ?><ul class='links clearfix action-links'><?php print render($primary_local_tasks) ?></ul><?php endif; ?>
    <?php if ($secondary_local_tasks): ?><ul class='links clearfix'><?php print render($secondary_local_tasks) ?></ul><?php endif; ?>

<?php if ($page['help'] || ($show_messages && $messages)): ?>
  <div id='console'><div class='limiter clearfix'>
    <?php print render($page['help']); ?>
    <?php if ($show_messages && $messages): print $messages; endif; ?>
  </div></div>
<?php endif; ?>
