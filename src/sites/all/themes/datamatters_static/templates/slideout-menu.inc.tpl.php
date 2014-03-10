<div id="slideout-menu">
		<ul>
			<li class="svg-fix"><a class="home <?php if($active_menu == "Home") print "active";?>" href="<?=base_path()?>">Home</a></li>
			<li class="svg-fix"><a class="<?php if($active_menu == "Interactive Map") print "active";?>" href="<?=base_path()?>map">Interactive Map</a></li>
			<li><a class="<?php if($active_menu == "Projects") print "active";?>" href="<?=base_path()?>projects">Projects</a></li>
			<li><a class="<?php if($active_menu == "Organizations") print "active";?>" href="<?=base_path()?>organizations">Organizations</a></li>
			<li><a class="<?php if($active_menu == "About") print "active";?>" href="<?=base_path()?>about">About</a></li>
			<li>
				<a href="#" class="slideout-search">Search</a>
				<div class="filter-content">
					<h3>Search <a href="" class="close">Close</a></h3>
					<input type="text" class="search-input">
					<ul class="clearfix">
						<li></li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
  	
  </div>