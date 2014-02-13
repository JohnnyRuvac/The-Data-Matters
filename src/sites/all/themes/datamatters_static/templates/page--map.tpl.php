  <div id="outer-wrapper" class="clearfix">
  	<div id="wrapper">
    
			<header>
				<div class="content">
					<?php if ($site_name): ?><h1 class="logo"><?php print $site_name ?></h1><?php endif; ?>
					<nav class="main-nav">
					<ul class="clearfix">
						<li class="menu-icon visible-xs"><a href="">Menu icon</a></li>
						<li class="filter-button menu-tablet hidden-xs">
							<a class="label active" href=""><?=$active_menu?></a>
							<div class="filter-content">
								<ul class="clearfix">
									<li><a href="<?=base_path()?>map">Interactive Map</a></li>
									<li><a class="<?php if($active_menu == "Projects") print "active";?>" href="<?=base_path()?>projects">Projects</a></li>
									<li><a href="<?=base_path()?>about">About</a></li>
									<li><a href="<?=base_path()?>organizations">Organizations</a></li>
								</ul>
							</div>
						</li>
						<div class="right clearfix">
							<li class="filter-button">
								<a class="label<? if($active_dictionary == "field"): print " active"; endif;?>" href=""><? 
										if($active_dictionary == "field"): 
											print $tax_names[$active_term];
										else:
									?>Field<? endif;?></a>
								<div class="filter-content">
									<h3><? 
										if($active_dictionary == "field"):
											print $tax_names[$active_term];
										else:
									?>Field<? endif;?> <a href="" class="close">Close</a></h3>
									<ul class="clearfix">
									<?php foreach($field as $value):?>
										<li><a href="<?=$value['url']?>"><?=$value['name']?></a></li>
									<?php endforeach; ?>
									</ul>
								</div>
							</li>
							<li class="filter-button">
								<a class="label <? if($active_dictionary == "countries"): print " active"; endif;?>" href=""><? 
										if($active_dictionary == "countries"): 
											print $tax_names[$active_term];
										else:
									?>Country<? endif;?></a>
								<div class="filter-content">
									<h3><? 
										if($active_dictionary == "country"): 
											print $tax_names[$active_term];
										else:
									?>Country<? endif;?> <a href="" class="close">Close</a></h3>
									<ul class="clearfix">
										<?php foreach($countries as $value):?>
										<li><a href="<?=$value['url']?>"><?=$value['name']?></a></li>
										<?php endforeach; ?>
									</ul>
								</div>
							</li>
						
							<li class="menu-search hidden-xs clearfix">
								<input type="text" placeholder="Search">
								<a href="" class="submit">Search</a>
								<ul class="search-results">
									<li><a href="">Search result</a></li>
									<li><a href="">Search result</a></li>
									<li><a href="">Search result</a></li>
									<li><a href="">Search result</a></li>
								</ul>
							</li>
						</div>
					</ul>
					<a href="<?=$back?>" class="close-full-preview">Close</a>
				</nav>
				</div>
			</header>
			<div class="main-content">
				
				<div id="logo-container"></div>
				<svg id="map-container" data-url="<?php echo base_path() . path_to_theme();?>/svg/"></svg>

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
						<li><a href="">Search autocomplete</a></li>
						<li><a href="">Search autocomplete</a></li>
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
