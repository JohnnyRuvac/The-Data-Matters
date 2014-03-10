			<header>
				<div class="content">
					<?php if ($site_name): ?><h1 class="logo"><?php print $site_name ?></h1><?php endif; ?>
					<nav class="main-nav"> <div id="mob_title"><?=$node->title;?></div>
					<ul class="clearfix">
						<li class="menu-icon visible-xs"><a href="" class="icon">Menu icon</a></li>
						<li class="filter-button menu-tablet hidden-xs">
							<a class="label icon active" href=""><?=$active_menu?></a>
							<div class="filter-content">
								<ul class="clearfix">
									<li class="svg-fix"><a class="home <?php if($active_menu == "Home") print "active";?>" href="<?=base_path()?>">Home</a></li>
									<li class="svg-fix"><a class="<?php if($active_menu == "Interactive Map") print "active";?>" href="<?=base_path()?>map">Interactive Map</a></li>
									<li><a class="<?php if($active_menu == "Projects") print "active";?>" href="<?=base_path()?>projects">Projects</a></li>
									<li><a class="<?php if($active_menu == "Organizations") print "active";?>" href="<?=base_path()?>organizations">Organizations</a></li>
									<li><a class="<?php if($active_menu == "About") print "active";?>" href="<?=base_path()?>about">About</a></li>
								</ul>
							</div>
						</li>
						<div class="right clearfix">
							<li class="filter-button">
								<a class="label icon <? if($active_dictionary == "field"): print " active"; endif;?>" href="" data-orig-name="Field"><? 
										if($active_dictionary == "field"): 
											print $tax_names[$active_term];
										else:
									?>Field<? endif;?></a>
								<a href="" class="clear-filter icon" data-group="field"></a>
								<div class="filter-content">
									<h3><? 
										if($active_dictionary == "field"):
											print $tax_names[$active_term];
										else:
									?>Field<? endif;?> <a href="" class="close">Close</a></h3>
									<ul class="clearfix">
									<?php foreach($field as $value):?>
										<li class="project-filter" data-group="field" data-filter="<?=transliteration_clean_filename($value['name'])?>">
											<a href="<?=$value['url']?>"><?=$value['name']?></a>
										</li>
									<?php endforeach; ?>
									</ul>
								</div>
							</li>
							<li class="filter-button">
								<a class="label icon <? if($active_dictionary == "countries"): print " active"; endif;?>" href="" data-orig-name="Countries"><? 
										if($active_dictionary == "countries"): 
											print $tax_names[$active_term];
										else:
									?>Country<? endif;?></a>
								<a href="" class="icon clear-filter" data-group="countries"></a>
								<div class="filter-content">
									<h3><? 
										if($active_dictionary == "country"): 
											print $tax_names[$active_term];
										else:
									?>Country<? endif;?> <a href="" class="close">Close</a></h3>
									<ul class="clearfix">
										<?php foreach($countries as $value):?>
										<li class="project-filter" data-group="country" data-filter="<?=transliteration_clean_filename($value['name'])?>">
											<a href="<?=$value['url']?>"><?=$value['name']?></a>
										</li>
										<?php endforeach; ?>
									</ul>
								</div>
							</li>
						
							<li class="menu-search hidden-xs clearfix">
								<input type="text" placeholder="Search">
								<a href="#" class="submit icon">Search</a>
								<ul class="search-results">
								</ul>
							</li>
						</div>
					</ul>
				</nav>
				</div>
			</header>