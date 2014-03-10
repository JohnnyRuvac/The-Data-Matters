  <div id="outer-wrapper" class="clearfix">
  	<div id="wrapper">
			<? include("header.inc.tpl.php"); ?>
			<div class="main-content">
				
				<div class="content">
					<svg id="hp-container" data-url="<?php echo base_path() . path_to_theme();?>/svg/" data-json-url="<?php echo base_path();?>"></svg>
					<p id="homepage-slogan" class="slogan active">The Data-driven Policy Research projects from Central and Eastern Europe.<br />Using numbers and context to make the difference.</p>
					<a href="" class="continue-arrow"></a>
					<div class="fields-descriptions">
						<ul>
							<li>Accountability</li>
							<li>Budget</li>
							<li>Crime</li>
							<li>Municipalities</li>
							<li>Parliament/Legislation</li>
							<li>Urban Planning</li>
							<li>Vulnarable Groups</li>
							<li>Water Accesibility</li>
						</ul>
						<p id="fdp1">Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp2">2 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp3">3 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp4">4 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp5">5 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp6">6 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp7">7 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
						<p id="fdp8">8 Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</p>
					</div>
				</div>
				<div class="preload"></div>

			</div>

  	</div>
  	
	<?php include("slideout-menu.inc.tpl.php"); ?>

	<?php if ($primary_local_tasks): ?><ul class='links clearfix action-links'><?php print render($primary_local_tasks) ?></ul><?php endif; ?>
    <?php if ($secondary_local_tasks): ?><ul class='links clearfix'><?php print render($secondary_local_tasks) ?></ul><?php endif; ?>

<?php if ($page['help'] || ($show_messages && $messages)): ?>
  <div id='console'><div class='limiter clearfix'>
    <?php print render($page['help']); ?>
    <?php if ($show_messages && $messages): print $messages; endif; ?>
  </div></div>
<?php endif; ?>
