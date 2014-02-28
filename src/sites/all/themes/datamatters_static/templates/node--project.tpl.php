
	<!-- node--project.tpl.php -->
	
<?
	
	$country = taxonomy_term_load($node->field_country['und'][0]['tid']);
	$field = taxonomy_term_load($node->field_field['und'][0]['tid']);
	
	if(!isset($node->field_image['und'][0]['uri'])) $node->field_image['und'][0]['uri'] = "public://blank.jpg";
	
	//
	//	TEASER NODE
	//
	
	if($view_mode == 'teaser'):
?>
					<li class="project clearfix">
						<a href="<?=$node_url?>" title="<?=$node->title?>">
							<img src="<?=image_style_url("large", $node->field_image['und'][0]['uri'])?>" alt="project image">
						</a>
							<div class="content">
								<h2><a href="<?=$node_url?>" title="<?=$node->title?>"><?=truncate_utf8($node->title, 45, TRUE, TRUE)?></a></h2>
								<p class="country">
									<span class="short"><a href="/<?=drupal_lookup_path("alias", "taxonomy/term/".$country->tid)?>"><?=$country->field_short_name['und'][0]['value']?></a></span>
									<span class="long"><a href="/<?=drupal_lookup_path("alias", "taxonomy/term/".$country->tid)?>"><?=$country->name?></a></span>
									
								</p>
								<p class="field"><a href="/<?=drupal_lookup_path("alias", "taxonomy/term/".$field->tid)?>"><?=$field->name?></a></p>
							</div>
						</a>
					</li>
<?
	else:
	
	//
	//	FULL NODE
	//

?>	
				<div id="project-preview">
			  	<div class="preview-content">
			  		<img src="<?=file_create_url($node->field_image['und'][0]['uri'])?>" alt="">
				  	<h2><?=$node->title?></h2>
				  	<div class="info clearfix">
				  		<p class="country"><a href="/<?=drupal_lookup_path("alias", "taxonomy/term/".$country->tid)?>"><?=$country->name?></a> <span class="field"><a href="/<?=drupal_lookup_path("alias", "taxonomy/term/".$field->tid)?>"><?=$field->name?></a></span></p>
				  		<?php if(isset($node->field_link['und'][0]['url'])): ?>
				  		<p class="link"><a href="<?=$node->field_link['und'][0]['url']?>" target="_blank">Website</a></p>
				  		<?php endif; ?>
				  	</div>
				  	<div class="content">
				  		<p><?=$node->field_issue['und'][0]['value']?></p>
						<p><?=$node->field_solution['und'][0]['value']?></p>
						<p><?=$node->field_message['und'][0]['value']?></p>
						<? if(isset($node->field_impact['und'][0])): ?>
						<p><?=$node->field_impact['und'][0]['value']?></p>
						<? endif;?>
				  	</div>
			  	</div>
			  </div>
<?

	endif;

?>