<?php if ($page['help'] || ($show_messages && $messages)): ?>
  <div id='console'><div class='limiter clearfix'>
    <?php print render($page['help']); ?>
    <?php if ($show_messages && $messages): print $messages; endif; ?>
  </div></div>
<?php endif; ?>

	<div class="container">
	
		<div id='header' class="span-12">
		  
		  <div class="span-12">
			  <?php if ($site_name): ?><h1 class='site-name'><?php print $site_name ?></h1><?php endif; ?>
		  </div>
		  
		  <?php if ($page['header']): ?>
		  <div class="span-12 last">
		    <?php print render($page['header']); ?>
	      </div>
		  <?php endif; ?>
		
		  
		  
		</div>
		
		<div id='nav' class="span-24">
		
		  <?php if (isset($main_menu)) : ?>
		    <?php print theme('links', array('links' => $main_menu, 'attributes' => array('class' => 'links main-menu'))) ?>
		  <?php endif; ?>
		  
		  <?php if (isset($secondary_menu)) : ?>
		    <?php print theme('links', array('links' => $secondary_menu, 'attributes' => array('class' => 'links secondary-menu'))) ?>
		  <?php endif; ?>
		
		
		</div>
		
		<?php if ($page['highlighted']): ?>
		  <div id='highlighted'><div class='limiter clearfix'>
		    <?php print render($page['highlighted']); ?>
		  </div></div>
		<?php endif; ?>
		
		<div id='page' class="span-24">
		
		  <?php if ($page['left']): ?>
		    <div id='left' class='<?php print $left_classes ?>'>
		    	<?php print render($page['left']) ?>
		    </div>
		  <?php endif; ?>
		
		  <div id='main-content' class='<?php print $center_classes ?>'>
		    <?php if ($breadcrumb) print $breadcrumb; ?>
		    
		    <?php print render($title_prefix); ?>
		    <?php if ($title): ?><h1 class='page-title'><?php print $title ?></h1><?php endif; ?>
		    <?php print render($title_suffix); ?>
		    <?php if ($primary_local_tasks): ?><ul class='links clearfix'><?php print render($primary_local_tasks) ?></ul><?php endif; ?>
		    <?php if ($secondary_local_tasks): ?><ul class='links clearfix'><?php print render($secondary_local_tasks) ?></ul><?php endif; ?>
		    <?php if ($action_links): ?><ul class='links clearfix'><?php print render($action_links); ?></ul><?php endif; ?>
		    <div id='content' class='clearfix'><?php print render($page['content']);?></div>
		  </div>
		
		  <?php if ($page['right']): ?>
		    <div id='right'  class='<?php print $right_classes ?>'>
		    	<?php print render($page['right']) ?>
		    </div>
		  <?php endif; ?>
		
		</div>
		
		<div id="footer" class="span-24">
		  <?php print render($page['footer']) ?>
		</div>

	</div>
	
	