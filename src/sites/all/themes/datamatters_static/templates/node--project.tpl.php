<?
	
	$country = taxonomy_term_load($node->field_country['und'][0]['tid']);
	$field = taxonomy_term_load($node->field_field['und'][0]['tid']);
	$ngo = taxonomy_term_load($node->field_organisation['und'][0]['tid']);
	
	
	$lCountry = explode("/", drupal_lookup_path("alias", "taxonomy/term/".$country->tid));
  $lCountry = "projects#country=".str_ireplace("-", "_", $lCountry[1]);
  
  $lField = explode("/", drupal_lookup_path("alias", "taxonomy/term/".$field->tid));
  $lField = "projects#field=".str_ireplace("-", "_", $lField[1]);
	
	if(!isset($node->field_image['und'][0]['uri'])) $node->field_image['und'][0]['uri'] = "public://blank.jpg";
	
	//
	//	TEASER NODE
	//
	
	if($view_mode == 'teaser'):

		$pField = transliteration_clean_filename($field->name);
		$pCountry = transliteration_clean_filename($country->name);
?>
					<li class="project mix <?=$pField?> <?=$pCountry?> clearfix">
						<a href="<?=$node_url?>" title="<?=$node->title?>">
							<img src="<?=image_style_url("large", $node->field_image['und'][0]['uri'])?>" alt="project image">
						</a>
							<div class="content">
								<h2><a href="<?=$node_url?>" title="<?=$node->title?>"><?=truncate_utf8($node->title, 45, TRUE, TRUE)?></a></h2>
								<p class="country">
									<span class="short" data-group="countries"  data-filter="<?=transliteration_clean_filename($country->name)?>" ><a class="icon" href="/<?=$lCountry?>"><?=$country->field_short_name['und'][0]['value']?></a></span>
									<span class="long" data-group="countries" data-filter="<?=transliteration_clean_filename($country->name)?>" ><a class="icon" href="/<?=$lCountry?>"><?=$country->name?></a></span>
									
								</p>
								<p class="field "  data-group="field" data-filter="<?=transliteration_clean_filename($field->name)?>"><a class="icon" href="/<?=$lField?>"><?=$field->name?></a></p>
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
					<a href="/projects" class="close-full-preview icon">Close</a>
			  	<div class="preview-content">
			  		<img src="<?=file_create_url($node->field_image['und'][0]['uri'])?>" alt="">
				  	<h2><?=$node->title?></h2>
				  	<div class="info clearfix">
				  		<p class="country"><a class="icon" href="/<?=$lCountry?>"><?=$country->name?></a></p>
				  		<p class="field"><a class="icon" href="/<?=$lField?>"><?=$field->name?></a></p>
						<?php if(isset($node->field_link['und'][0]['url'])): ?>
					  		<p class="link">
					  			<a class="icon" href="<?=$node->field_link['und'][0]['url']?>" target="_blank">Website</a>
					  		</p>
				  		<?php endif; ?>

				  		<p class="ngo icon"><?=$ngo->name?></p>

				  		<? if(isset($ngo->field_email['und'][0]['safe_value']) || isset($ngo->field_phone['und'][0]['safe_value'])):?>
					  		<p class="contacts icon">
						  		<? if(isset($ngo->field_email['und'][0]['safe_value'])) print $ngo->field_email['und'][0]['safe_value'];?>
						  		<? if(isset($ngo->field_phone['und'][0]['safe_value'])) print $ngo->field_phone['und'][0]['safe_value'];?>
					  		</p>
					  	<? else:?>
					  		<p class="contacts icon">
						  		No contact detail provided.
					  		</p>					  		
				  		<? endif;?>
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