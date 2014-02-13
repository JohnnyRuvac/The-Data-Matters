<?
 //
 // Implementation of preprocess_page().
 //
function datamatters_static_preprocess_page(&$vars) {

  //
  // Loading taxonomy for template usage
  //

  $field = taxonomy_get_tree(3);
  foreach($field as $key => $value):

	  $vars['field'][$key]['name'] = $value->name;
	  $vars['field'][$key]['tid'] = $value->tid;
	  $vars['field'][$key]['url'] = drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid);
  endforeach;
  
  $countries = taxonomy_get_tree(2);
  foreach($countries as $key => $value):
	  $vars['countries'][$key]['name'] = $value->name;
	  $vars['countries'][$key]['tid'] = $value->tid;
	  $vars['countries'][$key]['url'] = drupal_lookup_path('alias', 'taxonomy/term/'.$value->tid);
  endforeach;
  
  // BACK referer
  $back = $_SERVER['HTTP_REFERER'];
  if(strpos($back, "dev.datamatters")) $vars['back'] = $back;
  else $vars['back'] = "";
  
  $empty = "";
  
  
  if($_GET['q'] == "node/19"){
    drupal_add_js( path_to_theme().'/js/snap.svg-min.js');
	  drupal_add_js( path_to_theme().'/js/map.js');
	  $vars['theme_hook_suggestions'][] = 'page__map';
  }
  
  //$vars['messages'] = print_r($vars, TRUE);

}

function datamatters_static_preprocess(&$vars){
	
	
	
	
}