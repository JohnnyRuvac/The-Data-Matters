<?
 //
 // Implementation of preprocess_page().
 //
function datamatters_static_preprocess_page(&$vars) {

  //
  // Loading taxonomy for template usage
  //

  $countries = taxonomy_get_tree(2);
  foreach($countries as $key => $value):
	  $vars['countries'][$key]['name'] = $value->name;
	  $vars['countries'][$key]['tid'] = $value->tid;
	  $vars['countries'][$key]['url'] = drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid);
	  $vars['tax_names'][$value->tid] = $value->name;
  endforeach;

  $field = taxonomy_get_tree(3);
  foreach($field as $key => $value):

	  $vars['field'][$key]['name'] = $value->name;
	  $vars['field'][$key]['tid'] = $value->tid;
	  $vars['field'][$key]['url'] = drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid);
	  $vars['tax_names'][$value->tid] = $value->name;
  endforeach;
  
  // BACK referer
  $back = $_SERVER['HTTP_REFERER'];
  if(strpos($back, "dev.datamatters")) $vars['back'] = $back;
  else $vars['back'] = "";
  
  // Map template override
  $path = drupal_get_path_alias();

  if($path == "map"){
	  drupal_add_js( path_to_theme().'/js/map.js');
	  $vars['theme_hook_suggestions'][] = 'page__map';
  }
  
  //
  // ACTIVE TRAIL
  //  
  // Taxonomy filter
  
  $vars['active_menu'] = "Projects";
  if($path == "map") $vars['active_menu'] = "Interactive Map";
  if($path == "about") $vars['active_menu'] = "About";
  if($path == "Organizations") $vars['active_menu'] = "Organizations";
  
  $vars['active_dictionary'] = "";
  if(strpos($_GET['q'], "axonomy/term/")){
	  $vars['active_term'] = str_ireplace("taxonomy/term/", "", $_GET['q']);
	  $vars['active_dictionary'] = explode("/", $path)[0];
	  
  }
  	
  if(isset($vars['node']->field_country['und'][0])) $menu_country = taxonomy_term_load($vars['node']->field_country['und'][0]['tid']);
  
  
  
  // console
  $vars['messages'] = print_r($path.$vars['active_menu'], TRUE);
}

function datamatters_static_preprocess(&$vars){
	
	
	
	
}