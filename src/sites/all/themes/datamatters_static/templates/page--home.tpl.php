  <div id="outer-wrapper" class="clearfix">
  	<div id="wrapper">
			<? include("header.inc.tpl.php"); ?>
			<div class="main-content">
				
				<div class="content">
					<svg id="hp-container" data-url="<?php echo base_path() . path_to_theme();?>/svg/" data-json-url="<?php echo base_path();?>"></svg>
					<p id="homepage-slogan" class="slogan active">The Data-driven Policy Research projects from Central and Eastern Europe.<br />Using numbers and context to make the difference.</p>
					<p id="countries-text">Think Tank Fund has supported projects in&nbsp;9&nbsp;different countries across Central and Eastern Europe.</p>
					<p id="relationships-text">The various projects have made clearer understanding and made difference in<br />8 different fields from budget through crime to&nbsp;municipalities issues.</p>
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
						<p id="fdp1">The accessible and open information are powerful when properly used. Our projects show the ways how to use them and how to communicate them clearly.</p>
						<p id="fdp2">Huge number and many different expenditures and money flows – that is generally budget. The projects showcased here give inspirations how to arrange complex information and make them understandable for general public.</p>
						<p id="fdp3">It is important to openly communicate about crime and use the data together with geographical locations. It is also crucial for the better prevention and finding the right solutions.</p>
						<p id="fdp4">The problem with the governance in municipalities is that they use very often different statistics and not the coherent data. Our projects highlight how it can be done clearly with focus on added value and to compare municipalities easily.</p>
						<p id="fdp5">The Parliament Searchlight in Bosnia and Herzegovina gives inspiration how to communicate the legislative process openly and with the focus on giving the important insight for citizens.</p>
						<p id="fdp6">Project in Skopje gives us the example how it is possible to give more transparency in urban planning and more information for citizens.</p>
						<p id="fdp7">There is a lot of prejudices about vulnerable groups and also many difficulties to help them. The project in Hungary shows how to use online and offline tools to make a difference.</p>
						<p id="fdp8">The water accessibility is a big issue in different regions across the world. The project OpenTaps creates the area for discussion, open data and finding the solutions.</p>
					</div>
				</div>
				<div class="last-page">
					<p>The Data-driven Policy Research projects from Central and Eastern Europe. Using numbers and context to make the difference.</p>
					<a href="/map" class="int-map-link">Interactive map</a>
					<a href="/projects" class="projects-link">View projects</a>
				</div>
				<a class="osf-logo" href="//www.opensocietyfoundations.org/" target="_blank">Open Society Foundations</a>

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
